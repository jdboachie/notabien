import { getCurrentUser } from "../api/auth.js";

let path = window.location.pathname;

if (path === "/") path = "/index";
else if (path.endsWith(".html")) path = path.slice(0, -5);

alert(path)

const AUTH_PAGES = ["/auth/login", "/auth/signup"];
const APP_PAGES = ["/index", "/settings"];

const user = await getCurrentUser();

if (AUTH_PAGES.includes(path)) {
  if (user) window.location.replace("/");
} else {
  if (!user) {
    window.location.replace("/auth/login.html");
  } else {
    if (!APP_PAGES.includes(path)) {
      window.location.replace("/");
    }
  }
}
