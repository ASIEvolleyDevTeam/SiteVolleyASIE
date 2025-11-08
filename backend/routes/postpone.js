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
    res.status(500).json({ error: err.message || "Failed to fetch results" });
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


    

    // --- UPDATE existing game (do NOT touch slot/team refs) ---
    await db.query(
      `INSERT INTO postponed_games
       VALUES (?, ?, ?; ?)
       
       DELETE FROM games 
       WHERE id = ?`,
      [
        gameId,
        slotRef,
        team1Ref,
        team2Ref,
        gameId,
      ]
    );

    return res.json({ success: true, gameId });
  } catch (err) {
    console.error("Erreur ajout report:", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

module.exports = router;
