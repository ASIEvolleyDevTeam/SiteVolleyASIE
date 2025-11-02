// import-games.js
// Usage:
//   DB_HOST=localhost DB_USER=root DB_PASS=secret DB_NAME=asie \
//   node import-games.js --file "./championship_calendar.csv" [--dry-run] [--create-slots]
//
// CSV expected headers: Date, Equipe 1, Equipe 2, Coupe
// Date can be "YYYY-MM-DD" (DateISO) or "DD/MM/YYYY" (Date)

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import mysql from "mysql2/promise";
import "dotenv/config";
// charge les valeurs depuis .env (process.cwd() est utilisé par défaut)
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
// support DB_PASS ou DB_PASSWORD from your .env
const DB_PASS = process.env.DB_PASS || process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// ---- CLI ----
function getArg(flag, dflt = null) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : dflt;
}
function hasFlag(flag) {
  return process.argv.includes(flag);
}
const fileArg = getArg("--file");
if (!fileArg) {
  console.error(
    "Usage: node import-games.js --file /path/to/championship_calendar.csv [--dry-run] [--create-slots]"
  );
  process.exit(1);
}
const csvPath = path.resolve(fileArg);
const DRY_RUN = hasFlag("--dry-run");
const CREATE_SLOTS = hasFlag("--create-slots");

// ---- CSV helpers ----
function detectDelimiter(firstLine) {
  if (firstLine.includes(";")) return ";";
  if (firstLine.includes(",")) return ",";
  if (firstLine.includes("\t")) return "\t";
  return ",";
}
function parseDDMMYYYY(s) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(s).trim());
  if (!m) return null;
  const dd = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const yyyy = parseInt(m[3], 10);
  return `${String(yyyy).padStart(4, "0")}-${String(mm).padStart(
    2,
    "0"
  )}-${String(dd).padStart(2, "0")}`;
}
function normalizeDate(row) {
  // If there's a DateISO column, prefer it
  if (row.DateISO && /^\d{4}-\d{2}-\d{2}$/.test(String(row.DateISO).trim())) {
    return String(row.DateISO).trim();
  }
  // Otherwise use Date (DD/MM/YYYY)
  if (row.Date) {
    const iso = parseDDMMYYYY(row.Date);
    if (iso) return iso;
  }
  return null;
}

