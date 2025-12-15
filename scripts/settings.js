import { signOut } from "../api/auth.js";

document.getElementById("logout-button").addEventListener("click", async (e) => {
  console.log("signing out...");
  try {
    await signOut();
  } catch (error) {
    console.log(error)
    throw error
  }
});
