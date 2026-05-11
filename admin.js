const state = {
  auth: { username: "", password: "" },
  selectedType: "pick_one",
  editingQuestionId: null,
  questions: [],
  options: [
    { text: "", correct: true },
    { text: "", correct: false },
  ],
  selectedPlayerId: "",
  scoreSort: "endedAt_desc",
};

const TYPES = ["pick_one", "true_false", "pick_many", "fill_blank", "word_scramble", "qna"];
const ADMIN_AUTH_CACHE_KEY = "standupTriviaAdminAuth";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SCORE_SORTS = [
  { id: "endedAt_desc", label: "Latest" },
  { id: "endedAt_asc", label: "Oldest" },
  { id: "score_desc", label: "Score High-Low" },
  { id: "score_asc", label: "Score Low-High" },
  { id: "percent_desc", label: "Percent High-Low" },
  { id: "percent_asc", label: "Percent Low-High" },
  { id: "xp_desc", label: "XP High-Low" },
  { id: "xp_asc", label: "XP Low-High" },
];

const el = {
  authShell: document.getElementById("auth-shell"),
  dashboardShell: document.getElementById("dashboard-shell"),
  username: document.getElementById("admin-username"),
  password: document.getElementById("admin-password"),
  loginBtn: document.getElementById("login-btn"),
  loginMsg: document.getElementById("login-msg"),
  adminMsg: document.getElementById("admin-msg"),
  tabs: [...document.querySelectorAll(".tab-btn")],
  tabStats: document.getElementById("tab-stats"),
  tabResponses: document.getElementById("tab-responses"),
  tabQuestions: document.getElementById("tab-questions"),
  statsKpis: document.getElementById("stats-kpis"),
  scoresBody: document.getElementById("scores-body"),
  responsesBody: document.getElementById("responses-body"),
  questionTime: document.getElementById("question-time"),
  saveConfig: document.getElementById("save-config"),
  refreshScores: document.getElementById("refresh-scores"),
  refreshResponses: document.getElementById("refresh-responses"),
  clearResponses: document.getElementById("clear-responses"),
  ddTrigger: document.getElementById("dd-trigger"),
  ddMenu: document.getElementById("dd-menu"),
  scoreSortTrigger: document.getElementById("score-sort-trigger"),
  scoreSortMenu: document.getElementById("score-sort-menu"),
  playerFilterTrigger: document.getElementById("player-filter-trigger"),
  playerFilterMenu: document.getElementById("player-filter-menu"),
  qCategory: document.getElementById("q-category"),
  qScore: document.getElementById("q-score"),
  qTime: document.getElementById("q-time"),
  qText: document.getElementById("q-text"),
  qAnswer: document.getElementById("q-answer"),
  qAnswerLabel: document.getElementById("q-answer-label"),
  qPrompt: document.getElementById("q-prompt"),
  qScrambled: document.getElementById("q-scrambled"),
  groupOptions: document.getElementById("group-options"),
  optionArray: document.getElementById("option-array"),
  addOption: document.getElementById("add-option"),
  groupAnswerText: document.getElementById("group-answer-text"),
  groupScramble: document.getElementById("group-scramble"),
  saveQuestion: document.getElementById("save-question"),
  showAllQuestions: document.getElementById("show-all-questions"),
  cancelEdit: document.getElementById("cancel-edit"),
};

function setMsg(text, isError = false, login = false) {
  const node = login ? el.loginMsg : el.adminMsg;
  node.textContent = text;
  node.style.color = isError ? "#ff6b6b" : "#7dffce";
}

function btnLoading(btn, on) {
  if (on) btn.classList.add("loading");
  else btn.classList.remove("loading");
}

async function withLoading(btn, fn) {
  btnLoading(btn, true);
  try { return await fn(); }
  finally { btnLoading(btn, false); }
}

function skeletonKpis() {
  el.statsKpis.innerHTML = Array(4).fill('<div class="kpi skeleton skel-kpi"></div>').join("");
}

function skeletonTable(tbody, cols, rows = 5) {
  tbody.innerHTML = Array(rows).fill(0).map(() =>
    `<tr>${Array(cols).fill(0).map(() => '<td><div class="skeleton skel-row" style="height:18px;width:80%"></div></td>').join("")}</tr>`
  ).join("");
}

function skeletonScores() { skeletonTable(el.scoresBody, 6); }
function skeletonResponses() { skeletonTable(el.responsesBody, 7); }

