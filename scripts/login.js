import { signIn } from "../api/auth.js";

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);

  const obj = Object.fromEntries(fd.entries());

  signIn(obj.email, obj.password).then(() => {
    window.location.href = "/index.html";
  }).catch((error) => {
    console.log("There was an error", error)
  });
});
