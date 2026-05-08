/** @typedef {"pick_one" | "true_false" | "pick_many" | "fill_blank" | "word_scramble" | "qna"} ChallengeType */

const FORMAT_LABELS = {
  pick_one: "Multiple choice",
  true_false: "True / false",
  pick_many: "Select all that apply",
  fill_blank: "Fill in the blank",
  word_scramble: "Word scramble",
  qna: "QnA",
};

const ROUND_SIZE = 10;

/* const LEGACY_QUESTION_BANK = [
  {
    type: "pick_one",
    category: "Roadmap",
    question:
      "What is the basis of the unified roadmap (2026-platform-roadmap)?",
    options: [
      "Only leadership direction",
      "Collective input plus customer and business impact",
      "Engineering estimates only",
      "Release team priorities only",
    ],
    answer: 1,
  },
  {
    type: "true_false",
    category: "Culture",
    question:
      "Only people in formal product roles should submit customer-facing product ideas.",
    answer: false,
  },
  {
    type: "pick_one",
    category: "Culture",
    question: "Who can contribute product ideas?",
    options: [
      "Only Product Managers",
      "Only Engineering and Architecture",
      "Anyone across the company",
      "Only leadership",
    ],
    answer: 2,
  },
  {
    type: "fill_blank",
    category: "Collaboration",
    question:
      "If there is misalignment, you should _____ it early and resolve through discussion before escalating with context.",
    correctAnswer: "Raise",
  },
  {
    type: "pick_one",
    category: "Collaboration",
    question:
      "If there is misalignment, what should happen first according to the guidelines?",
    options: [
      "Ignore it if deadlines are near",
      "Raise it early and resolve through discussion",
      "Escalate immediately without discussion",
      "Wait for the next quarterly review",
    ],
    answer: 1,
  },
  {
    type: "true_false",
    category: "Execution",
    question:
      "ClickUp (or equivalent work tracking) should be updated roughly once per week during active delivery.",
    answer: false,
  },
  {
    type: "pick_one",
    category: "Execution",
    question:
      "When should engineering blockers generally be surfaced for support?",
    options: [
      "After 3 hours",
      "After 1 full day",
      "Beyond 30 to 60 minutes",
      "Only during stand-up",
    ],
    answer: 2,
  },
  {
    type: "fill_blank",
    category: "Execution",
    question:
      "Surface blockers beyond _____ to _____ minutes to seek support.",
    correctAnswer: "30 to 60",
  },
  {
    type: "fill_blank",
    category: "Culture",
    question:
      "Maintain in-office presence Tuesday through _____ to support collaboration.",
    correctAnswer: "Thursday",
  },
  {
    type: "fill_blank",
    category: "Culture",
    question: "Share planned leave at least _____ days in advance.",
    correctAnswer: "60",
  },
  {
    type: "fill_blank",
    category: "Collaboration",
    question: "Prefer _____ communication over assumptions.",
    correctAnswer: "direct",
  },
  {
    type: "fill_blank",
    category: "Quality",
    question: "_____ technical debt and revisit it over time.",
    correctAnswer: "Document",
  },
  {
    type: "pick_many",
    category: "Release",
    question:
      "Select all that apply: who shares responsibility for release readiness per the stand-up reference?",
    options: [
      "Architecture",
      "Engineering / development",
      "QE / quality engineering",
      "Release coordination alone, without engineering",
      "Only customer support",
    ],
    correctIndices: [0, 1, 2],
  },
  {
    type: "pick_one",
    category: "Release",
    question:
      "What is the standard release window mentioned in the stand-up reference?",
    options: [
      "7:00 to 9:00 AM IST",
      "9:00 to 11:00 AM IST",
      "6:00 to 8:00 PM IST",
      "No standard window is defined",
    ],
    answer: 0,
  },
  {
    type: "pick_one",
    category: "Release",
    question:
      "Who shares responsibility for release readiness and ownership?",
    options: [
      "Engineering only",
      "Architecture only",
      "QE and Release team only",
      "Architecture, Engineering, and QE",
    ],
    answer: 3,
  },
  {
    type: "pick_many",
    category: "Quality",
    question:
      "Select all that are reasonable grounds to defer a release when risk is unacceptable:",
    options: [
      "Readiness bar is not met",
      "Critical verification is still open",
      "A major unknown security issue surfaced late",
      "A non-critical polish tweak was requested the same morning",
    ],
    correctIndices: [0, 1, 2],
  },
  {
    type: "pick_one",
    category: "Execution",
    question: "How often should ClickUp be updated?",
    options: ["Weekly", "Daily", "Only on release days", "Monthly"],
    answer: 1,
  },
  {
    type: "pick_one",
    category: "Quality",
    question:
      "What should be done if readiness or risk is not acceptable before release?",
    options: [
      "Release anyway and patch later",
      "Defer releases until readiness is acceptable",
      "Skip QE verification",
      "Escalate and release immediately",
    ],
    answer: 1,
  },
  {
    type: "pick_one",
    category: "Culture",
    question:
      "What is the expectation around recurring one-on-ones across teams?",
    options: [
      "They are mandatory for all team members",
      "They are optional based on comfort and value",
      "They are not allowed",
      "Only leadership should have them",
    ],
    answer: 1,
  },
  {
    type: "pick_one",
    category: "Quality",
    question:
      "Which statement best reflects quality and engineering discipline?",
    options: [
      "Skip architecture reviews to move fast",
      "Over-engineer all designs to future-proof everything",
      "Align design depth to scope and timeline while validating quality before and after releases",
      "Focus only on bug fixes and avoid documentation",
    ],
    answer: 2,
  },
  {
    type: "word_scramble",
    category: "Execution",
    prompt: "Something that stops progress beyond 30–60 minutes — unscramble:",
    scrambled: "LRBECOK",
    correctAnswer: "Blocker",
  },
  {
    type: "word_scramble",
    category: "Collaboration",
    prompt: "What to do when issues stay unresolved — unscramble:",
    scrambled: "ETLSAAEC",
    correctAnswer: "Escalate",
  },
  {
    type: "word_scramble",
    category: "Quality",
    prompt:
      "Engineering principle alongside scalability — unscramble:",
    scrambled: "SULAEBRIITY",
    correctAnswer: "Reusability",
  },
  {
    type: "word_scramble",
    category: "Execution",
    prompt: "Task management tool to update daily — unscramble:",
    scrambled: "ILCPUCK",
    correctAnswer: "ClickUp",
    acceptedAnswers: ["click up"],
  },
  {
    type: "word_scramble",
    category: "Release",
    prompt: "Sharing progress to production — unscramble:",
    scrambled: "MYEOLTDPEN",
    correctAnswer: "Deployment",
  },
  {
    type: "word_scramble",
    category: "Bonus",
    prompt:
      "Not in the doc — close cousin of stand-up — unscramble:",
    scrambled: "OREEEPCTSVTIR",
    correctAnswer: "Retrospective",
  },
  {
    type: "word_scramble",
    category: "Architecture",
    prompt: "Must be reviewed before significant work — unscramble:",
    scrambled: "HECATIRUTECR",
    correctAnswer: "Architecture",
  },
  {
    type: "word_scramble",
    category: "Collaboration",
    prompt: "Capacity constraint to communicate early — unscramble:",
    scrambled: "AWDNHIDTB",
    correctAnswer: "Bandwidth",
  },
]; */

