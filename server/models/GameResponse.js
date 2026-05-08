const mongoose = require("mongoose");

const gameResponseSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "GameSession", required: true, index: true },
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true, index: true },
    questionIndex: { type: Number, required: true },
    question: { type: String, required: true },
    category: { type: String, default: "" },
    type: { type: String, default: "" },
    selectedAnswer: { type: String, default: "" },
    correctAnswer: { type: String, default: "" },
    isCorrect: { type: Boolean, default: false },
    durationMs: { type: Number, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GameResponse", gameResponseSchema);
