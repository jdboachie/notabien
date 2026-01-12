import { get, set, effect } from "./signals.js";
import toast from "./toaster.js";

const NOTES_KEY = "notabien:notes:v1";
const DRAFTS_KEY = "notabien:drafts:v1";

function isQuotaError(err) {
  if (!err) return false;
  const name = err.name || "";
  const code = err.code || 0;
  return (
    name === "QuotaExceededError" ||
    name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    code === 22 ||
    code === 1014
  );
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    if (isQuotaError(err)) {
      try {
        localStorage.removeItem(DRAFTS_KEY);
        localStorage.setItem(key, value);
        toast("info", "Local storage full — cleared drafts to free space");
        return true;
      } catch (err2) {
        toast("error", "Failed to save to local storage: quota exceeded");
        return false;
      }
    }
    console.error("Failed to write to localStorage", err);
    toast("error", "Failed to save to local storage");
    return false;
  }
}

export function loadAllNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse notes from localStorage", err);
    localStorage.removeItem(NOTES_KEY);
    return null;
  }
}

export function saveAllNotes(partialNotes) {
  try {
    const existing = loadAllNotes() || [];
    const map = {};
    existing.forEach((n) => {
      if (n && n.id !== undefined && n.id !== null) map[String(n.id)] = n;
    });
    if (Array.isArray(partialNotes)) {
      partialNotes.forEach((n) => {
        if (n && n.id !== undefined && n.id !== null) map[String(n.id)] = n;
      });
    }
    const merged = Object.values(map).sort((a, b) => {
      const ta = a && a.last_edited ? new Date(a.last_edited).getTime() : 0;
      const tb = b && b.last_edited ? new Date(b.last_edited).getTime() : 0;
      return tb - ta;
    });
    safeSetItem(NOTES_KEY, JSON.stringify(merged));
  } catch (err) {
    console.error("saveAllNotes failed", err);
  }
}

/**
 * Replace the entire local notes store with the provided array.
 *
 * This will overwrite all local notes with the provided `notes` array,
 * sorted by `last_edited` descending. Use this when remote data arrives
 * and you want to reconcile local storage with the remote source.
 *
 * @param {Object[]} notes - Array of note objects to persist locally.
 * @returns {boolean} true if saved successfully; false otherwise.
 */
export function replaceAllNotes(notes) {
  try {
    const arr = Array.isArray(notes) ? notes.slice() : [];
    arr.sort((a, b) => {
      const ta = a && a.last_edited ? new Date(a.last_edited).getTime() : 0;
      const tb = b && b.last_edited ? new Date(b.last_edited).getTime() : 0;
      return tb - ta;
    });
    safeSetItem(NOTES_KEY, JSON.stringify(arr));
    return true;
  } catch (err) {
    console.error("replaceAllNotes failed", err);
    return false;
  }
}

export function loadDraft(id) {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) || {};
    return map[String(id)] || null;
  } catch (err) {
    console.error("Failed to parse drafts from localStorage", err);
    localStorage.removeItem(DRAFTS_KEY);
    return null;
  }
}

export function saveDraft(id, draft) {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[String(id)] = draft;
    safeSetItem(DRAFTS_KEY, JSON.stringify(map));
    return true;
  } catch (err) {
    console.error("saveDraft failed", err);
    toast("error", "Failed to save draft to local storage");
    return false;
  }
}

export function deleteDraft(id) {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    if (!raw) return;
    const map = JSON.parse(raw) || {};
    if (map.hasOwnProperty(String(id))) {
      delete map[String(id)];
      safeSetItem(DRAFTS_KEY, JSON.stringify(map));
    }
  } catch (err) {
    console.error("deleteDraft failed", err);
  }
}

export function clearDrafts() {
  try {
    localStorage.removeItem(DRAFTS_KEY);
  } catch (err) {
    console.error("clearDrafts failed", err);
  }
}

export function initLocalNotes(notesSignal) {
  const saved = loadAllNotes();
  const current = get(notesSignal);
  if (
    (current === null || typeof current === "undefined") &&
    saved &&
    Array.isArray(saved)
  ) {
    set(notesSignal, saved);
  }
  effect(() => {
    const n = get(notesSignal);
    if (n === null || typeof n === "undefined") return;
    saveAllNotes(n);
  });
}
