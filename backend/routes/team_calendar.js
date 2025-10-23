const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:teamName", async (req, res) => {
  const teamName = req.params.teamName;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        DATE_FORMAT(slots.date, '%Y-%m-%d') AS date,
        t1.name AS team1,
        t2.name AS team2,
        g.set1_team1, g.set1_team2,
        g.set2_team1, g.set2_team2,
        g.set3_team1, g.set3_team2
      FROM games g
      JOIN slots ON g.slotRef = slots.id
      JOIN teams t1 ON g.team1Ref = t1.id
      JOIN teams t2 ON g.team2Ref = t2.id
      WHERE (t1.name = ? OR t2.name = ?) AND DATE(slots.date) > CURDATE()
      ORDER BY DATE(slots.date) ASC
    `,
      [teamName, teamName]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching team calendar:", err);
    res.status(500).json({ error: "Failed to fetch calendar" });
  }
});

module.exports = router;
