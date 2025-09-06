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
        g.set3_team2
      FROM games g
      JOIN slots ON g.slotRef = slots.id
      JOIN teams t1 ON g.team1Ref = t1.id
      JOIN teams t2 ON g.team2Ref = t2.id
      WHERE g.set1_team1 IS NOT NULL
      ORDER BY slots.date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// POST /api/results
router.post("/", async (req, res) => {
  try {
    const {
      team1,
      team2,
      set1_team1,
      set1_team2,
      set2_team1,
      set2_team2,
      set3_team1,
      set3_team2,
    } = req.body;

    // look up team IDs
    const [team1Row] = await db.query("SELECT id FROM teams WHERE name = ?", [
      team1,
    ]);
    const [team2Row] = await db.query("SELECT id FROM teams WHERE name = ?", [
      team2,
    ]);

    if (!team1Row || !team2Row) {
      return res.status(400).json({ error: "Unknown team name" });
    }

    const team1Ref = team1Row.id;
    const team2Ref = team2Row.id;

    // compute sets won
    let sets_team1 = 0,
      sets_team2 = 0;
    if (set1_team1 > set1_team2) sets_team1++;
    else sets_team2++;
    if (set2_team1 > set2_team2) sets_team1++;
    else sets_team2++;
    if (set3_team1 !== null && set3_team2 !== null) {
      if (set3_team1 > set3_team2) sets_team1++;
      else sets_team2++;
    }

    // compute winner
    let winnerRef = 0;
    if (sets_team1 > sets_team2) winnerRef = team1Ref;
    else if (sets_team2 > sets_team1) winnerRef = team2Ref;

    // compute points
    const points_team1 = set1_team1 + set2_team1 + (set3_team1 || 0);
    const points_team2 = set1_team2 + set2_team2 + (set3_team2 || 0);

    // insert
    await db.query(
      `INSERT INTO games
       (slotRef, team1Ref, team2Ref, winnerRef,
        set1_team1, set1_team2, set2_team1, set2_team2, set3_team1, set3_team2,
        sets_team1, sets_team2, points_team1, points_team2,
        refNoShow, team1NoShow, team2NoShow)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)`,
      [
        0, // slotRef (if you don’t track it yet)
        team1Ref,
        team2Ref,
        winnerRef,
        set1_team1,
        set1_team2,
        set2_team1,
        set2_team2,
        set3_team1,
        set3_team2,
        sets_team1,
        sets_team2,
        points_team1,
        points_team2,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur insertion résultat", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
