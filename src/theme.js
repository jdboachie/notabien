export function loadTheme() {
  const saved = localStorage.getItem("theme") ?? "system";
  applyTheme(saved);
}

/**
 * Apply theme to the web
 * @param {string} theme
 */
export function applyTheme(theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  localStorage.setItem("theme", theme);
}

/**
 * Apply font to the web (persists in localStorage)
 * @param {string} font
 */
export function applyFont(font) {
  document.documentElement.setAttribute("data-font", font);
  localStorage.setItem("font", font);
}

/**
 * Load font from storage (default: 'sans')
 */
export function loadFont() {
  const saved = localStorage.getItem("font") ?? "sans";
  applyFont(saved);
}
