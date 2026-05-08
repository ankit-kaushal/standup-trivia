const express = require("express");
const Player = require("../models/Player");
const GameSession = require("../models/GameSession");
const GameResponse = require("../models/GameResponse");
const GameConfig = require("../models/GameConfig");
const Question = require("../models/Question");

const router = express.Router();

async function getActiveConfig() {
  let config = await GameConfig.findOne({ isActive: true }).sort({ updatedAt: -1 });
  if (!config) {
    config = await GameConfig.create({ questionTimeSec: 30, qnaTimeSec: 60, isActive: true });
  }
  return config;
}

router.get("/config", async (_req, res) => {
  const config = await getActiveConfig();
  res.json({ questionTimeSec: config.questionTimeSec, qnaTimeSec: config.qnaTimeSec });
});

router.get("/questions", async (_req, res) => {
  const rows = await Question.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  res.json({
    questions: rows.map((q) => ({
      id: String(q._id),
      type: q.type,
      category: q.category,
      question: q.question,
      prompt: q.prompt,
      options: q.options || [],
      answer: q.answer,
      correctIndices: q.correctIndices || [],
      correctAnswer: q.correctAnswer,
      acceptedAnswers: q.acceptedAnswers || [],
      scrambled: q.scrambled || "",
      score: Number.isFinite(q.score) ? q.score : 1,
      timeSec: q.timeSec ?? null,
    })),
  });
});

router.post("/start", async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ message: "Name is required." });

  const player = await Player.create({ name });
  const session = await GameSession.create({ playerId: player._id });
  const config = await getActiveConfig();

  res.status(201).json({
    playerId: String(player._id),
    sessionId: String(session._id),
    questionTimeSec: config.questionTimeSec,
    qnaTimeSec: config.qnaTimeSec,
  });
});

router.post("/response", async (req, res) => {
  const {
    sessionId,
    playerId,
    questionIndex,
    question,
    category,
    type,
    selectedAnswer,
    correctAnswer,
    isCorrect,
    durationMs,
  } = req.body;

  if (!sessionId || !playerId || typeof questionIndex !== "number" || !question) {
    return res.status(400).json({ message: "Missing required response fields." });
  }

  const response = await GameResponse.create({
    sessionId,
    playerId,
    questionIndex,
    question,
    category,
    type,
    selectedAnswer: selectedAnswer ?? "",
    correctAnswer: correctAnswer ?? "",
    isCorrect: Boolean(isCorrect),
    durationMs: Number.isFinite(durationMs) ? durationMs : null,
  });

  res.status(201).json({ id: String(response._id) });
});

router.post("/finish", async (req, res) => {
  const { sessionId, score, totalQuestions, percent, bestStreak, totalXp } = req.body;

  if (!sessionId) return res.status(400).json({ message: "sessionId is required." });

  const session = await GameSession.findByIdAndUpdate(
    sessionId,
    {
      $set: {
        score: Number(score || 0),
        totalQuestions: Number(totalQuestions || 0),
        percent: Number(percent || 0),
        bestStreak: Number(bestStreak || 0),
        totalXp: Number(totalXp || 0),
        status: "finished",
        endedAt: new Date(),
      },
    },
    { new: true },
  );

  if (!session) return res.status(404).json({ message: "Session not found." });

  res.json({ ok: true });
});

module.exports = router;
