const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:poolId", async (req, res) => {
  const poolId = parseInt(req.params.poolId);

  try {
    const [rows] = await db.query(
      `
      SELECT 
        t.id,
        t.name AS team,
        t.points AS points,
        COUNT(g.id) AS played,
        SUM(CASE WHEN (g.winnerRef = t.id) THEN 1 ELSE 0 END) AS victory,
        SUM(CASE WHEN (g.winnerRef IS NOT NULL AND g.winnerRef != t.id AND (g.team1Ref = t.id OR g.team2Ref = t.id)) THEN 1 ELSE 0 END) AS defeat,
        SUM(CASE WHEN t.id = g.team1Ref THEN g.sets_team1
                 WHEN t.id = g.team2Ref THEN g.sets_team2
                 ELSE 0 END) AS set_for,
        SUM(CASE WHEN t.id = g.team1Ref THEN g.sets_team2
                 WHEN t.id = g.team2Ref THEN g.sets_team1
                 ELSE 0 END) AS set_against,
        SUM(CASE WHEN t.id = g.team1Ref THEN g.points_team1
                 WHEN t.id = g.team2Ref THEN g.points_team2
                 ELSE 0 END) AS points_for,
        SUM(CASE WHEN t.id = g.team1Ref THEN g.points_team2
                 WHEN t.id = g.team2Ref THEN g.points_team1
                 ELSE 0 END) AS points_against,
        SUM(CASE WHEN t.id = g.team1Ref THEN g.team1NoShow
                 WHEN t.id = g.team2Ref THEN g.team2NoShow
                 ELSE 0 END) AS no_show,
        SUM(CASE WHEN g.refereeRef IS NULL THEN 0 ELSE 
                 CASE WHEN p.teamId = t.id THEN 0 ELSE 1 END
             END) AS no_referee,
        ROUND(
          SUM(CASE WHEN t.id = g.team1Ref THEN g.sets_team1
                   WHEN t.id = g.team2Ref THEN g.sets_team2
                   ELSE 0 END)
          /
          NULLIF(
            SUM(CASE WHEN t.id = g.team1Ref THEN g.sets_team2
                     WHEN t.id = g.team2Ref THEN g.sets_team1
                     ELSE 0 END), 0
          ), 2
        ) AS set_ratio,
        ROUND(
          SUM(CASE WHEN t.id = g.team1Ref THEN g.points_team1
                   WHEN t.id = g.team2Ref THEN g.points_team2
                   ELSE 0 END)
          /
          NULLIF(
            SUM(CASE WHEN t.id = g.team1Ref THEN g.points_team2
                     WHEN t.id = g.team2Ref THEN g.points_team1
                     ELSE 0 END), 0
          ), 2
        ) AS point_ratio
      FROM teams t
      JOIN teams_pools tp ON tp.teamRef = t.id
      LEFT JOIN games g ON g.team1Ref = t.id OR g.team2Ref = t.id
      LEFT JOIN players p ON g.refereeRef = p.id
      WHERE tp.poolRef = ?
      GROUP BY t.id
      ORDER BY victory DESC, set_ratio DESC
      `,
      [poolId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error computing rankings:", err);
    res.status(500).json({ error: "Failed to compute rankings" });
  }
});

module.exports = router;
