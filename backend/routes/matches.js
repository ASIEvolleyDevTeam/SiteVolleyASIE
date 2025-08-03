// routes/matches.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM games");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
});
router.get("/upcoming", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(slots.date, '%d/%m') AS date,
        t1.name AS team1,
        t2.name AS team2,
        COALESCE(CONCAT(p.prenom, ' ', p.nom), 'À définir') AS referee
      FROM games
      JOIN slots ON games.slotRef = slots.id
      JOIN teams t1 ON games.team1Ref = t1.id
      JOIN teams t2 ON games.team2Ref = t2.id
      LEFT JOIN players p ON games.refereeRef = p.id
      WHERE slots.date >= CURDATE()
      ORDER BY slots.date ASC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching upcoming matches:", err);
    res.status(500).json({ error: "Failed to fetch upcoming matches" });
  }
});

module.exports = router;
