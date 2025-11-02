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
      ORDER BY slots.date ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// POST /api/results  (UPDATE ONLY)
router.post("/", async (req, res) => {
  try {
    console.log("Payload reçu:", req.body);

    const {
      date, // expected YYYY-MM-DD
      team1, // team name as in teams.name
      team2, // team name as in teams.name
      set1_team1,
      set1_team2,
      set2_team1,
      set2_team2,
      set3_team1,
      set3_team2,
      // optional no-show flags if you plan to use them later
      refNoShow = 0,
      team1NoShow = 0,
      team2NoShow = 0,
    } = req.body;

    if (!date || !team1 || !team2) {
      return res
        .status(400)
        .json({ error: "Champs obligatoires manquants (date, team1, team2)" });
    }

    // --- find existing slot by date (do NOT create it) ---
    const [slotRows] = await db.query("SELECT id FROM slots WHERE date = ?", [
      date,
    ]);
    if (!slotRows.length) {
      return res
        .status(404)
        .json({ error: "Aucun slot existant pour cette date", date });
    }
    const slotRef = slotRows[0].id;

    // --- resolve team IDs (do NOT create them) ---
    const [[team1Rows], [team2Rows]] = await Promise.all([
      db.query("SELECT id FROM teams WHERE name = ?", [team1]),
      db.query("SELECT id FROM teams WHERE name = ?", [team2]),
    ]);
    if (!team1Rows.length || !team2Rows.length) {
      return res.status(400).json({
        error: "Équipe inconnue",
        details: { team1, team2 },
      });
    }
    const team1Ref = team1Rows[0].id;
    const team2Ref = team2Rows[0].id;

    // --- find existing game for that slot & those teams (try both orders) ---
    let gameId = null;
    {
      const [g1] = await db.query(
        "SELECT id FROM games WHERE slotRef = ? AND team1Ref = ? AND team2Ref = ?",
        [slotRef, team1Ref, team2Ref]
      );
      if (g1.length) {
        gameId = g1[0].id;
      } else {
        const [g2] = await db.query(
          "SELECT id FROM games WHERE slotRef = ? AND team1Ref = ? AND team2Ref = ?",
          [slotRef, team2Ref, team1Ref]
        );
        if (g2.length) {
          gameId = g2[0].id;
        }
      }
    }

    if (!gameId) {
      return res.status(404).json({
        error:
          "Match non trouvé dans la table games pour ce créneau et ces équipes",
        details: { date, team1, team2, slotRef },
      });
    }

    // --- sanitize numbers ---
    const n = (v) =>
      v === null || v === "" || v === undefined ? null : Number(v);
    const s1t1 = n(set1_team1) ?? 0;
    const s1t2 = n(set1_team2) ?? 0;
    const s2t1 = n(set2_team1) ?? 0;
    const s2t2 = n(set2_team2) ?? 0;
    const s3t1 = n(set3_team1) ?? 0;
    const s3t2 = n(set3_team2) ?? 0;

    // --- compute sets won (ignore set 3 if both are 0/null) ---
    let sets_team1 = 0,
      sets_team2 = 0;
    if (s1t1 > s1t2) sets_team1++;
    else if (s1t2 > s1t1) sets_team2++;
    if (s2t1 > s2t2) sets_team1++;
    else if (s2t2 > s2t1) sets_team2++;
    if ((s3t1 ?? 0) !== 0 || (s3t2 ?? 0) !== 0) {
      if (s3t1 > s3t2) sets_team1++;
      else if (s3t2 > s3t1) sets_team2++;
    }

    // --- compute winner ---
    let winnerRef = null;
    if (sets_team1 > sets_team2) winnerRef = team1Ref;
    else if (sets_team2 > sets_team1) winnerRef = team2Ref;

    // --- UPDATE existing game (do NOT touch slot/team refs) ---
    await db.query(
      `UPDATE games
         SET winnerRef = ?,
             set1_team1 = ?, set1_team2 = ?,
             set2_team1 = ?, set2_team2 = ?,
             set3_team1 = ?, set3_team2 = ?,
             sets_team1  = ?, sets_team2  = ?,
             points_team1 = ?, points_team2 = ?,
             refNoShow = ?, team1NoShow = ?, team2NoShow = ?
       WHERE id = ?`,
      [
        winnerRef,
        s1t1,
        s1t2,
        s2t1,
        s2t2,
        s3t1,
        s3t2,
        sets_team1,
        sets_team2,
        0,
        0, // points: ajustez si vous les calculez
        n(refNoShow) ?? 0,
        n(team1NoShow) ?? 0,
        n(team2NoShow) ?? 0,
        gameId,
      ]
    );

    return res.json({ success: true, gameId });
  } catch (err) {
    console.error("Erreur update résultat:", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

module.exports = router;
