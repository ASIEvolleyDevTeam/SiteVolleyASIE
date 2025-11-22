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

    /* === POINTS DE CLASSEMENT === */
    SUM(
        CASE 
            WHEN gs.no_show = 1 THEN 0
            WHEN gs.winner = t.id THEN 3
            WHEN gs.winner != t.id AND gs.sets_for >= 1 THEN 2
            WHEN gs.winner != t.id THEN 1
            ELSE 0
        END
    ) AS points,

    COUNT(gs.game_id) AS played,
    SUM(CASE WHEN gs.winner = t.id THEN 1 ELSE 0 END) AS victory,
    SUM(CASE WHEN gs.winner != t.id THEN 1 ELSE 0 END) AS defeat,
    SUM(gs.no_show) AS no_show,

    /* Sets */
    SUM(gs.sets_for) AS set_for,
    SUM(gs.sets_against) AS set_against,
    ROUND(
        SUM(gs.sets_for) / NULLIF(SUM(gs.sets_against), 0), 2
    ) AS set_ratio,

    /* Points marqués / encaissés */
    SUM(gs.points_for) AS points_for,
    SUM(gs.points_against) AS points_against,
    ROUND(
        SUM(gs.points_for) / NULLIF(SUM(gs.points_against), 0), 2
    ) AS point_ratio

FROM teams t
JOIN teams_pools tp ON tp.teamRef = t.id

