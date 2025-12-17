export default function attachShowPassword(root = document) {
  if (!root) return;
  const buttons = root.querySelectorAll(".showpassword__button");
  if (!buttons || buttons.length === 0) return;

  const closedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.42 17.73c-2.23-1.46-3.67-3.66-3.67-5.59 0-3.28 4.14-7.3 9.25-7.3 2.09 0 4.03.67 5.59 1.71M19.85 8.61c.891 1.13 1.41 2.38 1.41 3.53 0 3.28-4.15 7.3-9.26 7.3-.91 0-1.799-.13-2.63-.36"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.766 14.367a3.12 3.12 0 0 1-.925-2.23 3.159 3.159 0 0 1 5.394-2.24M15.11 12.7a3.158 3.158 0 0 1-2.538 2.541M19.892 4.25 4.118 20.024"/></svg>`;

  buttons.forEach((btn) => {
    if (btn.dataset.showPasswordAttached === "true") return;
    btn.dataset.showPasswordAttached = "true";

    if (!btn._openIcon) btn._openIcon = btn.innerHTML;
    if (!btn._closedIcon) btn._closedIcon = closedIcon;

    const rawLabel = btn.getAttribute("aria-label") || "Show password";
    const showLabel = rawLabel.replace(/^Hide/i, "Show");
    const hideLabel = rawLabel.replace(/^Show/i, "Hide");

    const initInput = findRelatedInput(btn);
    if (initInput) {
      const visible = initInput.type === "text";
      btn.innerHTML = visible ? btn._closedIcon : btn._openIcon;
      btn.setAttribute("aria-pressed", visible ? "true" : "false");
      btn.setAttribute("aria-label", visible ? hideLabel : showLabel);
    } else {
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", showLabel);
    }

    btn.addEventListener("click", () => {
      const input = findRelatedInput(btn);
      if (!input) return;
      const currentlyVisible = input.type === "text";
      input.type = currentlyVisible ? "password" : "text";
      const nowVisible = input.type === "text";
      btn.innerHTML = nowVisible ? btn._closedIcon : btn._openIcon;
      btn.setAttribute("aria-pressed", nowVisible ? "true" : "false");
      btn.setAttribute("aria-label", nowVisible ? hideLabel : showLabel);
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  function findRelatedInput(button) {
    const container =
      button.closest(".form__group__input") ||
      button.closest(".form__group") ||
      button.parentElement;
    if (!container) return null;
    return (
      container.querySelector('input[type="password"], input[type="text"]') ||
      container.querySelector("input")
    );
  }
}
