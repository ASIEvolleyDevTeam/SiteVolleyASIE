// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const scheduleRoutes = require("./routes/schedule");

const matchesRoutes = require("./routes/matches");
const rankingsRoutes = require("./routes/rankings");
const globalCalendarRoutes = require("./routes/global_calendar");
const globalCalendarPreviewRoutes = require("./routes/global_calendar_preview");
const teamCalendarRoutes = require("./routes/team_calendar");
const resultsRoutes = require("./routes/results");
const postponedMatchesRoutes = require("./routes/postponed_matches");
const cupRoutes = require("./routes/cup");
const contactsRoutes = require("./routes/contacts");
const superAdminRoutes = require("./routes/super_admin");
const postponed_matches = require("./routes/postpone")

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());

app.use("/api/schedule", scheduleRoutes);

app.use("/api/matches", matchesRoutes);
app.use("/api/rankings", rankingsRoutes);
app.use("/api/global_calendar", globalCalendarRoutes);
app.use("/api/global_calendar_preview", globalCalendarPreviewRoutes);
app.use("/api/team_calendar", teamCalendarRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/postponed_matches", postponedMatchesRoutes);
app.use("/api/cupgames", cupRoutes);
app.use("/api/postpone")

app.use("/api/contacts", contactsRoutes);

app.use("/api/super_admin", superAdminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
