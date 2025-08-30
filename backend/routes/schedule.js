// routes/schedule.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // ton module MySQL (à adapter si tu utilises mysql2/promise)

// POST /api/admin/login
router.post("/admin/login", async (req, res) => {
  const { password } = req.body;

  if (password === process.env.MATCH_PASSWORD) {
    return res.json({ success: true });
  }
  return res
    .status(403)
    .json({ success: false, error: "Mot de passe invalide" });
});

// GET /api/schedule?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/", async (req, res) => {
  try {
    const { from, to } = req.query;

    const [weeks] = await db.query(
      "SELECT * FROM weeks WHERE start_date BETWEEN ? AND ? ORDER BY start_date ASC",
      [from, to]
    );

    // récupérer slots + équipes pour chaque semaine
    const [slots] = await db.query(
      `SELECT s.id, s.week_id, s.day, s.terrain, t.team_name
       FROM terrain_training_slots s
       LEFT JOIN teams_training_slots t ON t.slot_id = s.id
       WHERE s.week_id IN (?) 
       ORDER BY s.day, s.terrain`,
      [weeks.map((w) => w.id)]
    );

    // regrouper slots par semaine
    const weeksWithSlots = weeks.map((week) => {
      const weekSlots = slots.filter((s) => s.week_id === week.id);

      // reconstituer les slots avec leurs équipes
      const groupedSlots = weekSlots.reduce((acc, s) => {
        if (!acc[s.id]) {
          acc[s.id] = {
            id: s.id,
            day: s.day,
            time: s.time,
            teams: [],
          };
        }
        if (s.team_name) acc[s.id].teams.push(s.team_name);
        return acc;
      }, {});

      return {
        id: week.id,
        start_date: week.start_date,
        days: ["lundi", "jeudi"].map((day) => ({
          label: `${day}`,
          timeslots: Object.values(groupedSlots).filter((sl) => sl.day === day),
        })),
      };
    });

    res.json(weeksWithSlots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/schedule/slots/:id/register
router.post("/slots/:id/register", async (req, res) => {
  try {
    const { teamName, password } = req.body;
    const slotId = req.params.id;

    if (password !== process.env.MATCH_PASSWORD) {
      return res.status(403).json({ error: "Mot de passe invalide" });
    }

    // vérifier nombre d’équipes déjà inscrites
    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM teams_training_slots WHERE slot_id = ?",
      [slotId]
    );
    if (rows[0].count >= 2) {
      return res.status(400).json({ error: "Créneau complet" });
    }

    await db.query(
      "INSERT INTO teams_training_slots (slot_id, team_name) VALUES (?, ?)",
      [slotId, teamName]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/schedule/slots/:id/unregister
router.delete("/slots/:id/unregister", async (req, res) => {
  try {
    const { teamName, password } = req.body;
    const slotId = req.params.id;

    if (password !== process.env.MATCH_PASSWORD) {
      return res.status(403).json({ error: "Mot de passe invalide" });
    }

    await db.query(
      "DELETE FROM teams_training_slots WHERE slot_id = ? AND team_name = ?",
      [slotId, teamName]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
module.exports = router;
