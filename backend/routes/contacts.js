const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        teams.name AS team,
        CONCAT(p.prenom, ' ', p.nom) AS player,
        p.mail
      FROM players p
      JOIN teams ON p.teamId = teams.id
      ORDER BY teams.name ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

module.exports = router;
