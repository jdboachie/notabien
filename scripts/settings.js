import { signOut } from "../api/auth.js";
import {
  loadTheme,
  applyTheme,
  loadFont,
  applyFont,
} from "../scripts/theme.js";
import attachShowPassword from "./show-password.js";

const sidebar = document.getElementById("settings-view");

const TABS = {
  "color-theme": document.getElementById("color-theme-tab-button"),
  "font-theme": document.getElementById("font-theme-tab-button"),
  "change-password": document.getElementById("change-password-tab-button"),
};

const colorThemeTemplate = `
  <div class="settings__group">
      <h2 class="settings__group__title text-preset-3">
          Color Theme
      </h2>
      <p class="settings__group__description text-preset-5">
          Choose your color theme:
      </p>
      <form class="settings__group__form">
          <label class="radio__card">
              <div class="radio__card__icon">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                      <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M12.055 3v1.372m0 15.256V21m9-9h-1.372M4.427 12H3.055m15.364-6.364-.97.97M6.66 17.394l-.97.97m12.728 0-.97-.97M6.66 6.606l-.97-.97"
                      />
                      <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M12.055 7.805a4.195 4.195 0 1 1 0 8.39 4.195 4.195 0 0 1 0-8.39Z"
                          clip-rule="evenodd"
                      />
                  </svg>
              </div>
              <div class="radio__card__label">
                  <h3 class="text-preset-4">Light Mode</h3>
                  <p class="text-preset-6">
                      Pick a clean and classic light theme
                  </p>
              </div>
              <input type="radio" name="color-theme" value="light" />
          </label>
          <label class="radio__card">
              <div class="radio__card__icon">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                      <path
                          fill="currentColor"
                          d="M12.614 21.723c-2.53 0-5.03-.97-6.89-2.84-1.86-1.87-2.85-4.28-2.85-6.88 0-2.6 1.01-5.04 2.85-6.88 3.05-3.06 7.82-3.73 11.59-1.63.26.15.44.48.41.78-.03.33-.25.6-.57.7-3.05.94-5.19 3.83-5.19 7.03 0 3.21 2.14 6.1 5.19 7.02.29.09.53.38.57.68.04.3-.14.65-.4.8-1.47.82-3.1 1.22-4.71 1.22Zm0-17.94c-2.14 0-4.25.83-5.83 2.4-1.58 1.57-2.41 3.62-2.41 5.82s.85 4.27 2.41 5.82c2.21 2.21 5.49 2.94 8.39 1.99-2.83-1.51-4.7-4.52-4.7-7.81s1.87-6.3 4.69-7.82c-.83-.27-1.7-.4-2.55-.4Zm3.97 1.02s.01 0 .02.01c0 0-.01 0-.02-.01ZM18.974 19.052c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06 8.179 8.179 0 0 0 2.41-5.81c0-2.19-.85-4.26-2.41-5.81a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0a9.653 9.653 0 0 1 2.85 6.87c0 2.59-1.01 5.04-2.85 6.87-.15.15-.34.22-.53.22Z"
                      />
                  </svg>
              </div>
              <div class="radio__card__label">
                  <h3 class="text-preset-4">Dark Mode</h3>
                  <p class="text-preset-6">
                      Select a sleek and modern dark theme
                  </p>
              </div>
              <input type="radio" name="color-theme" value="dark" />
          </label>
          <label class="radio__card">
              <div class="radio__card__icon">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                      <path
                          fill="currentColor"
                          d="M5.47 19.825c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l14.12-14.12c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L6 19.605c-.15.15-.34.22-.53.22ZM3.61 15.325a.752.752 0 0 1-.3-1.44c.38-.16.84 0 1.01.38.17.38.01.81-.37.98l-.04.02c-.1.04-.2.06-.3.06Zm.05-6.68a.766.766 0 0 1-.7-1.05c.16-.38.59-.56.97-.4h.03c.38.17.56.61.4.99-.12.29-.4.46-.69.46h-.01Zm4.69-4.7c-.29 0-.57-.17-.69-.45-.16-.38 0-.84.38-1 .38-.17.82 0 .98.38v.03a.739.739 0 0 1-.68 1.05l.01-.01Zm6.64-.03c-.09 0-.18-.02-.27-.05-.38-.16-.57-.57-.41-.95l.02-.06c.16-.38.6-.56.98-.4.38.16.56.6.4.98-.12.29-.42.48-.72.48ZM16.99 21.604h-.05c-2.42-.22-4.42-2.03-4.87-4.4a.75.75 0 0 1 .6-.88c.4-.07.8.19.88.6a3.95 3.95 0 0 0 2.03 2.74c-.44-1.42-.24-3.02.63-4.31a4.992 4.992 0 0 1 3.78-2.16c-.89-.76-2.1-1.11-3.3-.88-.4.07-.8-.19-.88-.6a.75.75 0 0 1 .6-.88c2.37-.45 4.79.74 5.88 2.9.14.27.09.63-.11.86-.2.23-.55.33-.84.23-1.43-.44-3.03.12-3.89 1.38-.86 1.26-.79 2.96.16 4.13.19.23.22.59.08.86-.13.25-.42.41-.69.41h-.01ZM7.99 13.784c-.19 0-.38-.07-.53-.22a4.762 4.762 0 0 1 0-6.72 4.762 4.762 0 0 1 6.72 0c.29.29.29.77 0 1.06-.29.29-.77.29-1.06 0a3.253 3.253 0 0 0-4.6 4.6c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22Z"
                      />
                  </svg>
              </div>
              <div class="radio__card__label">
                  <h3 class="text-preset-4">System</h3>
                  <p class="text-preset-6">
                      Adapts to your device's theme
                  </p>
              </div>
              <input type="radio" name="color-theme" value="system" />
          </label>
          <button id="color-theme-submit-button" type="submit" class="btn btn__default settings__apply__button">
              Apply Changes
          </button>
      </form>
  </div>
`;