let QUESTION_BANK = [
  {
    type: "pick_one",
    category: "Engineering",
    question: "Development benefits with emphasis on ____________",
    options: [
      "Speed over everything",
      "Quality over everything",
      "Balance of reuse, scale and maintainability",
    ],
    answer: 2,
  },
  {
    type: "pick_one",
    category: "Release",
    question: "Release readiness is shared responsibility across ________",
    options: [
      "Architecture, Engineering & QA",
      "Engineering & QA",
      "Architecture & Engineering",
    ],
    answer: 0,
  },
  {
    type: "pick_one",
    category: "Collaboration",
    question: "Why is communicating bandwidth constraints early critical?",
    options: [
      "To reduce meetings",
      "To avoid unrealistic commitments and missed deadlines",
      "To speed up testing",
    ],
    answer: 1,
  },
  {
    type: "pick_one",
    category: "Quality",
    question: "Which is the BEST example of balancing tech debt vs delivery speed?",
    options: [
      "Ignoring tech debt completely",
      "Making trade-offs aligned with timelines",
      "Always prioritizing delivery",
    ],
    answer: 1,
  },
  {
    type: "pick_one",
    category: "Execution",
    question: "Which practice directly supports visibility of work?",
    options: [
      "Keeping ClickUp updated with status",
      "Weekly releases only",
      "Silent execution",
    ],
    answer: 0,
  },
  {
    type: "true_false",
    category: "Collaboration",
    question: "Feedback should always include reasoning and context.",
    answer: true,
  },
  {
    type: "true_false",
    category: "Risk",
    question:
      "Early communication of risks can sometimes slow down delivery but improves outcomes.",
    answer: true,
  },
  {
    type: "true_false",
    category: "Collaboration",
    question:
      "Declining a meeting without context is acceptable if you are busy with delivery.",
    answer: false,
  },
  {
    type: "qna",
    category: "QnA",
    question:
      "During a code review, you notice a pattern that could cause maintainability issues down the line, but fixing it now would delay the release by two days.",
    correctAnswer:
      "Raise code quality concerns during development with trade-offs aligned to delivery timelines.",
  },
  {
    type: "qna",
    category: "QnA",
    question:
      "New information suggests a shift in priorities mid-sprint. What is the expected response?",
    correctAnswer: "Adjust priorities based on updated information.",
  },
];

const CATEGORY_CLASS = {
  Roadmap: "cat-roadmap",
  Culture: "cat-culture",
  Collaboration: "cat-collab",
  Execution: "cat-exec",
  Release: "cat-release",
  Quality: "cat-quality",
  Architecture: "cat-arch",
  Bonus: "cat-bonus",
  Engineering: "cat-roadmap",
  Risk: "cat-exec",
  QnA: "cat-bonus",
};