function saveAuthCache() {
  localStorage.setItem(
    ADMIN_AUTH_CACHE_KEY,
    JSON.stringify({
      username: state.auth.username,
      password: state.auth.password,
      expiresAt: Date.now() + ONE_DAY_MS,
    }),
  );
}

function clearAuthCache() {
  localStorage.removeItem(ADMIN_AUTH_CACHE_KEY);
}

function clearFieldErrors() {
  document.querySelectorAll(".error-field").forEach((n) => n.classList.remove("error-field"));
}

function markError(...nodes) {
  nodes.filter(Boolean).forEach((n) => n.classList.add("error-field"));
}

function toSentenceCaseType(type) {
  return String(type || "")
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

async function adminFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      "x-admin-username": state.auth.username,
      "x-admin-password": state.auth.password,
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch (_e) {}
    throw new Error(message);
  }
  return res.json();
}

function ensureOptionIntegrity() {
  if (state.options.length === 0) state.options.push({ text: "", correct: state.selectedType === "pick_one" });
  if (state.selectedType === "pick_one") {
    const idx = state.options.findIndex((o) => o.correct);
    state.options.forEach((o, i) => {
      o.correct = i === (idx >= 0 ? idx : 0);
    });
  }
}

function renderOptionsArray() {
  ensureOptionIntegrity();
  const markerType = state.selectedType === "pick_many" ? "checkbox" : "radio";
  el.optionArray.innerHTML = state.options
    .map(
      (opt, idx) => `<div class="option-row"><input class="opt-marker" type="${markerType}" name="correct-marker" data-correct-index="${idx}" ${opt.correct ? "checked" : ""} /><input class="opt-input" data-option-index="${idx}" value="${(opt.text || "").replace(/"/g, "&quot;")}" placeholder="Option ${idx + 1}" /><button class="icon-btn" type="button" data-remove-option="${idx}" title="Remove"><i data-feather="x"></i></button></div>`,
    )
    .join("");
  if (window.feather) window.feather.replace();
}

function updateQuestionFieldVisibility() {
  const type = state.selectedType;
  const isOptionType = type === "pick_one" || type === "pick_many";
  const isScramble = type === "word_scramble";
  el.groupOptions.classList.toggle("hidden", !isOptionType);
  el.addOption.classList.toggle("hidden", !isOptionType);
  el.groupAnswerText.classList.toggle("hidden", isOptionType);
  el.groupScramble.classList.toggle("hidden", !isScramble);

  if (type === "true_false") {
    el.qAnswerLabel.innerHTML = 'Correct Answer (true or false) <span class="req">*</span>';
    el.qAnswer.placeholder = "true";
  } else {
    el.qAnswerLabel.innerHTML = 'Correct Answer <span class="req">*</span>';
    el.qAnswer.placeholder = "Type correct answer";
  }

  if (isOptionType) renderOptionsArray();
}

function setActiveTab(name) {
  el.tabs.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === name));
  el.tabStats.classList.toggle("hidden", name !== "stats");
  el.tabResponses.classList.toggle("hidden", name !== "responses");
  el.tabQuestions.classList.toggle("hidden", name !== "questions");
}

function renderKpis(stats) {
  const cells = [
    ["Responses", stats.responsesCount || 0],
    ["Completed Sessions", stats.sessionsCount || 0],
    ["Players", stats.playersCount || 0],
    ["Active Questions", stats.questionsCount || 0],
  ];
  el.statsKpis.innerHTML = cells.map(([label, value]) => `<div class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div></div>`).join("");
}

function renderScores(rows) {
  el.scoresBody.innerHTML = rows.map((row) => `<tr><td>${row.name}</td><td>${row.score}/${row.totalQuestions}</td><td>${row.percent}%</td><td>${row.bestStreak}</td><td>${row.totalXp}</td><td>${new Date(row.endedAt).toLocaleString()}</td></tr>`).join("");
}

function renderResponses(rows) {
  el.responsesBody.innerHTML = rows.map((r) => `<tr><td>${r.playerName}</td><td>${r.questionIndex + 1}</td><td>${r.question}</td><td>${r.selectedAnswer || "-"}</td><td>${r.correctAnswer || "-"}</td><td>${r.isCorrect ? "Correct" : "Wrong"}</td><td>${r.durationMs ? `${Math.round(r.durationMs / 1000)}s` : "-"}</td></tr>`).join("");
}

function renderQuestions(rows) {
  state.questions = rows;
}

