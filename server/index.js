const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDb } = require("./db");
const gameRoutes = require("./routes/game");
const adminRoutes = require("./routes/admin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const rootDir = path.resolve(__dirname, "..");

app.use(cors());
app.use(express.json());

app.use("/api/game", gameRoutes);
app.use("/api/admin", adminRoutes);

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(rootDir, "admin.html"));
});

app.use(express.static(rootDir));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

let dbConnected = false;
async function ensureDb() {
  if (!dbConnected) {
    await connectDb();
    dbConnected = true;
  }
}

if (require.main === module) {
  ensureDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

module.exports = { app, ensureDb };
