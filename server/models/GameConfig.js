const mongoose = require("mongoose");

const gameConfigSchema = new mongoose.Schema(
  {
    questionTimeSec: { type: Number, default: 30, min: 5, max: 300 },
    qnaTimeSec: { type: Number, default: 60, min: 10, max: 600 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GameConfig", gameConfigSchema);
