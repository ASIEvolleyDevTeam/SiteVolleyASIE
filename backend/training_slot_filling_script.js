const db = require("../db");

const startDate = new Date("2025-09-01"); // lundi 1 sept 2025
const endDate = new Date("2026-09-01"); // 1 an plus tard
const slots = ["18:00:00", "19:00:00", "20:00:00"];
const days = ["lundi", "jeudi"];

async function seed() {
  let current = new Date(startDate);

  while (current < endDate) {
    // insérer la semaine
    const [weekResult] = await db.query(
      "INSERT INTO weeks (start_date) VALUES (?)",
      [current.toISOString().split("T")[0]]
    );
    const weekId = weekResult.insertId;

    // insérer les créneaux lundi + jeudi
    for (const day of days) {
      for (const time of slots) {
        await db.query(
          "INSERT INTO training_time_slots (week_id, day, time) VALUES (?, ?, ?)",
          [weekId, day, time]
        );
      }
    }

    // avancer au lundi suivant
    current.setDate(current.getDate() + 7);
  }

  console.log("Préremplissage terminé ✅");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
