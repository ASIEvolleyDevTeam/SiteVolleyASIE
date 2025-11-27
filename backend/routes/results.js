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
        s1t1 + s2t1 + s3t1,
        s1t2 + s2t2 + s3t2, 
        n(refNoShow) ?? 0,
        n(team1NoShow) ?? 0,
        n(team2NoShow) ?? 0,
        gameId,
      ]
    );

     // Update scores
    let points1 = null;
    let points2 = null;

    // Fonction pour vérifier si un set est valide (terminé aux 2/3)
    function isSetValid(score1, score2, isThirdSet = false) {
        if (isThirdSet) {
            // Pour le 3ème set, au moins 20 points doivent avoir été joués
            return (score1 + score2) >= 20;
        }
        // Pour les sets 1 et 2, au moins 40 points doivent avoir été joués (2/3 de 60)
        return (score1 + score2) >= 34;
    }

    // Fonction pour déterminer le gagnant d'un set
    function getSetWinner(score1, score2, isThirdSet = false) {
        if (!isSetValid(score1, score2, isThirdSet)) {
            return null; // Set non terminé
        }
        
        if (isThirdSet) {
            // 3ème set : gagnant à 15 points avec 2 points d'écart
            if (score1 >= 15 && score1 - score2 >= 2) return 1;
            if (score2 >= 15 && score2 - score1 >= 2) return 2;
        } else {
            // Sets 1 et 2 : gagnant à 25 points avec 2 points d'écart
            if (score1 >= 25 && score1 - score2 >= 2) return 1;
            if (score2 >= 25 && score2 - score1 >= 2) return 2;
        }
        
        return null; // Set non terminé
    }

    // Déterminer les gagnants de chaque set
    const set1Winner = getSetWinner(s1t1, s1t2, false);
    const set2Winner = getSetWinner(s2t1, s2t2, false);
    const set3Winner = getSetWinner(s3t1, s3t2, true);

    // Compter les sets gagnés
    const setsTeam1 = [set1Winner, set2Winner, set3Winner].filter(winner => winner === 1).length;
    const setsTeam2 = [set1Winner, set2Winner, set3Winner].filter(winner => winner === 2).length;

    // Vérifier si le match est complet (2 sets gagnés par une équipe)
    const isMatchComplete = setsTeam1 === 2 || setsTeam2 === 2;

    if (isMatchComplete) {
        // Match complet - déterminer le vainqueur
        if (setsTeam1 > setsTeam2) {
            // Victoire équipe 1
            points1 = 3;
            // Déterminer si équipe 2 a gagné au moins un set
            points2 = (setsTeam2 > 0) ? 2 : 1;
        } else {
            // Victoire équipe 2
            points2 = 3;
            // Déterminer si équipe 1 a gagné au moins un set
            points1 = (setsTeam1 > 0) ? 2 : 1;
        }
    } else {
        // Match interrompu - appliquer les règles d'interruption
        if (setsTeam1 > setsTeam2) {
            // Équipe 1 a gagné plus de sets
            points1 = 3;
            points2 = (setsTeam2 > 0) ? 2 : 1;
        } else if (setsTeam2 > setsTeam1) {
            // Équipe 2 a gagné plus de sets
            points2 = 3;
            points1 = (setsTeam1 > 0) ? 2 : 1;
        } else {
            // Même nombre de sets gagnés - départager par le total de points
            const totalPoints1 = s1t1 + s2t1 + s3t1;
            const totalPoints2 = s1t2 + s2t2 + s3t2;
            
            if (totalPoints1 > totalPoints2) {
                points1 = 3;
                points2 = (setsTeam2 > 0) ? 2 : 1;
            } else if (totalPoints2 > totalPoints1) {
                points2 = 3;
                points1 = (setsTeam1 > 0) ? 2 : 1;
            } else {
                // Égalité parfaite (très rare)
                points1 = 2; // Défaite avec set gagné pour les deux
                points2 = 2;
            }
        }
    }

    await db.query(
      `UPDATE teams
        SET points = points + ?
        WHERE name = ?`,
      [
        points1,
        team1,
      ]
    );
    await db.query(
      `UPDATE teams
        SET points = points + ?
        WHERE name = ?`,
      [
        points2,
        team2,
      ]
    );
    
    return res.json({ success: true, gameId });
  } catch (err) {
    console.error("Erreur update résultat:", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

module.exports = router;
