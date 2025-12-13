const express = require("express");
const router = express.Router();
const db = require("../db");

// Return all cup matches with resolved team names and dates
router.get("/", async (req, res) => {
  try {
      const [rows] = await db.query(`
      SELECT 
        cg.id,
        DATE_FORMAT(s.date, '%Y-%m-%d') AS date,
        t1.name AS team1,
        t2.name AS team2,
        w.name AS winner,
        cg.set1_team1, cg.set1_team2,
        cg.set2_team1, cg.set2_team2,
        cg.set3_team1, cg.set3_team2,
        cg.nextGameRef
      FROM cupgames cg
      LEFT JOIN teams t1 ON cg.team1Ref = t1.id
      LEFT JOIN teams t2 ON cg.team2Ref = t2.id
      LEFT JOIN teams w ON cg.winnerRef = w.id
      LEFT JOIN slots s ON cg.slotRef = s.id
      ORDER BY cg.id ASC
    `);
    res.json(rows);
  } catch (err) {
      console.error("Error fetching cup games:", err);
      res.status(500).json({
        error: err.message,
        code: err.code
  });
}
});

module.exports = router;