const fontThemeTemplate = `
  <div class="settings__group">
      <h2 class="settings__group__title text-preset-3">
          Font Theme
      </h2>
      <p class="settings__group__description text-preset-5">
          Choose your font theme:
      </p>
      <form class="settings__group__form">
          <label class="radio__card">
              <div class="radio__card__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M4.808 17.55H3L7.062 6.263H9.03l4.063 11.289h-1.808L8.093 8.312h-.088l-3.197 9.239Zm.303-4.42h5.865v1.433H5.111V13.13ZM16.822 17.738c-.537 0-1.022-.1-1.455-.297a2.452 2.452 0 0 1-1.031-.877c-.25-.382-.375-.85-.375-1.405 0-.478.092-.872.276-1.18.183-.309.431-.553.744-.733a3.89 3.89 0 0 1 1.047-.408c.386-.092.78-.162 1.18-.21l1.234-.143c.316-.04.546-.105.69-.193.143-.088.214-.231.214-.43v-.038c0-.482-.136-.855-.407-1.12-.269-.264-.67-.396-1.202-.396-.555 0-.992.123-1.312.37-.316.242-.535.512-.656.81l-1.549-.353c.184-.515.452-.93.805-1.246.356-.32.766-.551 1.229-.695a4.8 4.8 0 0 1 1.46-.22c.339 0 .697.04 1.076.121.382.077.738.22 1.069.43.334.21.608.509.821.899.213.385.32.887.32 1.504v5.623h-1.61v-1.158h-.066a2.346 2.346 0 0 1-.48.629 2.548 2.548 0 0 1-.82.512c-.335.136-.736.204-1.202.204Zm.358-1.323c.456 0 .845-.09 1.169-.27a1.89 1.89 0 0 0 .744-.705 1.83 1.83 0 0 0 .259-.943v-1.091c-.059.058-.173.114-.342.165-.165.048-.355.09-.568.127-.213.033-.42.064-.622.093-.203.026-.372.048-.508.067-.32.04-.611.108-.876.204-.261.095-.47.233-.629.413-.154.176-.231.412-.231.706 0 .407.15.716.452.926.301.205.685.308 1.152.308Z"
                  />
                </svg>
              </div>
              <div class="radio__card__label">
                  <h3 class="text-preset-4">Sans serif</h3>
                  <p class="text-preset-6">
                      Clean and modern, easy to read.
                  </p>
              </div>
              <input type="radio" name="font-theme" value="sans" />
          </label>
          <label class="radio__card">
              <div class="radio__card__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m8.501 6.317 3.858 9.928c.147.39.316.653.506.79.2.137.384.21.553.221v.317a11.037 11.037 0 0 0-.901-.032c-.337-.01-.68-.016-1.028-.016-.442 0-.853.006-1.233.016-.38 0-.685.01-.917.032v-.317c.538-.02.875-.11 1.012-.268.148-.169.116-.522-.095-1.06L7.411 8.245l.253-.284-2.625 6.86c-.19.475-.305.87-.347 1.187-.032.316-.006.563.079.743.094.179.253.305.474.379.221.074.495.116.822.126v.317a14.481 14.481 0 0 0-.964-.032 27.21 27.21 0 0 0-.902-.016c-.252 0-.48.006-.68.016-.189 0-.363.01-.521.032v-.317c.221-.052.443-.184.664-.395.221-.21.432-.569.632-1.075l3.668-9.47h.537Zm1.66 6.703v.316h-4.71l.157-.316h4.553ZM15.72 17.683c-.443 0-.822-.084-1.138-.253a1.679 1.679 0 0 1-.712-.695 2.11 2.11 0 0 1-.237-1.012c0-.464.106-.838.316-1.122.211-.296.48-.533.806-.712.338-.179.69-.327 1.06-.442.38-.127.732-.243 1.059-.348.337-.116.611-.248.822-.396.221-.147.332-.342.332-.584v-1.075c0-.38-.063-.68-.19-.902a1.006 1.006 0 0 0-.49-.49 1.689 1.689 0 0 0-.727-.142c-.242 0-.5.037-.775.11-.274.064-.49.196-.648.396.232.063.422.19.57.38a.99.99 0 0 1 .236.68c0 .294-.1.526-.3.695-.19.168-.432.253-.727.253-.327 0-.57-.1-.727-.3a1.18 1.18 0 0 1-.238-.728c0-.284.069-.516.206-.696.148-.179.337-.347.57-.505.252-.169.573-.311.963-.427.4-.116.844-.174 1.328-.174.454 0 .843.053 1.17.158.338.095.617.253.838.474.264.243.438.548.522.917.084.358.126.796.126 1.312v4.364c0 .263.032.453.095.569.074.105.19.158.348.158a.61.61 0 0 0 .3-.08 2.32 2.32 0 0 0 .364-.236l.158.268c-.221.18-.448.322-.68.427-.221.106-.506.158-.854.158-.337 0-.61-.052-.822-.158a1.052 1.052 0 0 1-.474-.458 1.73 1.73 0 0 1-.142-.743c-.274.442-.6.78-.98 1.011-.38.232-.822.348-1.328.348Zm.759-.759c.295 0 .569-.084.822-.252.263-.17.506-.422.727-.76v-3.145a1.502 1.502 0 0 1-.506.442c-.221.116-.458.238-.711.364a5.162 5.162 0 0 0-.728.443 1.956 1.956 0 0 0-.553.616c-.147.253-.221.575-.221.965 0 .41.105.737.316.98.21.231.495.347.854.347Z"/></svg>
              </div>
              <div class="radio__card__label">
                  <h3 class="text-preset-4">Serif</h3>
                  <p class="text-preset-6">
                    Classic and elegant for a timeless feel.
                  </p>
              </div>
              <input type="radio" name="font-theme" value="serif" />
          </label>
          <label class="radio__card">
              <div class="radio__card__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m3 17.365 3.605-10.93H8.54l3.604 10.93h-1.769l-1.769-5.957-.534-1.803-.5-1.835h-.067a56.224 56.224 0 0 1-.5 1.835c-.168.601-.34 1.202-.518 1.803l-1.786 5.957H3Zm2.02-3.137v-1.319h5.072v1.319H5.02ZM16.344 17.566c-.523 0-.996-.095-1.418-.284-.412-.2-.74-.473-.985-.818-.234-.356-.35-.773-.35-1.251 0-.913.445-1.608 1.335-2.086.9-.479 2.375-.796 4.422-.952a2.116 2.116 0 0 0-.234-.918 1.418 1.418 0 0 0-.65-.65c-.29-.167-.674-.25-1.152-.25-.334 0-.662.044-.985.133-.322.078-.634.189-.934.333-.3.145-.584.295-.851.451l-.618-1.118c.3-.178.646-.356 1.035-.534.39-.19.807-.34 1.252-.45a5.825 5.825 0 0 1 1.385-.168c.756 0 1.385.14 1.886.418.5.278.878.673 1.134 1.184.256.512.384 1.13.384 1.853v4.906h-1.352l-.133-1.051h-.05a7.91 7.91 0 0 1-1.469.884 3.999 3.999 0 0 1-1.652.367Zm.467-1.319a3.12 3.12 0 0 0 1.285-.284c.423-.189.84-.456 1.252-.8v-1.936c-1.068.078-1.908.2-2.52.367-.6.167-1.023.378-1.268.634a1.186 1.186 0 0 0-.367.868c0 .267.072.49.217.667.155.167.356.29.6.367.245.078.512.117.801.117Z"/></svg>
              </div>
              <div class="radio__card__label">
                  <h3 class="text-preset-4">Monospace</h3>
                  <p class="text-preset-6">
                    Code-like, for a great technical vibe.
                  </p>
              </div>
              <input type="radio" name="font-theme" value="mono" />
          </label>
          <button id="font-theme-submit-button" type="submit" class="btn btn__default settings__apply__button">
              Apply Changes
          </button>
      </form>
  </div>
`;

