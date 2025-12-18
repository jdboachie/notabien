import { supabase } from "./supabase.js";

export async function fetchNotes() {
  let { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("is_archived", false)
    .order("last_edited", { ascending: false });

  if (error) {
    throw new Error(error);
  } else {
    return data;
  }
}

export async function fetchArchivedNotes() {
  let { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("is_archived", true);

  if (error) {
    throw new Error(error);
  } else {
    return data;
  }
}
