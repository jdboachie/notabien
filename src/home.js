import ensureAuth from "./auth.js";
import { fetchNotes, upsertNote } from "./api/notes.js";
import { effect, get, set, state } from "./signals.js";
import {
  archivedNotesEmptyState,
  createEditorTemplate,
  createNoteListItemTemplate,
  noteListEmptyStateTemplate,
  separator,
} from "./templates.js";
import { loadTheme, loadFont } from "./theme.js";

ensureAuth();
loadTheme();
loadFont();

const TABS = {
  all: document.getElementById("all-notes-button"),
  archived: document.getElementById("archived-notes-button"),
};

const pageTitle = document.getElementById("page-title");
const noteView = document.getElementById("note-view");
const noteList = document.getElementById("note-list");

const params = new URLSearchParams(window.location.search);
const initialTab = params.get("tab") === "archived" ? "archived" : "all";

const currentTab = state(initialTab);
const notes = state(null);
const activeNoteId = state(params.get("activeNote"));

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

document.getElementById("create-note-button").addEventListener("click", (e) => {
  e.preventDefault();
  noteView.innerHTML = createEditorTemplate();
  if (get(currentTab) !== "all") {
    set(currentTab, "all");
    set(notes, null);
  }
  set(activeNoteId, "new");
});

effect(async () => {
  const data = await fetchNotes(get(currentTab) === "archived");
  set(notes, data);
});

effect(() => {
  const data = get(notes);
  const tab = get(currentTab);
  const id = get(activeNoteId);

  // Render note list
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
});

effect(() => {
  const tab = get(currentTab);
  const id = get(activeNoteId);

  pageTitle.innerText = tab === "all" ? "All Notes" : "Archived Notes";
  updateTabUI();

  const p = new URLSearchParams();
  p.set("tab", tab);
  if (id) p.set("activeNote", id);

  history.replaceState(null, "", `?${p.toString()}`);
});

effect(() => {
  const editor = document.getElementById("editor");
  if (!editor || editor.dataset.bound) return;

  editor.dataset.bound = "true";

  editor.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);
    let payload = Object.fromEntries(fd.entries());
    payload.tags = payload.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const id = get(activeNoteId);
    if (id && id !== "new") payload.id = id;

    const saved = await upsertNote(payload);

    set(
      notes,
      get(notes).map((n) => (n.id === saved.id ? { ...n, ...saved } : n)),
    );
    set(currentTab, "all");
    set(activeNoteId, saved.id);
  });
});
