import { supabase } from "./supabase.js";

/**
 * Create a new user
 * @param {string} email
 * @param {string} password
 * @returns
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error)
  } else {
    return data;
  }
}

/**
 * Signs in a user
 * @param {string} email
 * @param {string} password
 * @returns
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error("Error signing in");
  } else {
    return data;
  }
}

/**
 * Signs out the current authenticated user
 * @throws Error - when signOut fails
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error);
  }
}

/**
 * Checks for the current authenticated user
 * @returns {User | null} User object if signed in else null
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }
  return data.user;
}
