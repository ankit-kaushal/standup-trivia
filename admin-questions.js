const AUTH_KEY = "standupTriviaAdminAuth";
const msg = document.getElementById("msg");
const list = document.getElementById("q-list");
const refreshBtn = document.getElementById("refresh");

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "#ff6b6b" : "#7dffce";
}

function toSentenceCaseType(type) {
  return String(type || "")
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function getAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data?.username || !data?.password || !data?.expiresAt || Date.now() > data.expiresAt) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return data;
  } catch (_e) {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

async function authFetch(path) {
  const auth = getAuth();
  if (!auth) {
    window.location.href = "/admin";
    throw new Error("Please login first.");
  }

  const res = await fetch(path, {
    headers: {
      "x-admin-username": auth.username,
      "x-admin-password": auth.password,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "/admin";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}

function renderQuestions(rows) {
  if (!rows.length) {
    list.innerHTML = "<p>No questions found.</p>";
    return;
  }

  list.innerHTML = rows
    .map(
      (q) => `<article class="q-item"><div class="meta">${toSentenceCaseType(q.type)} · ${q.category || "General"} · score ${q.score || 1} · ${q.timeSec ? `${q.timeSec}s` : "default"}</div><div class="q-text">${q.question}</div><div class="q-row"><small style="color:var(--muted)">${q._id}</small><div class="q-actions"><button class="icon-btn" type="button" data-edit="${q._id}" title="Edit"><i data-feather="edit-3"></i></button><button class="icon-btn danger" type="button" data-delete="${q._id}" title="Delete"><i data-feather="trash-2"></i></button></div></div></article>`,
    )
    .join("");
  if (window.feather) window.feather.replace();
}

async function loadQuestions() {
  try {
    const data = await authFetch("/api/admin/questions");
    renderQuestions(data.rows || []);
    setMsg("Questions loaded.");
  } catch (error) {
    setMsg(error.message, true);
  }
}

refreshBtn.addEventListener("click", loadQuestions);
list.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const editBtn = target.closest("button[data-edit]");
  if (editBtn) {
    const id = editBtn.getAttribute("data-edit");
    if (!id) return;
    window.location.href = `/admin?edit=${encodeURIComponent(id)}`;
    return;
  }

  const deleteBtn = target.closest("button[data-delete]");
  if (deleteBtn) {
    const id = deleteBtn.getAttribute("data-delete");
    if (!id || !window.confirm("Delete this question?")) return;
    try {
      const auth = getAuth();
      if (!auth) {
        window.location.href = "/admin";
        return;
      }
      const res = await fetch(`/api/admin/questions/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          "x-admin-username": auth.username,
          "x-admin-password": auth.password,
        },
      });
      if (!res.ok) throw new Error("Failed to delete question.");
      await loadQuestions();
      setMsg("Question deleted.");
    } catch (error) {
      setMsg(error.message, true);
    }
  }
});
void loadQuestions();
