const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true, index: true },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    totalXp: { type: Number, default: 0 },
    status: { type: String, enum: ["started", "finished"], default: "started", index: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GameSession", gameSessionSchema);
