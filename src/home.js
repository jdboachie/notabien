import ensureAuth from "./auth.js";
import {
  fetchFilteredNotes,
  upsertNote,
  deleteNote,
  fetchAllNotes,
} from "./api/notes.js";
import { effect, get, set, state } from "./signals.js";
import {
  separator,
  archivedNotesEmptyState,
  createEditorTemplate,
  createNoteListItemTemplate,
  noteListEmptyStateTemplate,
  restoreNoteModalTemplate,
  archiveNoteModalTemplate,
  deleteNoteModalTemplate,
  sidebarTagListTemplate,
} from "./templates.js";
import { loadTheme, loadFont } from "./theme.js";
import toast from "./toaster.js";
import {
  initLocalNotes,
  loadDraft,
  saveDraft,
  deleteDraft,
  loadAllNotes,
  replaceAllNotes,
} from "./storage.js";

ensureAuth();
loadTheme();
loadFont();

const TABS = {
  all: document.getElementById("all-notes-button"),
  archived: document.getElementById("archived-notes-button"),
};

const pageTitle = document.getElementById("page-title");
const modalOverlay = document.querySelector(".modal__overlay");
const noteView = document.getElementById("note-view");
const noteList = document.getElementById("note-list");
const searchInput = document.getElementById("search");
const sidebarTagsSection = document.getElementById("sidebar-tags-section");

const params = new URLSearchParams(window.location.search);
const initialQuery = params.get("query") || null;
const initialTab = params.get("tab") === "archived" ? "archived" : "all";

const currentTab = state(initialTab);
const notes = state(null);
initLocalNotes(notes);
const activeNoteId = state(params.get("activeNote"));
const searchQuery = state(initialQuery);

if (searchInput && initialQuery) {
  searchInput.value = initialQuery;
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
}

if (
  searchInput &&
  (params.get("focusInput") === "true" || params.has("focusInput"))
) {
  requestAnimationFrame(() => {
    try {
      searchInput.focus();
      if (typeof searchInput.select === "function") searchInput.select();
    } catch (err) {}
  });
}

function flushCurrentEditorDraft() {
  const editor = document.getElementById("editor");
  if (!editor) return;
  const titleInput = editor.querySelector("#editor-title");
  const tagsInput = editor.querySelector('input[name="tags"]');
  const contentInput = editor.querySelector("#editor-content");
  const isPublicInput = editor.querySelector('input[name="is_public"]');
  const id = get(activeNoteId) || "new";
  const payload = {
    title: titleInput ? String(titleInput.value) : "",
    content: contentInput ? String(contentInput.innerHTML) : "",
    tags: tagsInput
      ? String(tagsInput.value)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    last_edited: new Date().toISOString(),
    is_archived:
      (get(notes) || []).find((n) => String(n.id) === String(id))
        ?.is_archived || false,
    is_public: isPublicInput ? isPublicInput.checked : false,
  };
  saveDraft(id, payload);
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushCurrentEditorDraft();
});

window.addEventListener("beforeunload", () => flushCurrentEditorDraft());

function updateTabUI() {
  for (const [tab, button] of Object.entries(TABS)) {
    if (!button) continue;
    button.classList.toggle(
      "sidebar__button__secondary",
      tab === get(currentTab),
    );
    button.classList.toggle("sidebar__button__active", tab === get(currentTab));
    button.classList.toggle("sidebar__button", tab !== get(currentTab));
  }
}

for (const [tab, button] of Object.entries(TABS)) {
  if (!button) continue;
  button.addEventListener("click", () => {
    set(searchQuery, null);
    searchInput.value = null;
    if (get(currentTab) === tab) return;
    set(currentTab, tab);
    set(notes, null);
    noteView.innerHTML = "";
  });
}

searchInput.addEventListener("input", (event) => {
  if (event.target.value) {
    set(searchQuery, event.target.value);
  } else {
    set(searchQuery, null);
  }
});

modalOverlay.addEventListener("click", (_event) => {
  modalOverlay.hidden = true;
  modalOverlay.innerHTML = "";
});

