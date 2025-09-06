// routes/schedule.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // ton module MySQL (à adapter si tu utilises mysql2/promise)

// POST /api/super_admin/login
router.post("/login", async (req, res) => {
  const { password } = req.body;

  if (password === process.env.SUPER_ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  return res
    .status(403)
    .json({ success: false, error: "Mot de passe invalide" });
});
module.exports = router;
