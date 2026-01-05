import toast from "./toaster.js";
import { signUp } from "./api/auth.js";
import attachShowPassword from "./show-password.js";

document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd.entries());

  signUp(obj.email, obj.password)
    .then(() => {
      toast("success", "Signed up successfully. Please confirm your email now");
    })
    .catch((error) => {
      toast("error", error);
    });
});

attachShowPassword();
