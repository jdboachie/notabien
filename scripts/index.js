import { getCurrentUser } from "../api/auth.js";

const user = await getCurrentUser();
const currentUrl = window.location.href;
if (!user) {
  if (
    !currentUrl.endsWith("login.html") &&
    !currentUrl.endsWith("signup.html")
  ) {
    window.location.href = "/auth/login.html";
  }
} else {
  if (
    currentUrl.endsWith("index.html") ||
    currentUrl.endsWith("settings.html")
  ) {
    console.log(user);
  } else {
    window.location.href = "../index.html";
  }
}