function shuffleInPlace(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function normalizeQuestion(raw) {
  const q = { ...raw };
  delete q.insight;
  q.type = q.type ?? "pick_one";
  if (q.type === "fill_blank" || q.type === "word_scramble") {
    if (!q.correctAnswer && Array.isArray(q.options) && typeof q.answer === "number") {
      q.correctAnswer = q.options[q.answer];
    }
    delete q.options;
    delete q.answer;
    if (q.acceptedAnswers) q.acceptedAnswers = [...q.acceptedAnswers];
  }
  if (q.type === "qna") {
    delete q.options;
    delete q.answer;
  }
  if (q.type === "pick_one" && q.options) {
    q.options = [...q.options];
  }
  if (q.type === "pick_many" && q.options) {
    q.options = [...q.options];
    q.correctIndices = [...(q.correctIndices ?? [])].sort((a, b) => a - b);
  }
  return q;
}

function cloneForRound(raw) {
  const n = normalizeQuestion(raw);
  if (n.type === "pick_one") return { ...n, options: [...n.options] };
  if (n.type === "fill_blank" || n.type === "word_scramble") {
    const o = { ...n };
    if (n.acceptedAnswers) o.acceptedAnswers = [...n.acceptedAnswers];
    return o;
  }
  if (n.type === "qna") return { ...n };
  if (n.type === "pick_many")
    return { ...n, options: [...n.options], correctIndices: [...n.correctIndices] };
  return { ...n };
}

function buildRound() {
  const copy = QUESTION_BANK.map(cloneForRound);
  return copy.slice(0, Math.min(ROUND_SIZE, copy.length));
}

function getFormatCount() {
  return new Set(QUESTION_BANK.map((q) => normalizeQuestion(q).type)).size;
}

let questions = buildRound();
let index = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
/** @type {boolean} */
let answered = false;
let shuffledCorrectIndex = 0;
/** @type {Set<number>} */
let pickManySelected = new Set();

const missed = [];

const WAVE_SIZE = 4;
const COMBO_BAR_CAP = 8;
let QUESTION_TIME_SEC = 30;
let QNA_TIME_SEC = 60;
const QNA_REVEAL_SEC = 15;

/** @type {ReturnType<typeof setInterval> | null} */
let questionTimerId = null;
/** @type {ReturnType<typeof setTimeout> | null} */
let qnaRevealTimerId = null;
let hintLevel = 0;

let totalXp = 0;
let soundEnabled = localStorage.getItem("standupRunSound") !== "0";
let bannerTimer = 0;
let floatTimer = 0;
/** @type {AudioContext | null} */
let audioCtx = null;
const API_BASE = "";
let activePlayerId = "";
let activeSessionId = "";
let activePlayerName = "";
let questionStartedAtMs = 0;

const gameRoot = document.getElementById("game-root");
const gameHud = document.getElementById("game-hud");
const hudXp = document.getElementById("hud-xp");
const hudCombo = document.getElementById("hud-combo");
const hudComboWrap = document.getElementById("hud-combo-wrap");
const hudStage = document.getElementById("hud-stage");
const comboBarsEl = document.getElementById("combo-bars");
const countdownOverlay = document.getElementById("countdown-overlay");
const countdownText = document.getElementById("countdown-text");
const gameBanner = document.getElementById("game-banner");
const fxLayer = document.getElementById("fx-layer");
const gameStage = document.getElementById("game-stage");
const soundToggle = document.getElementById("sound-toggle");
const xpFinal = document.getElementById("xp-final");

const intro = document.getElementById("intro");
const startBtn = document.getElementById("start-btn");
const playerNameInput = document.getElementById("player-name");
const introQCount = document.getElementById("intro-q-count");
const introFormatCount = document.getElementById("intro-format-count");

const quizContainer = document.getElementById("quiz-container");
const meta = document.getElementById("meta");
const progressFill = document.getElementById("progress-fill");
const formatBadge = document.getElementById("format-badge");
const categoryEl = document.getElementById("category");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const streakWrap = document.getElementById("streak-wrap");
const streakText = document.getElementById("streak-text");
const keyboardHint = document.getElementById("keyboard-hint");
const timerWrap = document.getElementById("timer-wrap");
const timerFill = document.getElementById("timer-fill");
const timerLabel = document.getElementById("timer-label");
const timerFlash = document.getElementById("timer-flash");

const result = document.getElementById("result");
const rankTitle = document.getElementById("rank-title");
const scoreText = document.getElementById("score-text");
const summaryText = document.getElementById("summary-text");
const restartBtn = document.getElementById("restart-btn");
const missedBlock = document.getElementById("missed-block");
const missedList = document.getElementById("missed-list");

introQCount.textContent = String(Math.min(ROUND_SIZE, QUESTION_BANK.length));
introFormatCount.textContent = String(getFormatCount());

soundToggle.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem("standupRunSound", soundEnabled ? "1" : "0");
  soundToggle.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
});

async function apiJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      if (err?.message) msg = err.message;
    } catch (_e) {
      // Ignore invalid json.
    }
    throw new Error(msg);
  }
  return res.json();
}

async function loadTimerConfig() {
  const data = await apiJson("/api/game/config");
  if (Number.isFinite(data.questionTimeSec)) QUESTION_TIME_SEC = data.questionTimeSec;
  if (Number.isFinite(data.qnaTimeSec)) QNA_TIME_SEC = data.qnaTimeSec;
}

function mapServerQuestion(row) {
  const q = {
    type: row.type,
    category: row.category || "General",
    question: row.question,
    score: Number.isFinite(row.score) ? row.score : 1,
    timeSec: Number.isFinite(row.timeSec) ? row.timeSec : null,
  };

  if (row.type === "pick_one") {
    q.options = Array.isArray(row.options) ? row.options : [];
    q.answer = Number.isFinite(row.answer) ? row.answer : 0;
  } else if (row.type === "true_false") {
    q.answer = String(row.correctAnswer).toLowerCase() === "true";
  } else if (row.type === "pick_many") {
    q.options = Array.isArray(row.options) ? row.options : [];
    q.correctIndices = Array.isArray(row.correctIndices) ? row.correctIndices : [];
  } else if (row.type === "fill_blank") {
    q.correctAnswer = row.correctAnswer || "";
  } else if (row.type === "word_scramble") {
    q.correctAnswer = row.correctAnswer || "";
    q.scrambled = row.scrambled || "";
    q.prompt = row.prompt || row.question;
  } else if (row.type === "qna") {
    q.correctAnswer = row.correctAnswer || "";
  }

  return q;
}

async function loadQuestionsFromServer() {
  const data = await apiJson("/api/game/questions");
  const incoming = Array.isArray(data.questions) ? data.questions : [];
  if (!incoming.length) return;
  QUESTION_BANK = incoming.map(mapServerQuestion);
  questions = buildRound();
  introQCount.textContent = String(Math.min(ROUND_SIZE, QUESTION_BANK.length));
  introFormatCount.textContent = String(getFormatCount());
}

async function startRunOnServer(name) {
  const data = await apiJson("/api/game/start", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  activePlayerId = data.playerId || "";
  activeSessionId = data.sessionId || "";
  if (Number.isFinite(data.questionTimeSec)) QUESTION_TIME_SEC = data.questionTimeSec;
  if (Number.isFinite(data.qnaTimeSec)) QNA_TIME_SEC = data.qnaTimeSec;
}

async function saveResponseToServer(current, isCorrect, correctSummary, selectedSummary) {
  if (!activeSessionId || !activePlayerId) return;
  const questionText = current.question ?? current.prompt ?? "(challenge)";
  await apiJson("/api/game/response", {
    method: "POST",
    body: JSON.stringify({
      sessionId: activeSessionId,
      playerId: activePlayerId,
      questionIndex: index,
      question: questionText,
      category: current.category ?? "",
      type: current.type ?? "",
      selectedAnswer: String(selectedSummary ?? ""),
      correctAnswer: String(correctSummary ?? ""),
      isCorrect,
      durationMs: questionStartedAtMs ? Date.now() - questionStartedAtMs : null,
    }),
  });
}

async function finishRunOnServer(percent) {
  if (!activeSessionId) return;
  await apiJson("/api/game/finish", {
    method: "POST",
    body: JSON.stringify({
      sessionId: activeSessionId,
      score,
      totalQuestions: questions.length,
      percent,
      bestStreak,
      totalXp,
    }),
  });
}

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  return audioCtx;
}