function resetQuestionForm() {
  clearFieldErrors();
  state.editingQuestionId = null;
  state.selectedType = "pick_one";
  state.options = [{ text: "", correct: true }, { text: "", correct: false }];
  el.ddTrigger.textContent = toSentenceCaseType(state.selectedType);
  el.qCategory.value = "";
  el.qScore.value = 1;
  el.qTime.value = "";
  el.qText.value = "";
  el.qAnswer.value = "";
  el.qPrompt.value = "";
  el.qScrambled.value = "";
  const saveLabel = el.saveQuestion.querySelector(".btn-label");
  if (saveLabel) saveLabel.textContent = "Add Question";
  else el.saveQuestion.textContent = "Add Question";
  el.cancelEdit.classList.add("hidden");
  updateQuestionFieldVisibility();
}

function setFormFromQuestion(q) {
  clearFieldErrors();
  state.editingQuestionId = q._id;
  state.selectedType = q.type;
  el.ddTrigger.textContent = toSentenceCaseType(q.type);
  el.qCategory.value = q.category || "";
  el.qScore.value = q.score || 1;
  el.qTime.value = q.timeSec || "";
  el.qText.value = q.question || "";
  el.qAnswer.value = q.type === "pick_one" ? String(q.answer ?? "") : q.correctAnswer || "";
  el.qPrompt.value = q.prompt || "";
  el.qScrambled.value = q.scrambled || "";

  if (q.type === "pick_many") {
    state.options = (q.options || []).map((text, idx) => ({ text, correct: (q.correctIndices || []).includes(idx) }));
  } else if (q.type === "pick_one") {
    state.options = (q.options || []).map((text, idx) => ({ text, correct: idx === Number(q.answer) }));
  } else {
    state.options = [{ text: "", correct: true }, { text: "", correct: false }];
  }

  const saveLabel = el.saveQuestion.querySelector(".btn-label");
  if (saveLabel) saveLabel.textContent = "Update Question";
  else el.saveQuestion.textContent = "Update Question";
  el.cancelEdit.classList.remove("hidden");
  updateQuestionFieldVisibility();
}

function validateQuestionForm(payload) {
  clearFieldErrors();
  let hasError = false;

  if (!payload.question) {
    markError(el.qText);
    hasError = true;
  }
  if (!Number.isFinite(payload.score) || payload.score <= 0) {
    markError(el.qScore);
    hasError = true;
  }

  if (payload.type === "pick_one" || payload.type === "pick_many") {
    const nonEmpty = state.options
      .map((opt, idx) => ({ idx, text: String(opt.text || "").trim(), correct: !!opt.correct }))
      .filter((o) => o.text);

    if (nonEmpty.length < 2) {
      state.options.forEach((_, idx) => {
        const input = el.optionArray.querySelector(`[data-option-index="${idx}"]`);
        if (input) markError(input);
      });
      hasError = true;
    }

    if (payload.type === "pick_one" && !nonEmpty.some((o) => o.correct)) {
      hasError = true;
    }
    if (payload.type === "pick_many" && !nonEmpty.some((o) => o.correct)) {
      hasError = true;
    }
  } else if (payload.type === "true_false") {
    if (!["true", "false"].includes(payload.correctAnswer)) {
      markError(el.qAnswer);
      hasError = true;
    }
  } else {
    if (!payload.correctAnswer) {
      markError(el.qAnswer);
      hasError = true;
    }
  }

  if (hasError) throw new Error("Please fill all required fields marked with *.");
}

function readQuestionPayload() {
  const type = state.selectedType;
  const payload = {
    type,
    category: el.qCategory.value.trim() || "General",
    question: el.qText.value.trim(),
    options: [],
    answer: null,
    correctIndices: [],
    correctAnswer: "",
    score: Number(el.qScore.value || 1),
    timeSec: el.qTime.value ? Number(el.qTime.value) : null,
    prompt: el.qPrompt.value.trim(),
    scrambled: el.qScrambled.value.trim(),
  };

  if (type === "pick_one" || type === "pick_many") {
    const options = state.options
      .map((o) => ({ text: String(o.text || "").trim(), correct: !!o.correct }))
      .filter((o) => o.text);
    payload.options = options.map((o) => o.text);
    if (type === "pick_one") {
      const idx = options.findIndex((o) => o.correct);
      payload.answer = idx >= 0 ? idx : null;
    } else {
      payload.correctIndices = options.map((o, idx) => (o.correct ? idx : -1)).filter((idx) => idx >= 0);
    }
  } else if (type === "true_false") {
    payload.correctAnswer = String(el.qAnswer.value || "").trim().toLowerCase();
  } else {
    payload.correctAnswer = String(el.qAnswer.value || "").trim();
  }

  validateQuestionForm(payload);
  return payload;
}

