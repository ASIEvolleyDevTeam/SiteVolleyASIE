const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(slots.date, '%d/%m') AS date,
        t1.name AS team1,
        t2.name AS team2,
      FROM postponed_games p
      JOIN slots ON p.slotRef = slots.id
      JOIN teams t1 ON p.team1Ref = t1.id
      JOIN teams t2 ON p.team2Ref = t2.id
      ORDER BY slots.date ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching postponed matches:", err);
    res.status(500).json({ error: "Failed to fetch postponed matches" });
  }
});
module.exports = router;