function resumeAudio() {
  const ctx = ensureAudio();
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

function playBlip(kind) {
  if (!soundEnabled) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "square";
  if (kind === "tick") {
    osc.frequency.setValueAtTime(520, t);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.start(t);
    osc.stop(t + 0.07);
  } else if (kind === "go") {
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.start(t);
    osc.stop(t + 0.22);
  } else if (kind === "correct") {
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.setValueAtTime(440, t + 0.05);
    osc.frequency.setValueAtTime(660, t + 0.1);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.start(t);
    osc.stop(t + 0.16);
  } else {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.18);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.start(t);
    osc.stop(t + 0.24);
  }
}

function flashBanner(message, variant) {
  gameBanner.textContent = message;
  gameBanner.classList.remove("hidden", "banner-good", "banner-bad", "banner-wave");
  gameBanner.classList.add(`banner-${variant}`);
  clearTimeout(bannerTimer);
  requestAnimationFrame(() => {
    gameBanner.classList.add("show");
  });
  bannerTimer = window.setTimeout(() => {
    gameBanner.classList.remove("show");
    bannerTimer = window.setTimeout(() => {
      gameBanner.classList.add("hidden");
    }, 220);
  }, 720);
}

function spawnFloat(label, isBad = false) {
  const el = document.createElement("div");
  el.className = `fx-float${isBad ? " fx-bad" : ""}`;
  el.textContent = label;
  fxLayer.appendChild(el);
  clearTimeout(floatTimer);
  floatTimer = window.setTimeout(() => {
    el.remove();
  }, 1000);
}

function updateComboBars() {
  comboBarsEl.innerHTML = "";
  const n = Math.min(COMBO_BAR_CAP, streak);
  for (let i = 0; i < COMBO_BAR_CAP; i += 1) {
    const d = document.createElement("div");
    d.className = `combo-bar${i < n ? " on" : ""}`;
    comboBarsEl.appendChild(d);
  }
  hudComboWrap.classList.toggle("combo-hot", streak >= 3);
}

function updateHud() {
  hudXp.textContent = String(totalXp);
  hudCombo.textContent = `×${streak}`;
  hudStage.textContent = `${index + 1}/${questions.length}`;
}

function xpForStreak(streakValue) {
  return Math.min(480, 72 + streakValue * 44);
}

function runCountdownThen(cb) {
  countdownOverlay.classList.remove("hidden");
  const seq = ["3", "2", "1", "RUN!"];
  let i = 0;
  const step = () => {
    if (i >= seq.length) {
      countdownOverlay.classList.add("hidden");
      cb();
      return;
    }
    countdownText.textContent = seq[i];
    playBlip(i < 3 ? "tick" : "go");
    i += 1;
    window.setTimeout(step, i === 4 ? 380 : 620);
  };
  step();
}

function setProgress() {
  const pct = ((index + (answered ? 1 : 0)) / questions.length) * 100;
  progressFill.style.width = `${Math.min(100, pct)}%`;
}

function updateStreakDisplay() {
  if (streak >= 2) {
    streakWrap.hidden = false;
    streakText.textContent =
      streak === 2
        ? "Combo ×2 — heating up"
        : `Combo ×${streak} — unstoppable`;
  } else {
    streakWrap.hidden = true;
  }
}

function shuffleOptionsForQuestion(current) {
  const tagged = current.options.map((text, i) => ({
    text,
    isCorrect: i === current.answer,
  }));
  shuffleInPlace(tagged);
  shuffledCorrectIndex = tagged.findIndex((t) => t.isCorrect);
  return tagged.map((t) => t.text);
}

function setKeyboardHint(text) {
  keyboardHint.textContent = text;
}

function stopQuestionTimer() {
  if (questionTimerId !== null) {
    clearInterval(questionTimerId);
    questionTimerId = null;
  }
  if (timerWrap) timerWrap.classList.remove("timer-urgent");
  if (timerFlash) {
    timerFlash.textContent = "";
    timerFlash.classList.remove("show");
  }
}

function clearQnaRevealTimer() {
  if (qnaRevealTimerId !== null) {
    clearTimeout(qnaRevealTimerId);
    qnaRevealTimerId = null;
  }
}

