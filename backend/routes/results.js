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
        g.set1_team1,
        g.set1_team2,
        g.set2_team1,
        g.set2_team2,
        g.set3_team1,
        g.set3_team2,
        COALESCE(CONCAT(p.prenom, ' ', p.nom), 'À définir') AS referee
      FROM games g
      JOIN slots ON g.slotRef = slots.id
      JOIN teams t1 ON g.team1Ref = t1.id
      JOIN teams t2 ON g.team2Ref = t2.id
      LEFT JOIN players p ON g.refereeRef = p.id
      WHERE g.set1_team1 IS NOT NULL
      ORDER BY slots.date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

module.exports = router;
