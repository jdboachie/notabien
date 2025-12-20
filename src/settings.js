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
          if (value) applyFont(value);
        });
      break;
    case "change-password":
      sidebar.innerHTML = changePasswordTemplate;

      const changeForm = document.getElementById("change-password-form");
      if (changeForm) {
        changeForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const { data, error } = await supabase.auth.updateUser({
            password: 'new password'
          })
          
          if (error) {
            // notify the user
          } else {
            // notify the user
            console.log("User's password changed successfully")
            console.log(data)
          }
        });

        attachShowPassword(changeForm);
      }
      break;
    default:
      sidebar.innerHTML = colorThemeTemplate;
      const savedTheme = localStorage.getItem("theme") ?? "system";
      let savedThemeEl = document.querySelector(
        `input[name="color-theme"][value="${savedTheme}"]`,
      );
      if (savedThemeEl) savedThemeEl.checked = true;
      document
        .getElementById("color-theme-submit-button")
        .addEventListener("click", async (e) => {
          e.preventDefault();
        });
      break;
  }
}

function updateTab() {
  for (const [tab, button] of Object.entries(TABS)) {
    button.classList.toggle("sidebar__button__secondary", tab === currentTab);
    button.classList.toggle("sidebar__button", tab !== currentTab);
  }
}

for (const [tab, button] of Object.entries(TABS)) {
  button.addEventListener("click", () => {
    currentTab = tab;
    renderContent();
    updateTab();
  });
}

loadTheme();
loadFont();
updateTab();
renderContent();

document // this could be redundant
  .getElementById("color-theme-submit-button")
  .addEventListener("click", (e) => {
    e.preventDefault();
    const value = document.querySelector(
      'input[name="color-theme"]:checked',
    )?.value;
    if (value) applyTheme(value);
  });

document
  .getElementById("logout-button")
  .addEventListener("click", async (e) => {
    try {
      await signOut();
      window.location.href = "/auth/login.html";
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