// ---- Main ----
(async () => {
  // 1) Read CSV
  const csvText = fs.readFileSync(csvPath, "utf8");
  const firstLine = csvText.split(/\r?\n/)[0] ?? "";
  const delimiter = detectDelimiter(firstLine);

  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    delimiter,
    bom: true,
    trim: true,
  });

  // 2) Normalize rows
  const matches = [];
  for (const r of rows) {
    const dateIso = normalizeDate(r);
    const team1 = (r["Equipe 1"] ?? "").trim();
    const team2 = (r["Equipe 2"] ?? "").trim();
    if (!dateIso || !team1 || !team2) continue;
    matches.push({ dateIso, team1, team2, coupe: (r["Coupe"] ?? "").trim() });
  }

  if (matches.length === 0) {
    console.error(
      "No valid rows found. Expect columns: Date (DD/MM/YYYY) or DateISO (YYYY-MM-DD), Equipe 1, Equipe 2."
    );
    process.exit(1);
  }

  // 3) DB
  // Build DB config with a reasonable connect timeout so the script doesn't hang forever
  const dbConfig = {
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    connectTimeout: 10_000, // 10s
    multipleStatements: false,
  };

  // If you need SSL CA (Aiven etc), enable it via USE_CA=true and optional DB_CA_PATH to a pem file
  if (process.env.USE_CA === "true") {
    try {
      if (process.env.DB_CA_PATH) {
        dbConfig.ssl = {
          ca: fs.readFileSync(path.resolve(process.env.DB_CA_PATH)),
        };
        console.log("Loaded DB CA from", process.env.DB_CA_PATH);
      } else {
        // Insecure fallback for local testing — DO NOT use in production.
        console.warn(
          "USE_CA=true but DB_CA_PATH is not set. Falling back to insecure SSL (rejectUnauthorized=false). " +
            "Download the provider CA and set DB_CA_PATH to avoid this."
        );
        dbConfig.ssl = { rejectUnauthorized: false };
      }
    } catch (e) {
      console.error("Failed to load DB CA file:", e.message);
      console.warn(
        "Falling back to insecure SSL (rejectUnauthorized=false). For production, set DB_CA_PATH to a valid CA PEM."
      );
      dbConfig.ssl = { rejectUnauthorized: false };
    }
  }

  console.log("Connecting to DB", dbConfig.host + ":" + dbConfig.port);
  const db = await mysql.createConnection(dbConfig);
  console.log("DB connected");

  // Caches
  const slotIdByDate = new Map();
  const teamIdByName = new Map();

  async function getSlotId(dateIso) {
    if (slotIdByDate.has(dateIso)) return slotIdByDate.get(dateIso);
    // Try fetch
    const [rows] = await db.execute(
      "SELECT id FROM asievolley06.slots WHERE date = ?",
      [dateIso]
    );
    if (rows.length) {
      slotIdByDate.set(dateIso, rows[0].id);
      return rows[0].id;
    }
    if (!CREATE_SLOTS) return null;
    if (!DRY_RUN) {
      await db.execute(
        "INSERT INTO asievolley06.slots (date) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM slots WHERE date = ?)",
        [dateIso, dateIso]
      );
    }
    // fetch again
    const [rows2] = await db.execute(
      "SELECT id FROM asievolley06.slots WHERE date = ?",
      [dateIso]
    );
    if (rows2.length) {
      slotIdByDate.set(dateIso, rows2[0].id);
      return rows2[0].id;
    }
    return null;
  }

  async function getTeamId(name) {
    const key = name;
    if (teamIdByName.has(key)) return teamIdByName.get(key);
    const [rows] = await db.execute(
      "SELECT id FROM asievolley06.teams WHERE name = ?",
      [name]
    );
    if (rows.length) {
      teamIdByName.set(key, rows[0].id);
      return rows[0].id;
    }
    return null;
  }

  async function gameExists(slotId, t1, t2) {
    const [rows] = await db.execute(
      "SELECT id FROM asievolley06.games WHERE slotRef = ? AND team1Ref = ? AND team2Ref = ?",
      [slotId, t1, t2]
    );
    return rows.length > 0;
  }

  let inserted = 0;
  const missingTeams = new Set();
  const missingSlots = new Set();

  try {
    if (!DRY_RUN) await db.beginTransaction();

    for (const m of matches) {
      const slotId = await getSlotId(m.dateIso);
      if (!slotId) {
        missingSlots.add(m.dateIso);
        continue;
      }
      const t1 = await getTeamId(m.team1);
      const t2 = await getTeamId(m.team2);
      if (!t1) missingTeams.add(m.team1);
      if (!t2) missingTeams.add(m.team2);
      if (!t1 || !t2) continue;

      // Skip duplicates
      if (await gameExists(slotId, t1, t2)) continue;

      if (!DRY_RUN) {
        await db.execute(
          "INSERT INTO asievolley06.games (slotRef, team1Ref, team2Ref) VALUES (?, ?, ?)",
          [slotId, t1, t2]
        );
      }
      inserted++;
    }

    if (!DRY_RUN) await db.commit();
  } catch (e) {
    if (!DRY_RUN) await db.rollback();
    console.error("Error, rolled back:", e.message);
    process.exit(1);
  } finally {
    await db.end();
  }

  console.log(`Processed ${matches.length} rows.`);
  console.log(`Inserted ${inserted} game(s).`);
  if (missingTeams.size) {
    console.log("Missing team(s) (check names in teams.name):");
    for (const t of missingTeams) console.log(" -", t);
  }
  if (missingSlots.size) {
    console.log(
      "Missing slot date(s). Use --create-slots to auto-create them:"
    );
    for (const d of missingSlots) console.log(" -", d);
  }
})();
