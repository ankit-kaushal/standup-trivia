const express = require("express");
const GameSession = require("../models/GameSession");
const GameResponse = require("../models/GameResponse");
const GameConfig = require("../models/GameConfig");
const Player = require("../models/Player");
const Question = require("../models/Question");

const router = express.Router();

function requireAdmin(req, res, next) {
  const username = String(req.header("x-admin-username") || "").trim();
  const password = String(req.header("x-admin-password") || "");
  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

router.post("/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  return res.json({ ok: true });
});

router.use(requireAdmin);

router.get("/stats", async (_req, res) => {
  const [responsesCount, sessionsCount, playersCount, questionsCount] = await Promise.all([
    GameResponse.countDocuments({}),
    GameSession.countDocuments({ status: "finished" }),
    Player.countDocuments({}),
    Question.countDocuments({ isActive: true }),
  ]);
  res.json({ responsesCount, sessionsCount, playersCount, questionsCount });
});

router.get("/scores", async (req, res) => {
  const sortBy = String(req.query.sortBy || "endedAt_desc");
  const sortMap = {
    endedAt_desc: { endedAt: -1 },
    endedAt_asc: { endedAt: 1 },
    score_desc: { score: -1, endedAt: -1 },
    score_asc: { score: 1, endedAt: -1 },
    percent_desc: { percent: -1, endedAt: -1 },
    percent_asc: { percent: 1, endedAt: -1 },
    xp_desc: { totalXp: -1, endedAt: -1 },
    xp_asc: { totalXp: 1, endedAt: -1 },
  };
  const sort = sortMap[sortBy] || sortMap.endedAt_desc;
  const sessions = await GameSession.find({ status: "finished" })
    .sort(sort)
    .limit(200)
    .populate("playerId", "name")
    .lean();

  const rows = sessions.map((s) => ({
    sessionId: String(s._id),
    name: s.playerId?.name || "Unknown",
    score: s.score,
    totalQuestions: s.totalQuestions,
    percent: s.percent,
    bestStreak: s.bestStreak,
    totalXp: s.totalXp,
    endedAt: s.endedAt,
  }));

  res.json({ rows });
});

router.post("/reset", async (_req, res) => {
  await Promise.all([
    GameResponse.deleteMany({}),
    GameSession.deleteMany({}),
    Player.deleteMany({}),
  ]);
  res.json({ ok: true });
});

router.get("/players", async (_req, res) => {
  const rows = await Player.find({}).sort({ name: 1, createdAt: -1 }).lean();
  res.json({
    rows: rows.map((p) => ({
      id: String(p._id),
      name: p.name,
    })),
  });
});

router.get("/responses", async (req, res) => {
  const playerId = String(req.query.playerId || "").trim();
  const filter = playerId ? { playerId } : {};
  const rows = await GameResponse.find(filter)
    .sort({ createdAt: -1 })
    .limit(1000)
    .populate("playerId", "name")
    .lean();
  res.json({
    rows: rows.map((r) => ({
      id: String(r._id),
      playerName: r.playerId?.name || "Unknown",
      questionIndex: r.questionIndex,
      question: r.question,
      category: r.category,
      type: r.type,
      selectedAnswer: r.selectedAnswer,
      correctAnswer: r.correctAnswer,
      isCorrect: r.isCorrect,
      durationMs: r.durationMs,
      createdAt: r.createdAt,
    })),
  });
});

router.post("/responses/clear", async (_req, res) => {
  await GameResponse.deleteMany({});
  res.json({ ok: true });
});

router.post("/config", async (req, res) => {
  const questionTimeSec = Number(req.body.questionTimeSec);

  if (!Number.isFinite(questionTimeSec)) {
    return res.status(400).json({ message: "Invalid question timer value." });
  }

  let config = await GameConfig.findOne({ isActive: true }).sort({ updatedAt: -1 });
  if (!config) {
    config = await GameConfig.create({ questionTimeSec, qnaTimeSec: 60, isActive: true });
  } else {
    config.questionTimeSec = questionTimeSec;
    await config.save();
  }

  res.json({ questionTimeSec: config.questionTimeSec, qnaTimeSec: config.qnaTimeSec });
});

router.get("/questions", async (_req, res) => {
  const rows = await Question.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  res.json({ rows });
});

router.post("/questions", async (req, res) => {
  const payload = req.body || {};
  const type = String(payload.type || "").trim();
  const category = String(payload.category || "General").trim();
  const question = String(payload.question || "").trim();
  const options = Array.isArray(payload.options)
    ? payload.options.map((o) => String(o).trim()).filter(Boolean)
    : [];
  const answer = payload.answer === null || payload.answer === undefined ? null : Number(payload.answer);
  const correctIndices = Array.isArray(payload.correctIndices)
    ? payload.correctIndices.map((n) => Number(n)).filter(Number.isFinite)
    : [];
  const correctAnswer = String(payload.correctAnswer || "").trim();
  const timeSec = payload.timeSec === null || payload.timeSec === undefined ? null : Number(payload.timeSec);
  const prompt = String(payload.prompt || "").trim();
  const scrambled = String(payload.scrambled || "").trim();
  const score = Number(payload.score ?? 1);

  if (!type || !question) {
    return res.status(400).json({ message: "type and question are required." });
  }

  if ((type === "pick_one" || type === "pick_many") && options.length < 2) {
    return res.status(400).json({ message: "At least 2 options required for option-based questions." });
  }

  const created = await Question.create({
    type,
    category,
    question,
    options,
    answer: Number.isFinite(answer) ? answer : null,
    correctIndices,
    correctAnswer,
    score: Number.isFinite(score) ? score : 1,
    timeSec: Number.isFinite(timeSec) ? timeSec : null,
    prompt,
    scrambled,
  });

  res.status(201).json({ id: String(created._id) });
});

router.put("/questions/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};
  const type = String(payload.type || "").trim();
  const category = String(payload.category || "General").trim();
  const question = String(payload.question || "").trim();
  const options = Array.isArray(payload.options)
    ? payload.options.map((o) => String(o).trim()).filter(Boolean)
    : [];
  const answer = payload.answer === null || payload.answer === undefined ? null : Number(payload.answer);
  const correctIndices = Array.isArray(payload.correctIndices)
    ? payload.correctIndices.map((n) => Number(n)).filter(Number.isFinite)
    : [];
  const correctAnswer = String(payload.correctAnswer || "").trim();
  const timeSec = payload.timeSec === null || payload.timeSec === undefined ? null : Number(payload.timeSec);
  const prompt = String(payload.prompt || "").trim();
  const scrambled = String(payload.scrambled || "").trim();
  const score = Number(payload.score ?? 1);

  if (!type || !question) {
    return res.status(400).json({ message: "type and question are required." });
  }
  if ((type === "pick_one" || type === "pick_many") && options.length < 2) {
    return res.status(400).json({ message: "At least 2 options required for option-based questions." });
  }

  const updated = await Question.findByIdAndUpdate(
    id,
    {
      $set: {
        type,
        category,
        question,
        options,
        answer: Number.isFinite(answer) ? answer : null,
        correctIndices,
        correctAnswer,
        score: Number.isFinite(score) ? score : 1,
        timeSec: Number.isFinite(timeSec) ? timeSec : null,
        prompt,
        scrambled,
      },
    },
    { new: true },
  );
  if (!updated) return res.status(404).json({ message: "Question not found." });
  res.json({ ok: true });
});

router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  const question = await Question.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
  if (!question) return res.status(404).json({ message: "Question not found." });
  res.json({ ok: true });
});

module.exports = router;
