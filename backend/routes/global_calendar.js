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
      cup
      FROM games
      JOIN slots ON games.slotRef = slots.id
      JOIN teams t1 ON games.team1Ref = t1.id
      JOIN teams t2 ON games.team2Ref = t2.id
      WHERE DATE(slots.date) >= CURDATE()
      ORDER BY DATE(slots.date) ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching global calendar:", err);
    res.status(500).json({ error: "Failed to fetch global calendar" });
  }
});

module.exports = router;
