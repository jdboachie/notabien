import { getCurrentUser } from "../api/auth.js";

const user = await getCurrentUser();
const url = window.location.href;

const AUTH_PAGES = /\/auth\/(login|signup)\.html?/;
const HOME_ALLOWED = /(\.dev\/?$|index|settings)/;

if (!user) {
  if (!AUTH_PAGES.test(url)) {
    window.location.href = "/auth/login.html";
  }
} else {
  if (!HOME_ALLOWED.test(url)) {
    window.location.href = "../index.html";
  }
}
