import { signOut } from "./api/auth.js";
import { loadTheme, applyTheme, loadFont, applyFont } from "./theme.js";
import attachShowPassword from "./show-password.js";
import ensureAuth from "./auth.js";
import { supabase } from "./api/supabase.js";
import {
  colorThemeTemplate,
  changePasswordTemplate,
  fontThemeTemplate,
} from "./templates.js";
import { state, get, set, effect } from "./signals.js";
import toast from "./toaster.js";

ensureAuth();

document.getElementById("logout-button").addEventListener("click", async () => {
  try {
    toast("info", "Logging out...");
    await signOut();
    window.location.href = "/auth/login.html";
  } catch (err) {
    toast("error", "Something went wrong");
  }
});

const settingsView = document.getElementById("settings-view");
const TABS = {
  "color-theme": document.getElementById("color-theme-tab-button"),
  "font-theme": document.getElementById("font-theme-tab-button"),
  "change-password": document.getElementById("change-password-tab-button"),
};
const currentTab = state("color-theme");

for (const [tab, button] of Object.entries(TABS)) {
  button.addEventListener("click", () => {
    set(currentTab, tab);
  });
}

effect(() => {
  const tab = get(currentTab);

  for (const [key, button] of Object.entries(TABS)) {
    button.classList.toggle("sidebar__button__secondary", key === tab);
    button.classList.toggle("sidebar__button", key !== tab);
  }
});

effect(() => {
  const tab = get(currentTab);

  switch (tab) {
    case "font-theme": {
      settingsView.innerHTML = fontThemeTemplate;

      const savedFont = localStorage.getItem("font") ?? "sans";
      const savedEl = document.querySelector(
        `input[name="font-theme"][value="${savedFont}"]`,
      );
      if (savedEl) savedEl.checked = true;

      document
        .getElementById("font-theme-submit-button")
        .addEventListener("click", (e) => {
          e.preventDefault();
          const value = document.querySelector(
            'input[name="font-theme"]:checked',
          )?.value;
          if (value) {
            applyFont(value);
            toast("success", "Font updated successfully");
          }
        });
      break;
    }

    case "change-password": {
      settingsView.innerHTML = changePasswordTemplate;

      const form = document.getElementById("change-password-form");
      if (!form) return;

      attachShowPassword(form);

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const values = Object.fromEntries(new FormData(form));
        const newPassword = (values["new-password"] ?? "").toString().trim();
        const confirmPassword = (values["confirm-new-password"] ?? "")
          .toString()
          .trim();

        if (newPassword !== confirmPassword) {
          toast("error", "Passwords do not match");
          return;
        }

        if (newPassword.length < 8) {
          toast("error", "New password must be at least 8 characters");
          return;
        }

        const submitButton = document.getElementById(
          "change-password-submit-button",
        );
        const prevDisabled = submitButton?.disabled;
        const prevText = submitButton?.textContent;
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Saving...";
        }

        try {
          const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
          });
          if (error) {
            throw error;
          }
          toast("success", "Password updated successfully");
          form.reset();
        } catch (err) {
          toast("error", "Something went wrong");
        } finally {
          if (submitButton) {
            submitButton.disabled = !!prevDisabled;
            submitButton.textContent = prevText ?? "Save Password";
          }
        }
      });
      break;
    }

    default: {
      settingsView.innerHTML = colorThemeTemplate;

      const savedTheme = localStorage.getItem("theme") ?? "system";
      const savedThemeEl = document.querySelector(
        `input[name="color-theme"][value="${savedTheme}"]`,
      );
      if (savedThemeEl) savedThemeEl.checked = true;

      document
        .getElementById("color-theme-submit-button")
        .addEventListener("click", (e) => {
          e.preventDefault();
          const value = document.querySelector(
            'input[name="color-theme"]:checked',
          )?.value;
          if (value) {
            applyTheme(value);
            toast("success", "Theme updated successfully");
          }
        });
    }
  }
});

loadTheme();
loadFont();