function setupDropdown(trigger, menu, options, onSelect) {
  menu.innerHTML = options.map((opt) => `<button class="dd-item" type="button" data-value="${opt.id}">${opt.label}</button>`).join("");
  trigger.addEventListener("click", () => menu.classList.toggle("hidden"));
  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const item = target.closest(".dd-item");
    if (!item) return;
    const value = item.getAttribute("data-value");
    if (value === undefined) return;
    const hit = options.find((opt) => opt.id === value);
    if (!hit) return;
    trigger.textContent = hit.label;
    menu.classList.add("hidden");
    onSelect(hit);
  });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;
    if (!menu.contains(event.target) && !trigger.contains(event.target)) {
      menu.classList.add("hidden");
    }
  });
}

function initTypeDropdown() {
  setupDropdown(
    el.ddTrigger,
    el.ddMenu,
    TYPES.map((id) => ({ id, label: toSentenceCaseType(id) })),
    (hit) => {
      state.selectedType = hit.id;
      if (state.selectedType === "pick_one" || state.selectedType === "pick_many") {
        if (!state.options.length) state.options = [{ text: "", correct: true }, { text: "", correct: false }];
      }
      updateQuestionFieldVisibility();
    },
  );
}

function initSortDropdown() {
  setupDropdown(el.scoreSortTrigger, el.scoreSortMenu, SCORE_SORTS, async (hit) => {
    state.scoreSort = hit.id;
    await loadScores();
  });
}

async function initPlayerDropdown() {
  const data = await adminFetch("/api/admin/players");
  const opts = [{ id: "", label: "All Players" }].concat((data.rows || []).map((p) => ({ id: p.id, label: p.name })));
  el.playerFilterTrigger.textContent = "All Players";
  state.selectedPlayerId = "";
  setupDropdown(el.playerFilterTrigger, el.playerFilterMenu, opts, async (hit) => {
    state.selectedPlayerId = hit.id;
    await loadResponses();
  });
}

async function login() {
  clearFieldErrors();
  const username = el.username.value.trim();
  const password = el.password.value;
  if (!username || !password) {
    if (!username) markError(el.username);
    if (!password) markError(el.password);
    return setMsg("Enter username and password.", true, true);
  }
  await withLoading(el.loginBtn, async () => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials.");
      state.auth = { username, password };
      saveAuthCache();
      el.authShell.classList.add("hidden");
      el.dashboardShell.classList.remove("hidden");
      showDashboardSkeletons();
      await Promise.all([loadStats(), loadScores(), loadQuestions(), initPlayerDropdown()]);
      applyPendingEditFromUrl();
      if (window.feather) window.feather.replace();
      setMsg("Dashboard ready.");
    } catch (error) {
      clearAuthCache();
      setMsg(error.message, true, true);
    }
  });
}

function showDashboardSkeletons() {
  skeletonKpis();
  skeletonScores();
}

async function tryAutoLoginFromCache() {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_CACHE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data?.username || !data?.password || !data?.expiresAt || Date.now() > data.expiresAt) {
      clearAuthCache();
      return;
    }

    state.auth = { username: data.username, password: data.password };
    el.username.value = data.username;
    el.password.value = data.password;

    el.authShell.classList.add("hidden");
    el.dashboardShell.classList.remove("hidden");
    showDashboardSkeletons();

    await Promise.all([loadStats(), loadScores(), loadQuestions(), initPlayerDropdown()]);
    saveAuthCache();
    applyPendingEditFromUrl();
    if (window.feather) window.feather.replace();
    setMsg("Restored previous login.");
  } catch (error) {
    if (String(error?.message || "").toLowerCase().includes("unauthorized")) {
      clearAuthCache();
    }
    el.authShell.classList.remove("hidden");
    el.dashboardShell.classList.add("hidden");
    setMsg("Saved login could not be restored. Please login again.", true, true);
  }
}

async function loadStats() {
  const [stats, config] = await Promise.all([
    adminFetch("/api/admin/stats"),
    fetch("/api/game/config").then((r) => (r.ok ? r.json() : { questionTimeSec: 30 })),
  ]);
  renderKpis(stats);
  el.questionTime.value = config.questionTimeSec;
}

async function loadScores() {
  const data = await adminFetch(`/api/admin/scores?sortBy=${encodeURIComponent(state.scoreSort)}`);
  renderScores(data.rows || []);
}

async function loadResponses() {
  const qp = state.selectedPlayerId ? `?playerId=${encodeURIComponent(state.selectedPlayerId)}` : "";
  const data = await adminFetch(`/api/admin/responses${qp}`);
  renderResponses(data.rows || []);
}

