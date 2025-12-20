const toaster = document.querySelector(".toaster");

const checkmarkIcon = `
  <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
  >
      <path
          fill="var(--color-green-500)"
          fill-rule="evenodd"
          d="m15.993 10.222-4.618 4.618a.746.746 0 0 1-1.061 0l-2.309-2.309a.75.75 0 0 1 1.06-1.061l1.78 1.779 4.087-4.088a.75.75 0 1 1 1.061 1.061ZM12 2.5c-5.238 0-9.5 4.262-9.5 9.5 0 5.239 4.262 9.5 9.5 9.5s9.5-4.261 9.5-9.5c0-5.238-4.262-9.5-9.5-9.5Z"
          clip-rule="evenodd"
      />
  </svg>
  `;

const errorIcon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="var(--color-red-500)"
    viewBox="0 0 256 256"
  >
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z">
    </path>
  </svg>
  `;

/**
 * Displays a toast notification.
 *
 * @param {string} type - The type of toast (e.g., 'success', 'error').
 * @param {string} message - The message to display in the toast.
 * @param {number} [duration=3000] - The duration in milliseconds to show the toast. Defaults to 3000ms.
 */
export default function toast(type, message, duration = 3000) {
  if (!toaster) {
    // TODO: Remove this before shipping
    console.warn("No .toaster element found to display notifications.");
    return;
  }

  const toastElement = document.createElement("div");
  toastElement.classList.add("toast", "text-preset-5");

  const icon = type === "error" ? errorIcon : checkmarkIcon;
  toastElement.innerHTML = `<span class="toast__icon">${icon}</span><p>${message}</p>`;

  toaster.appendChild(toastElement);

  toastElement.offsetHeight;
  toastElement.classList.add("toast--enter");

  setTimeout(() => {
    toastElement.classList.remove("toast--enter");
    toastElement.classList.add("toast--exit");

    toastElement.addEventListener(
      "transitionend",
      () => toastElement.remove(),
      { once: true },
    );
  }, duration);
}