function normalizeTypedAnswer(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function typedMatches(current, rawInput) {
  const u = normalizeTypedAnswer(rawInput);
  if (!u) return false;
  const primary = normalizeTypedAnswer(current.correctAnswer);
  if (u === primary) return true;
  const alts = current.acceptedAnswers ?? [];
  return alts.some((a) => normalizeTypedAnswer(a) === u);
}

function buildHintLines(current) {
  const ans = String(current.correctAnswer ?? "").trim();
  const words = ans.split(/\s+/).filter(Boolean);
  const lines = [
    `Length: ${ans.length} characters (including spaces).`,
    `Starts with "${ans[0] ?? "?"}" · ${words.length} word(s).`,
  ];
  if (words.length <= 1) {
    lines.push(`Last character: "${ans[ans.length - 1] ?? "?"}".`);
  } else {
    lines.push(
      `Second word starts with "${(words[1][0] ?? "?").toUpperCase()}".`,
    );
  }
  if (current.type === "word_scramble" && current.scrambled) {
    lines[0] += ` Scramble has ${String(current.scrambled).replace(/\s/g, "").length} letters.`;
  }
  return lines;
}

function flashTimerNumber(n) {
  if (!timerFlash) return;
  timerFlash.textContent = String(n);
  timerFlash.classList.remove("show");
  void timerFlash.offsetWidth;
  timerFlash.classList.add("show");
  window.setTimeout(() => timerFlash.classList.remove("show"), 520);
}

function revealTimeoutAnswer(correctSummary) {
  const old = document.getElementById("timeout-reveal");
  if (old) old.remove();
  const box = document.createElement("div");
  box.id = "timeout-reveal";
  box.className = "timeout-reveal";
  box.innerHTML = `<span class="timeout-label">Time up.</span> Correct answer: <strong>${escapeHtml(
    String(correctSummary),
  )}</strong>`;
  optionsEl.appendChild(box);
}

function startQuestionTimer(totalSeconds = QUESTION_TIME_SEC) {
  stopQuestionTimer();
  if (!timerWrap || !timerFill || !timerLabel) return;

  let remaining = totalSeconds;
  const paint = () => {
    timerLabel.textContent = String(remaining);
    timerFill.style.width = `${(remaining / totalSeconds) * 100}%`;
    if (remaining <= 5 && remaining > 0) {
      timerWrap.classList.add("timer-urgent");
      playBlip("tick");
      flashTimerNumber(remaining);
    } else if (remaining > 5) {
      timerWrap.classList.remove("timer-urgent");
    }
  };

  paint();
  questionTimerId = window.setInterval(() => {
    if (answered) {
      stopQuestionTimer();
      return;
    }
    remaining -= 1;
    if (remaining < 0) {
      stopQuestionTimer();
      return;
    }
    paint();
    if (remaining === 0) {
      stopQuestionTimer();
      forceQuestionTimeout();
    }
  }, 1000);
}

function forceQuestionTimeout() {
  if (answered) return;
  const current = questions[index];
  if (current.type === "fill_blank" || current.type === "word_scramble") {
    const input = document.getElementById("typed-answer");
    if (input) {
      input.disabled = true;
      input.classList.add("wrong");
    }
    const sb = document.getElementById("submit-typed-btn");
    if (sb) sb.disabled = true;
    const hb = document.getElementById("hint-btn");
    if (hb) hb.disabled = true;
    revealTypedAnswer(current, "", true);
    return;
  }
  if (current.type === "pick_many") {
    const correctLabels = current.correctIndices
      .map((i) => current.options[i])
      .join("; ");
    revealPickMany(current);
    revealTimeoutAnswer(`All of: ${correctLabels}`);
    return;
  }
  if (current.type === "true_false") {
    const buttons = [...optionsEl.querySelectorAll(".tf-btn")];
    buttons.forEach((btn) => {
      btn.disabled = true;
      const v = btn.dataset.value === "true";
      if (v === current.answer) btn.classList.add("correct");
    });
    const correct = current.answer ? "True" : "False";
    applyScore(false, current, correct, "Timed out");
    revealTimeoutAnswer(correct);
    return;
  }
  if (current.type === "pick_one") {
    const correctLabel = current.options[current.answer];
    const allButtons = [...optionsEl.querySelectorAll(".option-btn")];
    allButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === shuffledCorrectIndex) btn.classList.add("correct");
    });
    applyScore(false, current, correctLabel, "Timed out");
    revealTimeoutAnswer(correctLabel);
  }
  if (current.type === "qna") {
    const yesBtn = document.getElementById("qna-yes-btn");
    const noBtn = document.getElementById("qna-no-btn");
    if (yesBtn) yesBtn.disabled = true;
    if (noBtn) noBtn.disabled = true;
    const answerText = current.correctAnswer ?? "Audience response not recorded";
    applyScore(false, current, answerText, "Timed out");
    revealTimeoutAnswer(answerText);
  }
}

function revealTypedAnswer(current, rawInput, fromTimer = false) {
  if (answered) return;
  const ok = !fromTimer && typedMatches(current, rawInput);
  const input = document.getElementById("typed-answer");
  const sb = document.getElementById("submit-typed-btn");
  if (sb) sb.disabled = true;
  const hb = document.getElementById("hint-btn");
  if (ok) {
    if (input) {
      input.disabled = true;
      input.classList.remove("wrong");
      input.classList.add("correct");
    }
    if (hb) hb.disabled = true;
    applyScore(true, current, current.correctAnswer, rawInput);
    return;
  }

  if (fromTimer) {
    if (input) {
      input.disabled = true;
      input.classList.remove("correct");
      input.classList.add("wrong");
    }
    if (hb) hb.disabled = true;
    applyScore(false, current, current.correctAnswer, "Timed out");
    revealTimeoutAnswer(current.correctAnswer);
    return;
  }

  // Wrong typed attempt: keep question active and timer running.
  if (input) {
    input.classList.remove("correct");
    input.classList.add("wrong");
    input.focus();
    input.select();
  }
  if (sb) sb.disabled = false;
  flashBanner("TRY AGAIN", "bad");
  playBlip("tick");
  setKeyboardHint("Wrong - try again (time still running) · H = hint");
}

function applyScore(isCorrect, current, correctSummary, selectedSummary = "") {
  stopQuestionTimer();
  void saveResponseToServer(current, isCorrect, correctSummary, selectedSummary);
  if (isCorrect) {
    score += 1;
    streak += 1;
    if (streak > bestStreak) bestStreak = streak;
    const gain = xpForStreak(streak);
    totalXp += gain;
    spawnFloat(`+${gain} XP`);
    playBlip("correct");
    const cheers = ["NICE", "SOLID", "CRACKED", "MEGA", "GOD TIER"];
    flashBanner(cheers[Math.min(streak - 1, cheers.length - 1)], "good");
  } else {
    const hadCombo = streak >= 2;
    streak = 0;
    missed.push({
      question: current.question ?? current.prompt ?? "(challenge)",
      correct: correctSummary,
      category: current.category,
      format: FORMAT_LABELS[current.type],
    });
    spawnFloat("MISS", true);
    playBlip("wrong");
    flashBanner(hadCombo ? "COMBO ZEROED" : "HIT MISSED", "bad");
    gameStage.classList.add("fx-shake");
    window.setTimeout(() => gameStage.classList.remove("fx-shake"), 450);
  }
  answered = true;
  nextBtn.disabled = false;
  nextBtn.textContent = "Next stage";
  setKeyboardHint("Keyboard: Enter → next stage");
  setProgress();
  updateStreakDisplay();
  updateComboBars();
  updateHud();
}