document
  .getElementById("create-note-button")
  .addEventListener("click", (event) => {
    event.preventDefault();
    if (get(currentTab) !== "all") {
      set(currentTab, "all");
      set(notes, null);
    }
    set(activeNoteId, "new");
    set(searchQuery, null);
  });

document
  .getElementById("export-notes-button")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const data = await loadAllNotes();
      if (!Array.isArray(data) || data.length === 0) {
        toast("error", "No notes to export");
        return;
      }
      const payload = JSON.stringify(data, null, 2);
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = `notabien-notes-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast("success", `Exported ${data.length} notes`);
    } catch (err) {
      console.error("Export failed", err);
      toast("error", "Failed to export notes");
    }
  });

effect(async () => {
  const cur = get(currentTab);
  const q = get(searchQuery);
  let data;
  if (!q) {
    data = await fetchFilteredNotes(cur === "archived");
  } else {
    const all = await fetchAllNotes();
    const qLower = String(q).toLowerCase().trim();
    data = (all || []).filter((note) => {
      const title = String(note.title || "").toLowerCase();
      const content = String(note.content || "").toLowerCase();
      const tags = (note.tags || []).join(" ").toLowerCase();
      return (
        title.includes(qLower) ||
        content.includes(qLower) ||
        tags.includes(qLower)
      );
    });
  }
  set(notes, data);
});

effect(() => {
  const data = get(notes);
  const tab = get(currentTab);
  const id = get(activeNoteId);
  const q = get(searchQuery);

  if (data === null) {
    noteList.innerHTML = Array(10)
      .fill(`<div class="skeleton"></div>`)
      .join("");
  } else if (!data.length) {
    if (q) {
      noteList.innerHTML = `
        <p class="note__list__empty text-preset-5">
          No notes match your search. Try a different keyword or create a new note.
        </p>
      `;
    } else {
      noteList.innerHTML =
        tab === "archived"
          ? archivedNotesEmptyState
          : noteListEmptyStateTemplate;
    }
  } else {
    noteList.innerHTML =
      tab === "archived"
        ? `<p style="margin-bottom:16px" class="text-muted text-preset-6">
             All your archived notes are stored here. You can restore or delete them anytime.
           </p>`
        : "";

    data.forEach((note, idx) => {
      const node = document.createElement("li");
      node.innerHTML = createNoteListItemTemplate(
        note.title,
        note.tags,
        note.last_edited,
        note.is_archived,
      );

      if (String(note.id) === String(id)) {
        node.classList.add("activenote");
      }

      node.addEventListener("click", (e) => {
        e.preventDefault();
        set(activeNoteId, note.id);
      });

      noteList.append(node);
      if (idx !== data.length - 1) noteList.append(separator());
    });
  }

  if (!id || !data) return;

  if (id === "new") {
    noteView.innerHTML = createEditorTemplate();
  } else {
    const active = data.find((n) => String(n.id) === String(id));
    if (!active) return;

    noteView.innerHTML = createEditorTemplate(
      active.title,
      active.content,
      active.tags,
      active.last_edited,
      active.is_archived,
      active.is_public,
    );
  }

  const archiveButton = document.getElementById("archive-note-trigger");
  if (archiveButton && !archiveButton.dataset.bound) {
    archiveButton.dataset.bound = "true";
    archiveButton.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldArchive = get(currentTab) === "all";

      modalOverlay.innerHTML = shouldArchive
        ? archiveNoteModalTemplate
        : restoreNoteModalTemplate;
      modalOverlay.hidden = false;

      const modalEl = modalOverlay.querySelector(".modal");
      if (modalEl)
        modalEl.addEventListener("click", (e) => e.stopPropagation());

      const confirmBtn = document.getElementById("confirm-archive-note-button");
      const cancelBtn = document.getElementById("cancel-archive-note-button");

      confirmBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        confirmBtn.disabled = true;
        try {
          const id = get(activeNoteId);
          if (!id || id === "new") {
            toast("error", "No note selected");
            return;
          }
          const currentList = get(notes) || [];
          const existing = currentList.find((n) => String(n.id) === String(id));
          if (!existing) {
            toast("error", "Note not found");
            return;
          }

          const payload = {
            ...existing,
            id: existing.id,
            is_archived: shouldArchive,
          };
          const saved = await upsertNote(payload);
          toast(
            "success",
            `Note ${shouldArchive ? "archived" : "restored"} successfully`,
          );

          if (get(currentTab) === "all") {
            set(
              notes,
              get(notes).filter((n) => String(n.id) !== String(saved.id)),
            );
            set(currentTab, "archived");
            noteView.innerHTML = "";
          } else {
            set(currentTab, "all");
            set(
              notes,
              get(notes).map((n) =>
                n.id === saved.id ? { ...n, ...saved } : n,
              ),
            );
          }
          deleteDraft(saved.id);
          deleteDraft("new");
        } catch (err) {
          toast("error", "Failed to archive note");
        } finally {
          confirmBtn.disabled = false;
          modalOverlay.hidden = true;
          modalOverlay.innerHTML = "";
        }
      });

      if (cancelBtn) {
        cancelBtn.addEventListener("click", (e) => {
          e.preventDefault();
          modalOverlay.hidden = true;
          modalOverlay.innerHTML = "";
        });
      }
    });
  }

  const deleteNoteButton = document.getElementById("delete-note-trigger");
  if (deleteNoteButton && !deleteNoteButton.dataset.bound) {
    deleteNoteButton.dataset.bound = "true";
    deleteNoteButton.addEventListener("click", (event) => {
      event.preventDefault();

      modalOverlay.innerHTML = deleteNoteModalTemplate;
      modalOverlay.hidden = false;

      const modalEl = modalOverlay.querySelector(".modal");
      if (modalEl)
        modalEl.addEventListener("click", (e) => e.stopPropagation());

      const confirmBtn = document.getElementById("confirm-delete-note-button");
      const cancelBtn = document.getElementById("cancel-delete-note-button");

      if (confirmBtn) {
        confirmBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          confirmBtn.disabled = true;
          try {
            const id = get(activeNoteId);
            await deleteNote(id);
            toast("success", "Note deleted successfully");

            set(
              notes,
              get(notes).filter((n) => String(n.id) !== String(id)),
            );
            deleteDraft(id);
            deleteDraft("new");
          } catch (err) {
            toast("error", "Failed to delete note");
          } finally {
            confirmBtn.disabled = false;
            modalOverlay.hidden = true;
            modalOverlay.innerHTML = "";
          }
          try {
            set(activeNoteId, get(notes)[0].id);
          } catch (error) {
            set(activeNoteId, null);
            noteView.innerHTML = "";
          }
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener("click", (e) => {
          e.preventDefault();
          modalOverlay.hidden = true;
          modalOverlay.innerHTML = "";
        });
      }
    });
  }
});

effect(() => {
  const tab = get(currentTab);
  const id = get(activeNoteId);
  const q = get(searchQuery);

  if (q) {
    pageTitle.innerHTML = `<p class="text-muted">Showing results for:</p> ${get(searchQuery)}`;
  } else {
    pageTitle.innerText = tab === "all" ? "All Notes" : "Archived Notes";
  }

  updateTabUI();

  const p = new URLSearchParams();
  p.set("tab", tab);
  if (id) p.set("activeNote", id);
  if (q) p.set("query", q);

  history.replaceState(null, "", `?${p.toString()}`);
});

effect(async () => {
  get(notes);

  try {
    const all = (await fetchAllNotes()) || [];
    replaceAllNotes(all);
    const counts = {};
    all.forEach((note) => {
      (note.tags || []).forEach((t) => {
        if (!t) return;
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    const tagList = Object.keys(counts)
      .map((name) => ({ name, count: counts[name] }))
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );

    if (!sidebarTagsSection) return;

    sidebarTagsSection.innerHTML = sidebarTagListTemplate(tagList);
    sidebarTagsSection.querySelectorAll("button[data-tag]").forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "true";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const tag = btn.dataset.tag;
        if (!tag) return;
        set(searchQuery, tag);
        if (searchInput) {
          searchInput.value = tag;
          searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
        set(currentTab, "all");
        set(activeNoteId, null);
      });
    });
  } catch (err) {
    console.error("Failed to load sidebar tags", err);
  }
});

effect(() => {
  const editor = document.getElementById("editor");
  if (!editor || editor.dataset.bound) return;

  editor.dataset.bound = "true";

  const titleInput = editor.querySelector("#editor-title");
  const tagsInput = editor.querySelector('input[name="tags"]');
  
  const contentInput = editor.querySelector("#editor-content");
  const isPublicInput = editor.querySelector('input[name="is_public"]');

  const saveBtn = editor.querySelector("#save-note-button");

  const toolbarButtons = editor.querySelectorAll(".editor__toolbar__button");
  toolbarButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const command = btn.dataset.command;
      if (command) {
        document.execCommand(command, false, null);
        contentInput.focus();
      }
    });
  });

  const updateSaveState = () => {
    if (!saveBtn) return;
    const hasTitle = titleInput && String(titleInput.value).trim().length > 0;
    saveBtn.disabled = !hasTitle;
  };

  updateSaveState();

  if (titleInput) {
    titleInput.addEventListener("input", updateSaveState);
  }

  const currentId = get(activeNoteId);
  const existingDraft = loadDraft(currentId || "new");
  if (existingDraft) {
    if (titleInput && typeof existingDraft.title !== "undefined") {
      titleInput.value = existingDraft.title;
    }
    if (contentInput && typeof existingDraft.content !== "undefined") {
      contentInput.innerHTML = existingDraft.content;
    }
    if (tagsInput && typeof existingDraft.tags !== "undefined") {
      tagsInput.value = (existingDraft.tags || []).join(", ");
    }
    if (isPublicInput && typeof existingDraft.is_public !== "undefined") {
      isPublicInput.checked = existingDraft.is_public;
    }
    updateSaveState();
  }

  let draftTimer;
  const scheduleDraftSave = () => {
    if (draftTimer) clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      const id = get(activeNoteId) || "new";
      const tags = tagsInput
        ? String(tagsInput.value || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      const payload = {
        title: titleInput ? String(titleInput.value) : "",
        content: contentInput ? String(contentInput.innerHTML) : "",
        tags,
        last_edited: new Date().toISOString(),
        is_archived:
          (get(notes) || []).find((n) => String(n.id) === String(id))
            ?.is_archived || false,
        is_public: isPublicInput ? isPublicInput.checked : false,
      };
      saveDraft(id, payload);
    }, 500);
  };

  if (titleInput) titleInput.addEventListener("input", scheduleDraftSave);
  if (contentInput) contentInput.addEventListener("input", scheduleDraftSave);
  if (tagsInput) tagsInput.addEventListener("input", scheduleDraftSave);

  editor.addEventListener("reset", () => {
    setTimeout(updateSaveState, 0);
    deleteDraft(get(activeNoteId) || "new");
  });

  editor.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titleVal = titleInput ? String(titleInput.value).trim() : "";
    if (!titleVal) {
      toast("error", "Please add a title for your note");
      updateSaveState();
      return;
    }

    if (saveBtn) saveBtn.disabled = true;

    const fd = new FormData(e.target);
    let payload = Object.fromEntries(fd.entries());
    payload.content = contentInput ? contentInput.innerHTML : "";
    payload.tags = payload.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    payload.is_public = !!payload.is_public;

    const id = get(activeNoteId);
    if (id && id !== "new") payload.id = id;

    try {
      const saved = await upsertNote(payload);
      toast("success", "Note saved successfully");

      const current = get(notes) || [];
      const updated = current.some((n) => String(n.id) === String(saved.id))
        ? current.map((n) =>
            String(n.id) === String(saved.id) ? { ...n, ...saved } : n,
          )
        : [saved, ...current];
      set(notes, updated);
      set(currentTab, "all");
      set(activeNoteId, saved.id);
      deleteDraft(saved.id);
      deleteDraft("new");
    } catch (err) {
      toast("error", "Failed to save note");
      if (saveBtn) saveBtn.disabled = false;
    }
  });
});
