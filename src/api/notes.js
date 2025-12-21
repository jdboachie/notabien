import { getCurrentUser } from "./auth.js";
import { supabase } from "./supabase.js";

/**
 * Validate a payload for inserting a note into the database.
 *
 * Ensures the payload has the required fields and correct types:
 * - user_id: required string
 * - title: required string
 * - content: required string
 * - tags: required array of strings
 * - is_archived: optional boolean
 *
 * @param {Object} note - The note payload to validate.
 * @param {string} note.user_id - ID of the user who owns the note.
 * @param {string} note.title - Title of the note.
 * @param {string} note.content - Content/body of the note.
 * @param {string[]} note.tags - Array of tag strings associated with the note.
 * @param {boolean} [note.is_archived] - Optional flag indicating whether the note is archived.
 * @returns {boolean} True if the payload is valid, otherwise false.
 */
function validateNoteInsert(note) {
  if (typeof note.user_id !== "string") return false;
  if (typeof note.title !== "string") return false;
  if (typeof note.content !== "string") return false;
  if (!Array.isArray(note.tags)) return false;
  if (note.tags.some((t) => typeof t !== "string")) return false;
  if (note.is_archived !== undefined && typeof note.is_archived !== "boolean")
    return false;

  return true;
}

/**
 * Insert a new note into the "notes" table.
 *
 * The note payload is validated before insertion. On
 * success the inserted record returned by Supabase is resolved.
 *
 * @param {Object} note - Note payload to insert.
 * @param {string} note.user_id - ID of the user who owns the note.
 * @param {string} note.title - Title of the note.
 * @param {string} note.content - Content/body of the note.
 * @param {string[]} note.tags - Array of tag strings associated with the note.
 * @param {boolean} [note.is_archived] - Optional flag indicating whether the note is archived.
 * @returns {Promise<Object>} The inserted note record as returned by Supabase.
 * @throws {TypeError} If the provided note payload fails validation.
 * @throws {Error} If Supabase returns an error during insertion.
 */
export async function upsertNote(note) {
  let { id } = await getCurrentUser();
  note = { ...note, user_id: id, last_edited: new Date().toISOString() };

  if (!validateNoteInsert(note)) {
    throw new TypeError(`Invalid note payload: ${note}`);
  }

  const { data, error } = await supabase
    .from("notes")
    .upsert(note)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Fetch notes from the "notes" table.
 *
 * Optionally filters notes by their archived state. Results are ordered by
 * the "last_edited" column in descending order.
 *
 * @param {boolean} [isArchived=false] - When true, only archived notes are returned;
 *  when false (default), only non-archived notes are returned.
 * @returns {Promise<Object[]>} A promise that resolves to an array of note records as returned by Supabase.
 * @throws {Error} If Supabase returns an error during the query.
 */
export async function fetchNotes(isArchived = false) {
  let { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("is_archived", isArchived)
    .order("last_edited", { ascending: false });

  if (error) {
    throw new Error(error);
  } else {
    return data;
  }
}

/**
 * Delete a note by id. Only notes owned by the current user may be deleted.
 *
 * @param {string|number} id - The id of the note to delete.
 * @returns {Promise<Object>} The deleted note record as returned by Supabase.
 * @throws {TypeError} If `id` is not provided.
 * @throws {Error} If Supabase returns an error during the deletion.
 */
export async function deleteNote(id) {
  if (!id && id !== 0) {
    throw new TypeError("Missing note id");
  }

  let { id: userId } = await getCurrentUser();

  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error);
  }

  return data;
}