function revealPickOne(current, selectedIndex, clickedButton) {
  const allButtons = [...optionsEl.querySelectorAll(".option-btn")];
  allButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === shuffledCorrectIndex) btn.classList.add("correct");
  });

  const ok = selectedIndex === shuffledCorrectIndex;
  if (!ok) clickedButton.classList.add("wrong");
  const correctLabel = current.options[current.answer];
  const pickedLabel = optionsEl
    .querySelectorAll(".option-btn")
    [selectedIndex]?.querySelector(".option-label")?.textContent;
  applyScore(ok, current, correctLabel, pickedLabel ?? "");
}

function revealTrueFalse(current, pickedTrue) {
  const buttons = [...optionsEl.querySelectorAll(".tf-btn")];
  buttons.forEach((btn) => {
    btn.disabled = true;
    const v = btn.dataset.value === "true";
    if (v === current.answer) btn.classList.add("correct");
  });
  const ok = pickedTrue === current.answer;
  if (!ok) {
    const wrongBtn = buttons.find((b) => (b.dataset.value === "true") === pickedTrue);
    if (wrongBtn) wrongBtn.classList.add("wrong");
  }
  applyScore(
    ok,
    current,
    current.answer ? "True" : "False",
    pickedTrue ? "True" : "False",
  );
}

function arraysEqualAsSets(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

function revealPickMany(current) {
  const selected = [...pickManySelected].sort((a, b) => a - b);
  const ok = arraysEqualAsSets(selected, current.correctIndices);

  const rows = [...optionsEl.querySelectorAll(".multi-row")];
  rows.forEach((row, idx) => {
    const input = row.querySelector('input[type="checkbox"]');
    const should = current.correctIndices.includes(idx);
    const picked = pickManySelected.has(idx);
    row.classList.add("locked");
    input.disabled = true;
    if (should && picked) row.classList.add("multi-hit");
    else if (should && !picked) row.classList.add("multi-miss");
    else if (!should && picked) row.classList.add("multi-false-positive");
  });

  const correctLabels = current.correctIndices
    .map((i) => current.options[i])
    .join("; ");
  const pickedLabels = selected.map((i) => current.options[i]).join("; ");
  applyScore(ok, current, `All of: ${correctLabels}`, pickedLabels);
}

function renderFillBlankPrompt(el, text) {
  const marker = "_____";
  if (!text.includes(marker)) {
    el.textContent = text;
    return;
  }
  const segs = text.split(marker);
  let html = "";
  for (let i = 0; i < segs.length; i += 1) {
    html += escapeHtml(segs[i]);
    if (i < segs.length - 1) {
      html += `<span class="fib-blank">${marker}</span>`;
    }
  }
  el.innerHTML = html;
}

function renderTypedQuestion(current) {
  hintLevel = 0;
  optionsEl.className = "options options-typed";
  const hints = buildHintLines(current);
  optionsEl.innerHTML = `
    <div class="typed-row">
      <label class="typed-label" for="typed-answer">Your answer</label>
      <input type="text" id="typed-answer" class="answer-input" autocomplete="off" spellcheck="false" />
    </div>
    <div class="typed-actions">
      <button type="button" id="hint-btn" class="btn-hint">Hint</button>
      <button type="button" id="submit-typed-btn" class="btn-arcade btn-submit-typed">Submit answer</button>
    </div>
    <div id="hint-display" class="hint-display" hidden></div>`;

  const input = document.getElementById("typed-answer");
  const hintBtn = document.getElementById("hint-btn");
  const submitBtn = document.getElementById("submit-typed-btn");
  const hintDisplay = document.getElementById("hint-display");

  const pushHint = () => {
    if (answered || hintLevel >= hints.length) return;
    hintLevel += 1;
    hintDisplay.hidden = false;
    const p = document.createElement("p");
    p.className = "hint-line";
    p.textContent = hints[hintLevel - 1];
    hintDisplay.appendChild(p);
    if (hintLevel >= hints.length) hintBtn.disabled = true;
  };

  hintBtn.addEventListener("click", pushHint);

  const submitTyped = () => {
    if (answered) return;
    revealTypedAnswer(current, input?.value ?? "", false);
  };

  submitBtn.addEventListener("click", submitTyped);
  input.addEventListener("input", () => {
    input.classList.remove("wrong");
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitTyped();
    } else if (e.key === "h" || e.key === "H") {
      e.preventDefault();
      pushHint();
    }
  });

  nextBtn.disabled = true;
  nextBtn.textContent = "Next stage";
  setKeyboardHint("Type answer · Enter = submit · H = hint");
}

function renderShuffledMcOptions(current) {
  const optionTexts = shuffleOptionsForQuestion(current);
  optionTexts.forEach((option, optionIndex) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    const key = optionIndex + 1;
    btn.innerHTML = `<span class="option-key" aria-hidden="true">${key}</span><span class="option-label">${escapeHtml(
      option,
    )}</span>`;
    btn.addEventListener("click", () => {
      if (answered) return;
      revealPickOne(current, optionIndex, btn);
    });
    optionsEl.appendChild(btn);
  });
  nextBtn.disabled = true;
  nextBtn.textContent = "Next stage";
  setKeyboardHint("Keyboard: 1–4 pick · Enter after you answer");
}

function renderPickOne(current) {
  renderShuffledMcOptions(current);
}

function renderFillBlank(current) {
  renderTypedQuestion(current);
}

function renderWordScramble(current) {
  renderTypedQuestion(current);
}

function renderTrueFalse(current) {
  const pair = [
    { label: "True", value: true, key: "Y" },
    { label: "False", value: false, key: "N" },
  ];
  shuffleInPlace(pair);
  pair.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tf-btn";
    btn.dataset.value = String(p.value);
    btn.innerHTML = `<span class="option-key" aria-hidden="true">${p.key}</span><span class="option-label">${escapeHtml(
      p.label,
    )}</span>`;
    btn.addEventListener("click", () => {
      if (answered) return;
      revealTrueFalse(current, p.value);
    });
    optionsEl.appendChild(btn);
  });
  optionsEl.classList.add("options-tf");
  nextBtn.disabled = true;
  nextBtn.textContent = "Next stage";
  setKeyboardHint("Keyboard: Y / N (may swap with on-screen order) · Enter after you answer");
}

