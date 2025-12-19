import ensureAuth from "./auth.js";
import { fetchArchivedNotes, fetchNotes } from "./api/notes.js";
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
  "all-notes": document.getElementById("all-notes-button"),
  "archived-notes": document.getElementById("archived-notes-button"),
};
let pageTitle = document.getElementById("page-title");
let noteView = document.getElementById("note-view");
let notesList = document.getElementById("note-list");
console.log(pageTitle);

const tab = new URLSearchParams(window.location.search).get("tab");

let currentTab = state(tab == "archived" ? "archived-notes" : "all-notes");
let notes = state(null);
let activeNoteId = state(
  new URLSearchParams(window.location.search).get("activeNote"),
);

function updateTab() {
  for (const [tab, button] of Object.entries(TABS)) {
    if (button !== null) {
      button.classList.toggle(
        "sidebar__button__secondary",
        tab === get(currentTab),
      );
      button.classList.toggle("sidebar__button", tab !== get(currentTab));
    }
  }
}

for (const [tab, button] of Object.entries(TABS)) {
  if (button !== null) {
    button.addEventListener("click", () => {
      if (get(currentTab) !== tab) {
        set(notes, null);
        set(currentTab, tab);
        updateTab();
      }
    });
  }
}

document
  .getElementById("create-note-button")
  .addEventListener("click", (event) => {
    event.preventDefault();
    if (get(currentTab) !== "all-notes") {
      set(currentTab, "all-notes");
      set(notes, null);
    }
    set(activeNoteId, null);
    noteView.innerHTML = createEditorTemplate();
  });

effect(() => {
  let cur = get(currentTab);
  pageTitle.innerText = cur === "all-notes" ? "All Notes" : "Archived Notes"
  updateTab();
});

effect(async () => {
  let data;
  if (get(currentTab) === "archived-notes") {
    data = await fetchArchivedNotes();
  } else {
    data = await fetchNotes();
  }
  set(notes, data);
});

effect(() => {
  get(activeNoteId);
  function renderNotes() {
    const data = get(notes);
    if (data === null) {
      notesList.innerHTML = `
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        `;
      return;
    }
    if (!data || data.length == 0) {
      notesList.innerHTML =
        get(currentTab) === "archived-notes"
          ? archivedNotesEmptyState
          : noteListEmptyStateTemplate;
    } else {
      notesList.innerHTML =
        get(currentTab) === "archived-notes"
          ? `
          <p style="margin-bottom: 16px;" class="text-muted text-preset-6">
            All your archived notes are stored here. You can restore or delete them anytime.
          </p>
      `
          : ``;
      data.forEach((note, idx) => {
        const template = createNoteListItemTemplate(
          note.title,
          note.tags,
          note.last_edited,
          note.is_archived,
        );
        const node = document.createElement("li");
        node.innerHTML = template;
        if (get(activeNoteId) === note.id) {
          node.classList.add("activenote");
        } else {
          node.classList.remove("activenote");
        }
        node.addEventListener("click", (event) => {
          event.preventDefault();
          set(activeNoteId, note.id);
        });
        notesList.append(node);
        if (idx !== data.length - 1) {
          notesList.append(separator());
        }
      });
      const activeId = get(activeNoteId);
      if (activeId != null) {
        const active = data.find((n) => String(n.id) === String(activeId));
        if (active) {
          noteView.innerHTML = createEditorTemplate(
            active.title,
            active.content,
            active.tags,
            active.last_edited,
            active.is_archived,
          );
        }
      }
    }
  }

  renderNotes();
});

effect(() => {
  const tab = get(currentTab) === "archived-notes" ? "archived" : "all";
  const activeNote = get(activeNoteId);
  const params = new URLSearchParams();
  params.set("tab", tab);
  if (activeNote != null) {
    params.set("activeNote", String(activeNote));
  }
  const url = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, "", url);
});
