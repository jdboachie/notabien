import { loadTheme, loadFont } from "../scripts/theme.js";
loadTheme();
loadFont();

import { getCurrentUser } from "../api/auth.js";

let path = window.location.pathname;

if (path === "/" || path === "") path = "/index";
else if (path.endsWith(".html")) path = path.slice(0, -5);

const AUTH_PAGES = ["/auth/login", "/auth/signup"];
const APP_PAGES = ["/index", "/settings"];

const user = await getCurrentUser();

if (AUTH_PAGES.includes(path)) {
  if (user) window.location.replace("/");
} else {
  if (user) {
    if (!APP_PAGES.includes(path)) {
      window.location.replace("/index.html");
    }
  } else {
    window.location.replace("/auth/login.html");
  }
}
