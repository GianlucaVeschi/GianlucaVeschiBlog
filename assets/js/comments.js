const LOCAL_PREVIEW_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

const section = document.querySelector("[data-comments-enabled='true']");

if (section) {
  const config = readConfig(section);
  const form = section.querySelector(".comment-form");
  const nameInput = section.querySelector("input[name='name']");
  const commentInput = section.querySelector("textarea[name='comment']");
  const honeypotInput = section.querySelector("input[name='website']");
  const submitButton = section.querySelector(".comment-button");
  const statusNode = section.querySelector(".comment-status");
  const counterNode = section.querySelector("[data-comment-counter]");
  const countNode = section.querySelector("[data-comments-count]");
  const previewNote = section.querySelector(".comments-preview-note");
  const loadingNode = section.querySelector(".comments-loading");
  const emptyNode = section.querySelector(".comments-empty");
  const errorNode = section.querySelector(".comments-error");
  const listNode = section.querySelector(".comments-list");

  const state = {
    comments: [],
    store: null,
  };

  updateCounter();
  form.addEventListener("submit", handleSubmit);
  commentInput.addEventListener("input", updateCounter);

  void initialize();

  function readConfig(root) {
    return {
      postPath: (root.dataset.commentsPostPath || "").trim(),
      postTitle: (root.dataset.commentsPostTitle || "").trim(),
      maxNameLength: Number(root.dataset.commentsMaxName || "40"),
      maxCommentLength: Number(root.dataset.commentsMaxComment || "500"),
      maxComments: Number(root.dataset.commentsMaxComments || "50"),
      supabaseUrl: trimTrailingSlash(root.dataset.commentsSupabaseUrl || ""),
      supabaseAnonKey: (root.dataset.commentsSupabaseAnonKey || "").trim(),
    };
  }

  function trimTrailingSlash(value) {
    return value.trim().replace(/\/+$/, "");
  }

  async function initialize() {
    try {
      state.store = createStore(config);
    } catch (error) {
      showUnavailable(error.message);
      return;
    }

    if (state.store.mode === "preview") {
      previewNote.hidden = false;
    }

    await refreshComments();
  }

  function createStore(currentConfig) {
    const hasSupabaseConfig = Boolean(currentConfig.supabaseUrl && currentConfig.supabaseAnonKey);

    if (hasSupabaseConfig) {
      return createSupabaseStore(currentConfig);
    }

    if (LOCAL_PREVIEW_HOSTS.has(window.location.hostname)) {
      return createPreviewStore(currentConfig);
    }

    throw new Error("Comments are not configured yet.");
  }

  function createSupabaseStore(currentConfig) {
    const authHeaders = {
      apikey: currentConfig.supabaseAnonKey,
      Authorization: `Bearer ${currentConfig.supabaseAnonKey}`,
    };

    return {
      mode: "supabase",
      async listComments() {
        const query = new URLSearchParams({
          select: "id,author_name,body,created_at",
          post_path: `eq.${currentConfig.postPath}`,
          order: "created_at.desc",
          limit: String(currentConfig.maxComments),
        });
        const response = await fetch(`${currentConfig.supabaseUrl}/rest/v1/comments?${query.toString()}`, {
          headers: authHeaders,
        });

        if (!response.ok) {
          throw new Error(await readApiError(response, "Couldn't load comments."));
        }

        const rows = await response.json();
        return rows.map(normalizeRow);
      },
      async createComment(payload) {
        const response = await fetch(`${currentConfig.supabaseUrl}/rest/v1/comments`, {
          method: "POST",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            post_path: payload.postPath,
            post_title: payload.postTitle,
            author_name: payload.name,
            body: payload.comment,
          }),
        });

        if (!response.ok) {
          throw new Error(await readApiError(response, "Couldn't post your comment."));
        }

        const rows = await response.json();
        return normalizeRow(Array.isArray(rows) ? rows[0] : rows);
      },
    };
  }

  function createPreviewStore(currentConfig) {
    const storageKey = `gianluca-blog-comments:${currentConfig.postPath}`;

    return {
      mode: "preview",
      async listComments() {
        return readPreviewComments(storageKey).slice(0, currentConfig.maxComments);
      },
      async createComment(payload) {
        const existing = readPreviewComments(storageKey);
        const created = {
          id: createClientId(),
          name: payload.name,
          comment: payload.comment,
          created_at: new Date().toISOString(),
        };
        const next = [created, ...existing].slice(0, currentConfig.maxComments);
        window.localStorage.setItem(storageKey, JSON.stringify(next));
        return created;
      },
    };
  }

  function readPreviewComments(storageKey) {
    try {
      const raw = window.localStorage.getItem(storageKey);

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function createClientId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function normalizeRow(row) {
    return {
      id: row?.id ?? createClientId(),
      name: row?.author_name ?? "",
      comment: row?.body ?? "",
      created_at: row?.created_at ?? new Date().toISOString(),
    };
  }

  async function readApiError(response, fallbackMessage) {
    try {
      const payload = await response.json();
      return payload?.message || payload?.error_description || payload?.hint || fallbackMessage;
    } catch (_error) {
      return fallbackMessage;
    }
  }

  async function refreshComments() {
    showLoading();

    try {
      state.comments = await state.store.listComments();
      renderComments(state.comments);
    } catch (error) {
      showListError(error.message || "Couldn't load comments.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!state.store) {
      return;
    }

    const name = normalizeName(nameInput.value);
    const comment = commentInput.value.trim();
    const validationError = validateInput(name, comment);

    if (honeypotInput.value.trim()) {
      form.reset();
      updateCounter();
      return;
    }

    if (validationError) {
      setStatus(validationError, true);
      return;
    }

    setStatus("Posting comment...", false);
    setSubmitting(true);

    try {
      const created = await state.store.createComment({
        name,
        comment,
        postPath: config.postPath,
        postTitle: config.postTitle,
      });

      form.reset();
      updateCounter();
      state.comments = [created, ...state.comments].slice(0, config.maxComments);
      renderComments(state.comments);
      setStatus("Comment posted.", false);
    } catch (error) {
      setStatus(error.message || "Couldn't post your comment.", true);
    } finally {
      setSubmitting(false);
    }
  }

  function normalizeName(value) {
    return value.trim().replace(/\s+/g, " ");
  }

  function validateInput(name, comment) {
    if (!name) {
      return "Please add your name.";
    }

    if (!comment) {
      return "Please add a comment.";
    }

    if (name.length > config.maxNameLength) {
      return `Names can be at most ${config.maxNameLength} characters.`;
    }

    if (comment.length > config.maxCommentLength) {
      return `Comments can be at most ${config.maxCommentLength} characters.`;
    }

    return "";
  }

  function renderComments(comments) {
    loadingNode.hidden = true;
    errorNode.hidden = true;

    if (!comments.length) {
      listNode.hidden = true;
      emptyNode.hidden = false;
      countNode.textContent = "";
      listNode.replaceChildren();
      return;
    }

    emptyNode.hidden = true;
    listNode.hidden = false;
    countNode.textContent = commentCountLabel(comments.length);
    listNode.replaceChildren(...comments.map(createCommentNode));
  }

  function createCommentNode(comment) {
    const item = document.createElement("li");
    item.className = "comment-item";

    const header = document.createElement("div");
    header.className = "comment-header";

    const author = document.createElement("strong");
    author.className = "comment-author";
    author.textContent = comment.name;

    const date = document.createElement("time");
    date.className = "comment-date";
    date.dateTime = comment.created_at;
    date.textContent = formatDate(comment.created_at);

    const body = document.createElement("p");
    body.className = "comment-body";
    body.textContent = comment.comment;

    header.append(author, date);
    item.append(header, body);

    return item;
  }

  function formatDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Just now";
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function showLoading() {
    loadingNode.hidden = false;
    emptyNode.hidden = true;
    errorNode.hidden = true;
    listNode.hidden = true;
    countNode.textContent = "";
    listNode.replaceChildren();
  }

  function showListError(message) {
    loadingNode.hidden = true;
    emptyNode.hidden = true;
    listNode.hidden = true;
    errorNode.hidden = false;
    errorNode.textContent = message;
    countNode.textContent = "";
  }

  function showUnavailable(message) {
    setSubmitting(true);
    showListError(message);
    setStatus(message, true);
  }

  function commentCountLabel(count) {
    return count === 1 ? "1 comment" : `${count} comments`;
  }

  function setSubmitting(isSubmitting) {
    nameInput.disabled = isSubmitting;
    commentInput.disabled = isSubmitting;
    honeypotInput.disabled = isSubmitting;
    submitButton.disabled = isSubmitting;
  }

  function setStatus(message, isError) {
    statusNode.textContent = message;
    statusNode.classList.toggle("is-error", Boolean(isError));
  }

  function updateCounter() {
    counterNode.textContent = `${commentInput.value.length}/${config.maxCommentLength}`;
  }
}
