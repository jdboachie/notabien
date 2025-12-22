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
} from "./templates.js";
import { loadTheme, loadFont } from "./theme.js";
import toast from "./toaster.js";

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

const params = new URLSearchParams(window.location.search);
const initialQuery = params.get("query") || null;
const initialTab = params.get("tab") === "archived" ? "archived" : "all";

const currentTab = state(initialTab);
const notes = state(null);
const activeNoteId = state(params.get("activeNote"));
const searchQuery = state(initialQuery);

// If a query was provided in the URL, pre-fill the search input so DOM and state stay in sync.
if (searchInput && initialQuery) {
  searchInput.value = initialQuery;
  // Dispatch an input event so any listeners react to this initial value.
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
}

// Focus the search input if requested via URL (e.g. ?focusInput=true).
// Defer to the next paint to ensure focus works reliably (element is focusable and not blurred by later scripts).
if (
  searchInput &&
  (params.get("focusInput") === "true" || params.has("focusInput"))
) {
  requestAnimationFrame(() => {
    try {
      searchInput.focus();
      // Select the input contents to hint intent and place caret at the end on some browsers.
      if (typeof searchInput.select === "function") searchInput.select();
    } catch (err) {
      // Ignore focus failures (browsers may block programmatic focus in some cases).
    }
  });
}

function updateTabUI() {
  for (const [tab, button] of Object.entries(TABS)) {
    if (!button) continue;
    button.classList.toggle(
      "sidebar__button__secondary",
      tab === get(currentTab),
    );
    button.classList.toggle("sidebar__button", tab !== get(currentTab));
  }
}

for (const [tab, button] of Object.entries(TABS)) {
  if (!button) continue;
  button.addEventListener("click", () => {
    if (get(currentTab) === tab) return;
    set(notes, null);
    set(currentTab, tab);
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
  });

effect(async () => {
  const cur = get(currentTab);
  const q = get(searchQuery);
  let data;
  if (q === null) {
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

  if (data === null) {
    noteList.innerHTML = Array(10)
      .fill(`<div class="skeleton"></div>`)
      .join("");
  } else if (!data.length) {
    noteList.innerHTML =
      tab === "archived" ? archivedNotesEmptyState : noteListEmptyStateTemplate;
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
            set(activeNoteId, get(notes)[0].id);
          } catch (err) {
            toast("error", "Failed to delete note");
          } finally {
            confirmBtn.disabled = false;
            modalOverlay.hidden = true;
            modalOverlay.innerHTML = "";
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

effect(() => {
  const editor = document.getElementById("editor");
  if (!editor || editor.dataset.bound) return;

  editor.dataset.bound = "true";

  const titleInput = editor.querySelector("#editor-title");
  const saveBtn = editor.querySelector("#save-note-button");

  const updateSaveState = () => {
    if (!saveBtn) return;
    const hasTitle = titleInput && String(titleInput.value).trim().length > 0;
    saveBtn.disabled = !hasTitle;
  };

  updateSaveState();

  if (titleInput) {
    titleInput.addEventListener("input", updateSaveState);
  }

  editor.addEventListener("reset", () => {
    setTimeout(updateSaveState, 0);
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
    payload.tags = payload.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const id = get(activeNoteId);
    if (id && id !== "new") payload.id = id;

    try {
      const saved = await upsertNote(payload);
      toast("success", "Note saved successfully");

      set(
        notes,
        get(notes).map((n) => (n.id === saved.id ? { ...n, ...saved } : n)),
      );
      set(currentTab, "all");
      set(activeNoteId, saved.id);
    } catch (err) {
      toast("error", "Failed to save note");
      if (saveBtn) saveBtn.disabled = false;
    }
  });
});
