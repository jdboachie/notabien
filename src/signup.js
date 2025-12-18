import { signUp } from "../api/auth.js";
import attachShowPassword from "./show-password.js";

document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd.entries());

  signUp(obj.email, obj.password).then(() => {
    alert("Next step is to check your inbox for email confirmation");
  });
});

attachShowPassword();
