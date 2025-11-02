// import-slots.js
// Inserts distinct dates from the CSV into the `slots` table (id, date).
// Usage: node import-slots.js --file "./Calendrier final Asie (dates corrigées).csv"

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import mysql from "mysql2/promise";

// charge les valeurs depuis .env (process.cwd() est utilisé par défaut)
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
// support DB_PASS ou DB_PASSWORD from your .env
const DB_PASS = process.env.DB_PASS || process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// ---- CLI arg ----
const argIdx = process.argv.indexOf("--file");
if (argIdx === -1 || !process.argv[argIdx + 1]) {
  console.error("Usage: node import-slots.js --file /path/to/calendar.csv");
  process.exit(1);
}
const csvPath = path.resolve(process.argv[argIdx + 1]);

// ---- Helpers ----
function parseDDMMYYYY(s) {
  // Expect "DD/MM/YYYY"
  const [dd, mm, yyyy] = s.split("/").map((x) => parseInt(x, 10));
  if (!dd || !mm || !yyyy) return null;
  const iso = `${yyyy.toString().padStart(4, "0")}-${mm
    .toString()
    .padStart(2, "0")}-${dd.toString().padStart(2, "0")}`;
  return iso;
}

function normalizeDate(row) {
  // Prefer DateISO if present
  if (row.DateISO && String(row.DateISO).trim()) {
    const iso = String(row.DateISO).trim();
    // Very light sanity check: YYYY-MM-DD length 10
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  }
  // Fallback to Date (DD/MM or DD/MM/YYYY)
  if (row.Date && String(row.Date).trim()) {
    const raw = String(row.Date).trim();
    // If already DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) return parseDDMMYYYY(raw);
    // If it's DD/MM (shouldn’t be the case now, but handle defensively)
    if (/^\d{2}\/\d{2}$/.test(raw)) {
      throw new Error(
        `Found DD/MM without year ("${raw}"). Please export with year (DateISO or Date = DD/MM/YYYY).`
      );
    }
  }
  return null;
}

async function main() {
  // 1) Read CSV
  const csv = fs.readFileSync(csvPath, "utf8");
  const records = parse(csv, {
    columns: true, // use header row
    skip_empty_lines: true,
    delimiter: ",", // your file uses ','
    bom: true,
    trim: true,
  });

  // 2) Collect unique ISO dates
  const dateSet = new Set();
  for (const row of records) {
    const iso = normalizeDate(row);
    if (!iso) continue; // ignore rows without date
    dateSet.add(iso);
  }
  const dates = Array.from(dateSet).sort();

  if (dates.length === 0) {
    console.log("No valid dates found in CSV.");
    process.exit(0);
  }

  console.log(`Found ${dates.length} distinct date(s) in CSV.`);

  // 3) DB connection
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    multipleStatements: false,
  });

  try {
    await conn.beginTransaction();

    // Optional: ensure slots table exists (comment out if not needed)
    // await conn.execute(`
    //   CREATE TABLE IF NOT EXISTS slots (
    //     id   INT AUTO_INCREMENT PRIMARY KEY,
    //     date DATE NOT NULL
    //   )
    // `);

    // Insert each date only if it doesn't already exist.
    // Uses parameterized query; no CSV values are interpolated into SQL strings.
    const sql =
      `INSERT INTO asievolley06.slots (date) ` +
      `SELECT ? WHERE NOT EXISTS (SELECT 1 FROM slots WHERE date = ?)`;

    let inserted = 0;
    for (const d of dates) {
      const [result] = await conn.execute(sql, [d, d]);
      // result.affectedRows === 1 if inserted, 0 if it already existed
      if (result && result.affectedRows === 1) inserted += 1;
    }

    await conn.commit();
    console.log(
      `Done. Inserted ${inserted} new slot(s). Already existing: ${
        dates.length - inserted
      }.`
    );
  } catch (err) {
    await conn.rollback();
    console.error("Error, rolled back:", err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