async function loadQuestions() {
  const data = await adminFetch("/api/admin/questions");
  renderQuestions(data.rows || []);
}

function applyPendingEditFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  if (tab === "stats" || tab === "responses" || tab === "questions") {
    setActiveTab(tab);
  }
  const editId = params.get("edit");
  if (editId) {
    const question = state.questions.find((q) => q._id === editId);
    if (question) {
      setActiveTab("questions");
      setFormFromQuestion(question);
    }
    params.delete("edit");
  }
  params.delete("tab");
  const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", next);
}

el.loginBtn.addEventListener("click", login);
el.password.addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});

el.tabs.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const tab = btn.dataset.tab;
    setActiveTab(tab);
    if (tab === "responses") {
      try {
        skeletonResponses();
        await loadResponses();
      } catch (error) {
        setMsg(error.message, true);
      }
    }
  });
});

el.refreshScores.addEventListener("click", async () => {
  await withLoading(el.refreshScores, async () => {
    try {
      skeletonKpis();
      skeletonScores();
      await Promise.all([loadStats(), loadScores()]);
      setMsg("Stats refreshed.");
    } catch (error) {
      setMsg(error.message, true);
    }
  });
});

el.refreshResponses.addEventListener("click", async () => {
  await withLoading(el.refreshResponses, async () => {
    try {
      skeletonResponses();
      await loadResponses();
      setMsg("Responses refreshed.");
    } catch (error) {
      setMsg(error.message, true);
    }
  });
});

el.saveConfig.addEventListener("click", async () => {
  clearFieldErrors();
  const questionTimeSec = Number(el.questionTime.value);
  if (!Number.isFinite(questionTimeSec)) {
    markError(el.questionTime);
    return setMsg("Question timer is required.", true);
  }

  await withLoading(el.saveConfig, async () => {
    try {
      await adminFetch("/api/admin/config", {
        method: "POST",
        body: JSON.stringify({ questionTimeSec }),
      });
      setMsg("Question timer saved.");
    } catch (error) {
      setMsg(error.message, true);
    }
  });
});

el.clearResponses.addEventListener("click", async () => {
  if (!window.confirm("Clear all responses?")) return;
  await withLoading(el.clearResponses, async () => {
    try {
      await adminFetch("/api/admin/responses/clear", { method: "POST" });
      skeletonResponses();
      await Promise.all([loadResponses(), loadStats()]);
      setMsg("All responses cleared.");
    } catch (error) {
      setMsg(error.message, true);
    }
  });
});

el.addOption.addEventListener("click", () => {
  state.options.push({ text: "", correct: false });
  renderOptionsArray();
});

el.optionArray.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.dataset.optionIndex !== undefined) {
    const idx = Number(target.dataset.optionIndex);
    if (state.options[idx]) state.options[idx].text = target.value;
    return;
  }
  if (target.dataset.correctIndex !== undefined) {
    const idx = Number(target.dataset.correctIndex);
    if (state.selectedType === "pick_one") {
      state.options.forEach((o, i) => {
        o.correct = i === idx;
      });
    } else if (state.options[idx]) {
      state.options[idx].correct = target.checked;
    }
    renderOptionsArray();
  }
});

el.optionArray.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const removeBtn = target.closest("button[data-remove-option]");
  if (!removeBtn) return;
  const idx = Number(removeBtn.getAttribute("data-remove-option"));
  if (!Number.isFinite(idx)) return;
  state.options.splice(idx, 1);
  renderOptionsArray();
});

el.saveQuestion.addEventListener("click", async () => {
  let payload;
  try { payload = readQuestionPayload(); } catch (error) { return setMsg(error.message, true); }

  await withLoading(el.saveQuestion, async () => {
    try {
      if (state.editingQuestionId) {
        await adminFetch(`/api/admin/questions/${state.editingQuestionId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMsg("Question updated.");
      } else {
        await adminFetch("/api/admin/questions", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMsg("Question added.");
      }
      resetQuestionForm();
      await Promise.all([loadQuestions(), loadStats()]);
    } catch (error) {
      setMsg(error.message, true);
    }
  });
});

el.cancelEdit.addEventListener("click", resetQuestionForm);
el.showAllQuestions.addEventListener("click", () => {
  window.location.href = "/admin-questions.html";
});

initTypeDropdown();
initSortDropdown();
resetQuestionForm();
if (window.feather) window.feather.replace();
void tryAutoLoginFromCache();