function renderPickMany(current) {
  pickManySelected = new Set();
  current.options.forEach((label, idx) => {
    const row = document.createElement("label");
    row.className = "multi-row";
    row.innerHTML = `<input type="checkbox" data-index="${idx}" /><span class="multi-text">${escapeHtml(
      label,
    )}</span>`;
    const input = row.querySelector("input");
    input.addEventListener("change", () => {
      if (answered) return;
      if (input.checked) pickManySelected.add(idx);
      else pickManySelected.delete(idx);
      nextBtn.disabled = pickManySelected.size === 0;
    });
    optionsEl.appendChild(row);
  });
  nextBtn.disabled = true;
  nextBtn.textContent = "Lock in";
  setKeyboardHint("Keyboard: Enter locks your selection");
}

function renderQna(current) {
  optionsEl.className = "options options-qna";
  optionsEl.innerHTML = `
    <div class="qna-wait" id="qna-wait">
      Audience discussion window is open.
    </div>
    <div class="qna-panel" id="qna-panel" hidden>
      <p class="qna-prompt">Did audience give the correct answer?</p>
      <div class="qna-actions">
        <button type="button" id="qna-yes-btn" class="btn-arcade btn-next">Yes</button>
        <button type="button" id="qna-no-btn" class="btn-hint">No</button>
      </div>
    </div>`;

  const wait = document.getElementById("qna-wait");
  const panel = document.getElementById("qna-panel");
  const yesBtn = document.getElementById("qna-yes-btn");
  const noBtn = document.getElementById("qna-no-btn");

  clearQnaRevealTimer();
  qnaRevealTimerId = window.setTimeout(() => {
    if (answered) return;
    if (wait) wait.hidden = true;
    if (panel) panel.hidden = false;
    flashBanner("Host Decision", "wave");
  }, QNA_REVEAL_SEC * 1000);

  yesBtn?.addEventListener("click", () => {
    if (answered) return;
    yesBtn.disabled = true;
    if (noBtn) noBtn.disabled = true;
    applyScore(true, current, "Audience answered correctly", "Yes");
  });

  noBtn?.addEventListener("click", () => {
    if (answered) return;
    if (yesBtn) yesBtn.disabled = true;
    noBtn.disabled = true;
    applyScore(false, current, "Audience answer was incorrect", "No");
    revealTimeoutAnswer(current.correctAnswer ?? "Audience answer was incorrect");
  });

  nextBtn.disabled = true;
  nextBtn.textContent = "Next stage";
  setKeyboardHint("QnA mode · Yes/No appears after 15s");
}

