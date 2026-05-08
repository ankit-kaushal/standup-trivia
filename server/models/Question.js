const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["pick_one", "true_false", "pick_many", "fill_blank", "word_scramble", "qna"],
    },
    category: { type: String, default: "General", trim: true, maxlength: 80 },
    question: { type: String, required: true, trim: true },
    prompt: { type: String, default: "", trim: true },
    options: [{ type: String, trim: true }],
    answer: { type: Number, default: null },
    correctIndices: [{ type: Number }],
    correctAnswer: { type: String, default: "", trim: true },
    acceptedAnswers: [{ type: String, trim: true }],
    scrambled: { type: String, default: "", trim: true },
    score: { type: Number, default: 1, min: 1, max: 100 },
    timeSec: { type: Number, default: null, min: 5, max: 600 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Question", questionSchema);
