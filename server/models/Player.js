const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Player", playerSchema);