LEFT JOIN (
    SELECT
        g.id AS game_id,
        g.team1Ref,
        g.team2Ref,

        /* === Sets valides === */
        (CASE WHEN g.set1_team1 + g.set1_team2 >= 34 THEN 1 ELSE 0 END) AS s1_valid,
        (CASE WHEN g.set2_team1 + g.set2_team2 >= 34 THEN 1 ELSE 0 END) AS s2_valid,
        (CASE WHEN g.set3_team1 + g.set3_team2 >= 20 THEN 1 ELSE 0 END) AS s3_valid,

        /* === Sets gagnés "valides" === */
        /* Team 1 */
        (
            (CASE WHEN g.set1_team1 > g.set1_team2 AND g.set1_team1 + g.set1_team2 >= 34 THEN 1 ELSE 0 END) +
            (CASE WHEN g.set2_team1 > g.set2_team2 AND g.set2_team1 + g.set2_team2 >= 34 THEN 1 ELSE 0 END) +
            (CASE WHEN g.set3_team1 > g.set3_team2 AND g.set3_team1 + g.set3_team2 >= 20 THEN 1 ELSE 0 END)
        ) AS sets_team1_valid,

        /* Team 2 */
        (
            (CASE WHEN g.set1_team2 > g.set1_team1 AND g.set1_team1 + g.set1_team2 >= 34 THEN 1 ELSE 0 END) +
            (CASE WHEN g.set2_team2 > g.set2_team1 AND g.set2_team1 + g.set2_team2 >= 34 THEN 1 ELSE 0 END) +
            (CASE WHEN g.set3_team2 > g.set3_team1 AND g.set3_team1 + g.set3_team2 >= 20 THEN 1 ELSE 0 END)
        ) AS sets_team2_valid,

        /* === Points totaux === */
        (g.set1_team1 + g.set2_team1 + g.set3_team1) AS points_team1_total,
        (g.set1_team2 + g.set2_team2 + g.set3_team2) AS points_team2_total,

        /* === Vainqueur === */
        CASE 
            WHEN g.team1NoShow = 1 THEN g.team2Ref
            WHEN g.team2NoShow = 1 THEN g.team1Ref

            /* 2 sets valides gagnés */
            WHEN (
                (CASE WHEN g.set1_team1 > g.set1_team2 AND g.set1_team1 + g.set1_team2 >= 34 THEN 1 ELSE 0 END) +
                (CASE WHEN g.set2_team1 > g.set2_team2 AND g.set2_team1 + g.set2_team2 >= 34 THEN 1 ELSE 0 END) +
                (CASE WHEN g.set3_team1 > g.set3_team2 AND g.set3_team1 + g.set3_team2 >= 20 THEN 1 ELSE 0 END)
            ) >= 2 THEN g.team1Ref

            WHEN (
                (CASE WHEN g.set1_team2 > g.set1_team1 AND g.set1_team1 + g.set1_team2 >= 34 THEN 1 ELSE 0 END) +
                (CASE WHEN g.set2_team2 > g.set2_team1 AND g.set2_team1 + g.set2_team2 >= 34 THEN 1 ELSE 0 END) +
                (CASE WHEN g.set3_team2 > g.set3_team1 AND g.set3_team1 + g.set3_team2 >= 20 THEN 1 ELSE 0 END)
            ) >= 2 THEN g.team2Ref

            /* Match interrompu → gagnant = plus de sets valides */
            WHEN 
                (
                    (CASE WHEN g.set1_team1 > g.set1_team2 AND g.set1_team1 + g.set1_team2 >= 34 THEN 1 ELSE 0 END) +
                    (CASE WHEN g.set2_team1 > g.set2_team2 AND g.set2_team1 + g.set2_team2 >= 34 THEN 1 ELSE 0 END) +
                    (CASE WHEN g.set3_team1 > g.set3_team2 AND g.set3_team1 + g.set3_team2 >= 20 THEN 1 ELSE 0 END)
                )
                >
                (
                    (CASE WHEN g.set1_team2 > g.set1_team1 AND g.set1_team1 + g.set1_team2 >= 34 THEN 1 ELSE 0 END) +
                    (CASE WHEN g.set2_team2 > g.set2_team1 AND g.set2_team1 + g.set2_team2 >= 34 THEN 1 ELSE 0 END) +
                    (CASE WHEN g.set3_team2 > g.set3_team1 AND g.set3_team1 + g.set3_team2 >= 20 THEN 1 ELSE 0 END)
                )
            THEN g.team1Ref

            WHEN 
                (
                    (CASE WHEN g.set1_team2 > g.set1_team1 AND g.set1_team1 + g.set1_team2 >= 34 THEN 1 ELSE 0 END) +
                    (CASE WHEN g.set2_team2 > g.set2_team1 AND g.set2_team1 + g.set2_team2 >= 34 THEN 1 ELSE 0 END) +
                    (CASE WHEN g.set3_team2 > g.set3_team1 AND g.set3_team1 + g.set3_team2 >= 20 THEN 1 ELSE 0 END)
                )
                >
                (
                    (CASE WHEN g.set1_team1 > g.set1_team2 AND g.set1_team1 + g.set1_team2 >= 34 THEN 1 ELSE 0 END) +
                    (CASE WHEN g.set2_team1 > g.set2_team2 AND g.set2_team1 + g.set2_team2 >= 34 THEN 1 ELSE 0 END) +
                    (CASE WHEN g.set3_team1 > g.set3_team2 AND g.set3_team1 + g.set3_team2 >= 20 THEN 1 ELSE 0 END)
                )
            THEN g.team2Ref

            /* 1–1 en sets valides → gagnant = total points */
            WHEN (g.set1_team1 + g.set2_team1 + g.set3_team1) >
                 (g.set1_team2 + g.set2_team2 + g.set3_team2)
            THEN g.team1Ref
            ELSE g.team2Ref
        END AS winner,

        /* === Pour calcul détaillé par équipe === */
        /* no show */
        CASE WHEN g.team1NoShow = 1 OR g.team2NoShow = 1 THEN 1 ELSE 0 END AS no_show,

        /* points pour/contre */
        (g.set1_team1 + g.set2_team1 + g.set3_team1) AS points_team1,
        (g.set1_team2 + g.set2_team2 + g.set3_team2) AS points_team2

    FROM games g
) AS gs 
ON gs.team1Ref = t.id OR gs.team2Ref = t.id

WHERE tp.poolRef = ?
GROUP BY t.id
ORDER BY points DESC;
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
