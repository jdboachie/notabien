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
const tab = new URLSearchParams(window.location.search).get("tab");
let currentTab = state(tab == "archived" ? "archived-notes" : "all-notes");

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
      set(notes, null);
      set(currentTab, tab);
      updateTab();
    });
  }
}

updateTab();

let noteView = document.getElementById("note-view");

document
  .getElementById("create-note-button")
  .addEventListener("click", (event) => {
    event.preventDefault();
    set(notes, null);
    set(currentTab, "all-notes");
    noteView.innerHTML = createEditorTemplate();
  });

let notesList = document.getElementById("note-list");
let notes = state(null);

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
        <ul>
          <p style="margin-bottom: 16px;" class="text-muted text-preset-6">
            All your archived notes are stored here. You can restore or delete them anytime.
          </p>
        </ul>
      `
          : `<ul></ul>`;
      data.forEach((note, idx) => {
        const template = createNoteListItemTemplate(
          note.title,
          note.tags,
          note.last_edited,
          note.is_archived,
        );
        const node = document.createElement("li");
        node.innerHTML = template;
        node.addEventListener("click", (event) => {
          event.preventDefault();
          noteView.innerHTML = createEditorTemplate(
            note.title,
            note.content,
            note.tags,
            note.last_edited,
            note.is_archived,
          );
        });
        notesList.append(node);
        if (idx !== data.length - 1) {
          notesList.append(separator());
        }
      });
    }
  }

  renderNotes();
});