const changePasswordTemplate = `
  <div class="settings__group">
      <h2 class="settings__group__title text-preset-3">
          Change Password
      </h2>
      <p class="settings__group__description text-preset-5">
          Update your password to keep your account secure.
      </p>
      <form id="change-password-form" class="settings__group__form">
          <div class="form__group">
              <label for="old-password" class="form__group__label">
                  Old Password
              </label>
              <div class="form__group__input">
                  <input
                      class="text-preset-5"
                      type="password"
                      id="old-password"
                      name="old-password"
                      required
                  />
                  <button class="btn showpassword__button" type="button" aria-label="Show old password">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                          <path fill-rule="evenodd" d="M12.003 10.115c-1.332 0-2.412 1.036-2.412 2.315s1.08 2.316 2.412 2.316c1.332 0 2.412-1.037 2.412-2.316 0-1.28-1.08-2.315-2.412-2.315ZM8.09 12.43c0-2.075 1.752-3.755 3.912-3.755s3.912 1.68 3.912 3.755c0 2.074-1.752 3.756-3.912 3.756S8.09 14.504 8.09 12.43Z" clip-rule="evenodd"/>
                          <path fill-rule="evenodd" d="M4.976 7.195A11.248 11.248 0 0 1 12.002 4.7a11.25 11.25 0 0 1 7.026 2.493c1.775 1.44 2.976 3.377 2.976 5.237 0 1.86-1.2 3.797-2.976 5.237a11.249 11.249 0 0 1-7.026 2.493 11.248 11.248 0 0 1-7.026-2.494C3.2 16.226 2 14.289 2 12.43s1.2-3.795 2.976-5.235Zm.968 1.1C4.37 9.571 3.5 11.14 3.5 12.43c0 1.29.87 2.859 2.444 4.136a9.71 9.71 0 0 0 6.058 2.154 9.712 9.712 0 0 0 6.058-2.153c1.574-1.277 2.444-2.846 2.444-4.137 0-1.291-.87-2.86-2.444-4.137a9.712 9.712 0 0 0-6.058-2.153 9.71 9.71 0 0 0-6.058 2.154Z" clip-rule="evenodd"/>
                      </svg>
                  </button>
              </div>
          </div>

          <div class="form__group">
              <label for="new-password" class="form__group__label">
                  New Password
              </label>
              <div class="form__group__input">
                  <input
                      class="text-preset-5"
                      type="password"
                      id="new-password"
                      name="new-password"
                      required
                  />
                  <button class="btn showpassword__button" type="button" aria-label="Show new password">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                          <path fill-rule="evenodd" d="M12.003 10.115c-1.332 0-2.412 1.036-2.412 2.315s1.08 2.316 2.412 2.316c1.332 0 2.412-1.037 2.412-2.316 0-1.28-1.08-2.315-2.412-2.315ZM8.09 12.43c0-2.075 1.752-3.755 3.912-3.755s3.912 1.68 3.912 3.755c0 2.074-1.752 3.756-3.912 3.756S8.09 14.504 8.09 12.43Z" clip-rule="evenodd"/>
                          <path fill-rule="evenodd" d="M4.976 7.195A11.248 11.248 0 0 1 12.002 4.7a11.25 11.25 0 0 1 7.026 2.493c1.775 1.44 2.976 3.377 2.976 5.237 0 1.86-1.2 3.797-2.976 5.237a11.249 11.249 0 0 1-7.026 2.493 11.248 11.248 0 0 1-7.026-2.494C3.2 16.226 2 14.289 2 12.43s1.2-3.795 2.976-5.235Zm.968 1.1C4.37 9.571 3.5 11.14 3.5 12.43c0 1.29.87 2.859 2.444 4.136a9.71 9.71 0 0 0 6.058 2.154 9.712 9.712 0 0 0 6.058-2.153c1.574-1.277 2.444-2.846 2.444-4.137 0-1.291-.87-2.86-2.444-4.137a9.712 9.712 0 0 0-6.058-2.153 9.71 9.71 0 0 0-6.058 2.154Z" clip-rule="evenodd"/>
                      </svg>
                  </button>
              </div>
              <span class="form__group__subscript">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0ZM12.006 15.693v-4.3M12 8.355v-.063"/>
                  </svg>
                  At least 8 characters
              </span>
          </div>
          <div class="form__group">
              <label for="confirm-new-password" class="form__group__label">
                  Confirm New Password
              </label>
              <div class="form__group__input">
                  <input
                      class="text-preset-5"
                      type="password"
                      id="confirm-new-password"
                      name="confirm-new-password"
                      required
                  />
                  <button class="btn showpassword__button" type="button" aria-label="Show confirmation password">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                          <path fill-rule="evenodd" d="M12.003 10.115c-1.332 0-2.412 1.036-2.412 2.315s1.08 2.316 2.412 2.316c1.332 0 2.412-1.037 2.412-2.316 0-1.28-1.08-2.315-2.412-2.315ZM8.09 12.43c0-2.075 1.752-3.755 3.912-3.755s3.912 1.68 3.912 3.755c0 2.074-1.752 3.756-3.912 3.756S8.09 14.504 8.09 12.43Z" clip-rule="evenodd"/>
                          <path fill-rule="evenodd" d="M4.976 7.195A11.248 11.248 0 0 1 12.002 4.7a11.25 11.25 0 0 1 7.026 2.493c1.775 1.44 2.976 3.377 2.976 5.237 0 1.86-1.2 3.797-2.976 5.237a11.249 11.249 0 0 1-7.026 2.493 11.248 11.248 0 0 1-7.026-2.494C3.2 16.226 2 14.289 2 12.43s1.2-3.795 2.976-5.235Zm.968 1.1C4.37 9.571 3.5 11.14 3.5 12.43c0 1.29.87 2.859 2.444 4.136a9.71 9.71 0 0 0 6.058 2.154 9.712 9.712 0 0 0 6.058-2.153c1.574-1.277 2.444-2.846 2.444-4.137 0-1.291-.87-2.86-2.444-4.137a9.712 9.712 0 0 0-6.058-2.153 9.71 9.71 0 0 0-6.058 2.154Z" clip-rule="evenodd"/>
                      </svg>
                  </button>
              </div>
          </div>

          <button id="change-password-submit-button" type="submit" class="btn btn__default settings__apply__button">
              Save Password
          </button>
      </form>
  </div>
`;

let currentTab = "color-theme";

function renderContent() {
  switch (currentTab) {
    case "font-theme":
      sidebar.innerHTML = fontThemeTemplate;
      const savedFont = localStorage.getItem("font") ?? "sans";
      let savedEl = document.querySelector(
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
        changeForm.addEventListener("submit", (e) => {
          e.preventDefault();
          // TODO: implement change password logic
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

document
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
