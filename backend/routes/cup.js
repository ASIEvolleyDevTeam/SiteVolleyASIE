const express = require("express");
const router = express.Router();
const db = require("../db");

// Return all cup matches with resolved team names and dates
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        g.id,
        DATE_FORMAT(s.date, '%Y-%m-%d') AS date,
        t1.name AS team1,
        t2.name AS team2,
        w.name AS winner,
        g.set1_team1, g.set1_team2,
        g.set2_team1, g.set2_team2,
        g.set3_team1, g.set3_team2,
      FROM games g
      WHERE cg.cup = 1
      LEFT JOIN teams t1 ON g.team1Ref = t1.id
      LEFT JOIN teams t2 ON g.team2Ref = t2.id
      LEFT JOIN teams w ON g.winnerRef = w.id
      LEFT JOIN slots s ON g.slotRef = s.id
      ORDER BY g.id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching cup games:", err);
    res.status(500).json({ error: "Failed to fetch cup games" });
  }
});

module.exports = router;