function renderQuestion() {
  answered = false;
  stopQuestionTimer();
  clearQnaRevealTimer();
  if (timerWrap) {
    timerWrap.hidden = false;
    timerWrap.classList.remove("timer-urgent");
  }

  const current = questions[index];
  const type = current.type;

  meta.textContent = `${FORMAT_LABELS[type]} · Stage ${index + 1}/${questions.length}`;
  formatBadge.textContent = FORMAT_LABELS[type];
  categoryEl.textContent = current.category;
  categoryEl.className = `category ${CATEGORY_CLASS[current.category] ?? ""}`;

  if (type === "word_scramble") {
    questionEl.innerHTML = `<span class="word-prompt">${escapeHtml(
      current.prompt,
    )}</span><div class="scramble-box" role="group" aria-label="Scrambled letters"><span class="scramble-letters">${escapeHtml(
      current.scrambled,
    )}</span></div>`;
  } else if (type === "fill_blank") {
    renderFillBlankPrompt(questionEl, current.question);
  } else {
    questionEl.textContent = current.question;
  }

  optionsEl.innerHTML = "";
  optionsEl.className = "options";
  if (type === "pick_many") optionsEl.classList.add("options-multi");

  setProgress();
  updateStreakDisplay();

  if (type === "pick_one") renderPickOne(current);
  else if (type === "fill_blank") renderFillBlank(current);
  else if (type === "word_scramble") renderWordScramble(current);
  else if (type === "true_false") renderTrueFalse(current);
  else if (type === "pick_many") renderPickMany(current);
  else if (type === "qna") renderQna(current);

  updateHud();
  updateComboBars();

  if (index > 0 && index % WAVE_SIZE === 0) {
    const wave = Math.floor(index / WAVE_SIZE) + 1;
    window.setTimeout(() => flashBanner(`Wave ${wave}`, "wave"), 280);
  }

  questionStartedAtMs = Date.now();
  const perQuestionTimer = Number.isFinite(current.timeSec) ? current.timeSec : null;
  const fallbackTimer = type === "qna" ? QNA_TIME_SEC : QUESTION_TIME_SEC;
  startQuestionTimer(perQuestionTimer ?? fallbackTimer);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function rankForPercent(percent) {
  if (percent >= 100) {
    return {
      title: "S-RANK — FULL SYNC",
      summary:
        "Flawless run. The squad is reading the stand-up reference like patch notes.",
    };
  }
  if (percent >= 90) {
    return {
      title: "A-RANK — ROADMAP SPEEDRUN",
      summary:
        "Elite alignment. Planning, shipping, and quality instincts are locked in.",
    };
  }
  if (percent >= 70) {
    return {
      title: "B-RANK — SHIP IT CREW",
      summary:
        "Strong run. A few gaps to farm XP on next rematch — see the recon log.",
    };
  }
  if (percent >= 50) {
    return {
      title: "C-RANK — STILL IN BETA",
      summary:
        "Decent instincts; use misses below as co-op objectives for the next stand-up.",
    };
  }
  return {
    title: "D-RANK — DOC SIDE QUEST",
    summary:
      "Treat misses as map markers — each one is a quick huddle away from a better run.",
  };
}

async function showResult() {
  clearQnaRevealTimer();
  stopQuestionTimer();
  if (timerWrap) timerWrap.hidden = true;
  quizContainer.classList.add("hidden");
  result.classList.remove("hidden");
  gameRoot.classList.add("is-results");
  gameRoot.classList.remove("is-playing");

  const percent = Math.round((score / questions.length) * 100);
  const rank = rankForPercent(percent);
  try {
    await finishRunOnServer(percent);
  } catch (error) {
    console.error("Failed to save final score", error);
  }

  rankTitle.textContent = rank.title;
  scoreText.textContent = `${score} / ${questions.length} cleared (${percent}%)`;
  xpFinal.textContent = `Total XP — ${totalXp.toLocaleString()} · Best combo ×${bestStreak}`;
  summaryText.textContent = `${rank.summary} Rematch draws ${ROUND_SIZE} random stages from a pool of ${QUESTION_BANK.length}.`;
  playBlip(percent >= 70 ? "go" : "tick");

  if (missed.length) {
    missedBlock.classList.remove("hidden");
    missedList.innerHTML = "";
    missed.forEach((m) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="missed-cat">${escapeHtml(
        m.category,
      )}</span><span class="missed-fmt">${escapeHtml(
        m.format,
      )}</span><span class="missed-q">${escapeHtml(
        m.question,
      )}</span><span class="missed-ans">${escapeHtml(
        m.correct,
      )}</span>`;
      missedList.appendChild(li);
    });
  } else {
    missedBlock.classList.add("hidden");
    missedList.innerHTML = "";
  }
}

async function beginQuiz() {
  const name = String(playerNameInput?.value ?? "").trim();
  if (!name) {
    flashBanner("ENTER NAME FIRST", "bad");
    if (playerNameInput) playerNameInput.focus();
    return;
  }
  resumeAudio();
  activePlayerName = name;
  try {
    await loadQuestionsFromServer();
    await loadTimerConfig();
    await startRunOnServer(name);
  } catch (error) {
    console.error("Unable to start run on server", error);
    flashBanner("SERVER ERROR", "bad");
    return;
  }
  intro.classList.add("hidden");
  gameHud.classList.remove("hidden");
  gameRoot.classList.add("is-playing");
  gameRoot.classList.remove("is-results");
  totalXp = 0;
  updateHud();
  updateComboBars();

  runCountdownThen(() => {
    quizContainer.classList.remove("hidden");
    stopQuestionTimer();
    renderQuestion();
  });
}

startBtn.addEventListener("click", beginQuiz);

void (async () => {
  try {
    await loadQuestionsFromServer();
    await loadTimerConfig();
  } catch (error) {
    console.warn("Using local defaults for question bank/config", error);
  }
})();

nextBtn.addEventListener("click", () => {
  const current = questions[index];
  if (!answered) {
    if (current.type === "pick_many") {
      if (pickManySelected.size === 0) return;
      revealPickMany(current);
      return;
    }
    return;
  }

  index += 1;
  if (index < questions.length) {
    renderQuestion();
  } else {
    void showResult();
  }
});

restartBtn.addEventListener("click", async () => {
  resumeAudio();
  clearQnaRevealTimer();
  stopQuestionTimer();
  if (activePlayerName) {
    try {
      await loadQuestionsFromServer();
      await loadTimerConfig();
      await startRunOnServer(activePlayerName);
    } catch (error) {
      console.error("Unable to restart run on server", error);
      flashBanner("SERVER ERROR", "bad");
      return;
    }
  }
  questions = buildRound();
  index = 0;
  score = 0;
  streak = 0;
  bestStreak = 0;
  totalXp = 0;
  missed.length = 0;
  result.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  gameRoot.classList.add("is-playing");
  gameRoot.classList.remove("is-results");
  progressFill.style.width = "0%";
  updateHud();
  updateComboBars();
  flashBanner("NEW RUN", "wave");
  window.setTimeout(() => renderQuestion(), 520);
});

document.addEventListener("keydown", (e) => {
  if (quizContainer.classList.contains("hidden")) return;
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    const inp = /** @type {HTMLInputElement} */ (e.target);
    if (inp.type === "checkbox" && e.key === "Enter") {
      e.preventDefault();
      if (!nextBtn.disabled) nextBtn.click();
      return;
    }
    if (inp.type === "text" && answered && e.key === "Enter") {
      e.preventDefault();
      if (!nextBtn.disabled) nextBtn.click();
      return;
    }
    return;
  }

  const current = questions[index];

  if (!answered) {
    if (current.type === "pick_one") {
      const n = Number(e.key);
      if (n >= 1 && n <= 4) {
        const buttons = optionsEl.querySelectorAll(".option-btn");
        const btn = buttons[n - 1];
        if (btn && !btn.disabled) btn.click();
      }
    } else if (
      (current.type === "fill_blank" || current.type === "word_scramble") &&
      (e.key === "h" || e.key === "H")
    ) {
      const hb = document.getElementById("hint-btn");
      if (hb && !hb.disabled) hb.click();
    } else if (current.type === "true_false") {
      const k = e.key.toLowerCase();
      if (k === "y" || k === "n") {
        const tfBtn = [...optionsEl.querySelectorAll(".tf-btn")].find((b) => {
          const wantsTrue = k === "y";
          return (b.dataset.value === "true") === wantsTrue;
        });
        if (tfBtn && !tfBtn.disabled) tfBtn.click();
      }
    } else if (current.type === "pick_many") {
      if (e.key === "Enter" && !nextBtn.disabled) {
        e.preventDefault();
        nextBtn.click();
      }
    } else if (current.type === "qna") {
      if (e.key.toLowerCase() === "y") {
        const yesBtn = document.getElementById("qna-yes-btn");
        if (yesBtn && !yesBtn.disabled && !yesBtn.hidden) yesBtn.click();
      } else if (e.key.toLowerCase() === "n") {
        const noBtn = document.getElementById("qna-no-btn");
        if (noBtn && !noBtn.disabled && !noBtn.hidden) noBtn.click();
      }
    }
    return;
  }

  if (e.key === "Enter" && !nextBtn.disabled) {
    e.preventDefault();
    nextBtn.click();
  }
});
