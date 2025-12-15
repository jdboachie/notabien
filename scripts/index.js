import { getCurrentUser } from "../api/auth.js";

const path = window.location.pathname;

const AUTH_PAGES = /^\/auth\/(login|signup)\.html$/;
const APP_PAGES = /^(\/$|\/index\.html$|\/settings\.html$)/;

if (AUTH_PAGES.test(path)) {
  const user = await getCurrentUser();
  if (user) window.location.replace("/index.html");
} else {
  const user = await getCurrentUser();
  if (!user) {
    window.location.replace("/auth/login.html");
  } else {
    if (!APP_PAGES.test(path)) {
      window.location.replace("/index.html");
    }
  }
}
