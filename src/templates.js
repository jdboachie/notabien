/**
 * Builds an editor based on the input.
 * @param {string} title
 * @param {string} content
 * @param {string[]} tags
 * @param {number} lastEdited
 * @param {boolean} isArchived
 * @returns {string} editorTemplate
 */
export function createEditorTemplate(
  title,
  content,
  tags,
  lastEdited,
  isArchived,
) {
  return `
  <form class="editor" id="editor">
    <input
        id="editor-title"
        name="title"
        class="editor__title text-preset-1"
        placeholder="Enter a title..."
        ${title ? `value="${title}"` : ""}
    />
      <div class="editor__metadata">
          <div class="metadata__field">
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
                      stroke-width="1.8"
                      d="M3.016 5.966c.003-1.411 1.07-2.677 2.456-2.916.284-.05 3.616-.042 4.995-.041 1.364 0 2.527.491 3.49 1.452 2.045 2.042 4.088 4.085 6.128 6.13 1.208 1.21 1.224 3.066.022 4.28a805.496 805.496 0 0 1-5.229 5.228c-1.212 1.201-3.069 1.186-4.279-.022-2.064-2.058-4.127-4.115-6.182-6.182-.795-.8-1.264-1.766-1.368-2.895-.084-.903-.035-4.26-.033-5.034Z"
                      clip-rule="evenodd"
                  />
                  <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.8"
                      d="M9.907 8.315a1.607 1.607 0 0 1-1.61 1.583c-.872-.002-1.599-.73-1.594-1.596a1.604 1.604 0 0 1 1.633-1.607c.864.003 1.575.736 1.571 1.62Z"
                      clip-rule="evenodd"
                  />
              </svg>
              <p class="metadata__field__label text-preset-5">Tags</p>
              <input
                name="tags"
                class="metadata__field__value tag__input"
                ${tags ? `value="${tags.join(", ")}"` : ""}
                placeholder="Add tags separated by commas (e.g. Work, Planning)"
               />
          </div>
          ${
            isArchived
              ? `
          <div class="metadata__field">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.65775 6.3478C5.92811 6.07743 6.36646 6.07742 6.63682 6.34778L7.51281 7.22375C7.78317 7.49411 7.78318 7.93245 7.51282 8.20282C7.24246 8.47319 6.80412 8.47319 6.53375 8.20283L5.65777 7.32687C5.3874 7.05651 5.38739 6.61816 5.65775 6.3478ZM7.51267 15.794C7.78312 16.0643 7.78324 16.5026 7.51295 16.7731L5.92417 18.3627C5.65388 18.6332 5.21553 18.6333 4.9451 18.363C4.67466 18.0927 4.67454 17.6545 4.94482 17.384L6.5336 15.7943C6.80389 15.5238 7.24224 15.5237 7.51267 15.794ZM15.1052 15.794C15.3756 15.5237 15.8139 15.5238 16.0842 15.7943L17.673 17.384C17.9433 17.6545 17.9432 18.0927 17.6727 18.363C17.4023 18.6333 16.964 18.6332 16.6937 18.3627L15.1049 16.7731C14.8346 16.5026 14.8347 16.0643 15.1052 15.794Z" fill="currentColor"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.308 4.5835C11.6904 4.5835 12.0003 4.89346 12.0003 5.2758V5.93838C12.0003 6.32073 11.6904 6.63069 11.308 6.63069C10.9257 6.63069 10.6157 6.32073 10.6157 5.93838V5.2758C10.6157 4.89346 10.9257 4.5835 11.308 4.5835ZM2.82373 11.9989C2.82373 11.6166 3.13369 11.3066 3.51604 11.3066H5.24746C5.62981 11.3066 5.93977 11.6166 5.93977 11.9989C5.93977 12.3812 5.62981 12.6912 5.24746 12.6912H3.51604C3.13369 12.6912 2.82373 12.3812 2.82373 11.9989ZM16.6764 11.9989C16.6764 11.6166 16.9862 11.3066 17.3687 11.3066H19.6157C19.998 11.3066 20.308 11.6166 20.308 11.9989C20.308 12.3812 19.998 12.6912 19.6157 12.6912H17.3687C16.9862 12.6912 16.6764 12.3812 16.6764 11.9989ZM11.308 17.3672C11.6904 17.3672 12.0003 17.6772 12.0003 18.0596V20.3067C12.0003 20.689 11.6904 20.999 11.308 20.999C10.9257 20.999 10.6157 20.689 10.6157 20.3067V18.0596C10.6157 17.6772 10.9257 17.3672 11.308 17.3672Z" fill="currentColor"/>
              </svg>
              <p class="metadata__field__label text-preset-5">Status</p>
              <p class="metadata__field__value text-preset-6">Archived</p>
          </div>
          `
              : ""
          }
          <div class="metadata__field">
              <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                  <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.2505 3.75C7.69378 3.75 4.00049 7.44329 4.00049 12C4.00049 16.5558 7.69384 20.25 12.2505 20.25C16.8072 20.25 20.5005 16.5558 20.5005 12C20.5005 7.44329 16.8072 3.75 12.2505 3.75ZM2.50049 12C2.50049 6.61487 6.86536 2.25 12.2505 2.25C17.6356 2.25 22.0005 6.61487 22.0005 12C22.0005 17.3841 17.6357 21.75 12.2505 21.75C6.8653 21.75 2.50049 17.3841 2.50049 12Z"
                      fill="currentColor"
                  />
                  <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.9224 7.82666C12.3366 7.82666 12.6724 8.16245 12.6724 8.57666V12.2493L15.4819 13.9283C15.8375 14.1408 15.9535 14.6013 15.741 14.9569C15.5285 15.3124 15.068 15.4284 14.7124 15.2159L11.5376 13.3186C11.3111 13.1832 11.1724 12.9388 11.1724 12.6748V8.57666C11.1724 8.16245 11.5082 7.82666 11.9224 7.82666Z"
                      fill="currentColor"
                  />
              </svg>
              <p class="metadata__field__label text-preset-5">
                Last Edited
              </p>
              <p class="metadata__field__value text-preset-6">
                ${lastEdited ? new Date(lastEdited).toDateString() : "not yet saved"}
              </p>
          </div>
      </div>
      <div class="separator-full"></div>
      <textarea
          name="content"
          class="editor__textarea text-preset-5"
          placeholder="Start typing your note here..."
      >${content ?? ""}</textarea>
    <div class="bottombar">
        <button type="submit" id="save-note-button" class="btn btn__default">Save Note</button>
        <button type="reset" id="cancel-button" class="btn btn__secondary">Cancel</button>
    </div>
  </form>
  ${
    title
      ? `<aside class="sidebar right__sidebar">
      <button class="btn sidebar__button__outline" id="archive-note-trigger">
          ${
            isArchived
              ? `<svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M3.708 7.404a.75.75 0 0 1 .983.398l1.316 3.114L9.1 9.608a.75.75 0 0 1 .584 1.382L5.9 12.59a.75.75 0 0 1-.983-.4L3.309 8.387a.75.75 0 0 1 .4-.982Z" clip-rule="evenodd"
                    />
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M12.915 5.664c-3.447 0-6.249 2.746-6.335 6.16a.75.75 0 0 1-1.5-.038c.108-4.228 3.575-7.622 7.835-7.622a7.838 7.838 0 0 1 7.835 7.835 7.833 7.833 0 0 1-7.835 7.835 7.843 7.843 0 0 1-6.457-3.384.75.75 0 1 1 1.232-.856 6.343 6.343 0 0 0 5.225 2.74 6.333 6.333 0 0 0 6.335-6.335 6.339 6.339 0 0 0-6.335-6.335Z"
                      clip-rule="evenodd"
                    />
                  </svg>`
              : `<svg
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
                  d="M21 7.782v8.435C21 19.165 18.919 21 15.974 21H8.026C5.081 21 3 19.165 3 16.216V7.782C3 4.834 5.081 3 8.026 3h7.948C18.919 3 21 4.843 21 7.782Z"
              />
              <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="m15 14-3.002 3L9 14M11.998 17v-7M20.934 7H3.059"
              />
          </svg>`
          }
          ${isArchived ? "Restore Note" : "Archive Note"}
      </button>
      <button class="btn sidebar__button__outline" id="delete-note-trigger">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              fill="none"
              viewBox="0 0 24 25"
          >
              <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="m14.852 3.879.818 1.785h2.64c.811 0 1.47.658 1.47 1.47V8.22c0 .555-.45 1.005-1.006 1.005H5.005C4.45 9.226 4 8.776 4 8.221V7.133c0-.811.658-1.47 1.47-1.47h2.639l.818-1.784c.246-.536.78-.879 1.37-.879h3.185c.59 0 1.125.343 1.37.879ZM18.24 9.3v8.686c0 1.665-1.333 3.014-2.977 3.014H8.517c-1.644 0-2.977-1.349-2.977-3.014V9.301M10.2 12.816v4.509m3.38-4.509v4.509"
              />
          </svg>
          Delete Note
      </button>
  </aside>
  `
      : ``
  }
`;
}

export const archivedNotesEmptyState = `
  <div>
    <p style="margin-bottom: 16px;" class="text-muted text-preset-6">
      All your archived notes are stored here. You can restore or delete them anytime.
    </p>
    <p class="note__list__empty text-preset-5">
        No notes have been archived yet. Move notes here for safekeeping, or create a new note.
    </p>
  </di>
  `;

export const noteListEmptyStateTemplate = `
  <p class="note__list__empty text-preset-5">
      You don't have any notes yet. Start a new note to
      capture your thougts and ideas.
  </p>
  `;

export const archiveNoteModalTemplate = `
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-archive-title" aria-describedby="modal-archive-desc">
    <div class="modal__header">
      <div class="modal__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 7.782v8.435C21 19.165 18.919 21 15.974 21H8.026C5.081 21 3 19.165 3 16.216V7.782C3 4.834 5.081 3 8.026 3h7.948C18.919 3 21 4.843 21 7.782Z" />
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15 14-3.002 3L9 14M11.998 17v-7M20.934 7H3.059" />
        </svg>
      </div>
      <div class="modal__body">
        <h3 class="modal__title text-preset-3">Archive Note</h3>
        <p class="modal__description text-preset-5">
          Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.
        </p>
      </div>
    </div>
    <div class="modal__footer">
      <button id="cancel-archive-note-button" type="button" class="btn btn__secondary modal__button modal__button--cancel">Cancel</button>
      <button id="confirm-archive-note-button" type="button" class="btn btn__default modal__button modal__button--confirm">Archive Note</button>
    </div>
  </div>
`;

export const restoreNoteModalTemplate = `
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-archive-title" aria-describedby="modal-archive-desc">
    <div class="modal__header">
      <div class="modal__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M3.708 7.404a.75.75 0 0 1 .983.398l1.316 3.114L9.1 9.608a.75.75 0 0 1 .584 1.382L5.9 12.59a.75.75 0 0 1-.983-.4L3.309 8.387a.75.75 0 0 1 .4-.982Z" clip-rule="evenodd"
          />
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M12.915 5.664c-3.447 0-6.249 2.746-6.335 6.16a.75.75 0 0 1-1.5-.038c.108-4.228 3.575-7.622 7.835-7.622a7.838 7.838 0 0 1 7.835 7.835 7.833 7.833 0 0 1-7.835 7.835 7.843 7.843 0 0 1-6.457-3.384.75.75 0 1 1 1.232-.856 6.343 6.343 0 0 0 5.225 2.74 6.333 6.333 0 0 0 6.335-6.335 6.339 6.339 0 0 0-6.335-6.335Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="modal__body">
        <h3 class="modal__title text-preset-3">Restore Note</h3>
        <p class="modal__description text-preset-5">
          Are you sure you want to restore this note? You can find it in the All Notes section and archive it anytime.
        </p>
      </div>
    </div>
    <div class="modal__footer">
      <button id="cancel-archive-note-button" type="button" class="btn btn__secondary modal__button modal__button--cancel">Cancel</button>
      <button id="confirm-archive-note-button" type="button" class="btn btn__default modal__button modal__button--confirm">Restore Note</button>
    </div>
  </div>
`;

export const deleteNoteModalTemplate = `
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-delete-title" aria-describedby="modal-delete-desc">
    <div class="modal__header">
      <div class="modal__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="none" viewBox="0 0 24 25">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.852 3.879.818 1.785h2.64c.811 0 1.47.658 1.47 1.47V8.22c0 .555-.45 1.005-1.006 1.005H5.005C4.45 9.226 4 8.776 4 8.221V7.133c0-.811.658-1.47 1.47-1.47h2.639l.818-1.784c.246-.536.78-.879 1.37-.879h3.185c.59 0 1.125.343 1.37.879ZM18.24 9.3v8.686c0 1.665-1.333 3.014-2.977 3.014H8.517c-1.644 0-2.977-1.349-2.977-3.014V9.301M10.2 12.816v4.509m3.38-4.509v4.509" />
        </svg>
      </div>
      <div class="modal__body">
        <h3 class="modal__title text-preset-3">Delete Note</h3>
        <p class="modal__description text-preset-5">
          Are you sure you want to permanently delete this note? This action cannot be undone.
        </p>
      </div>
    </div>
    <div class="modal__footer">
      <button id="cancel-delete-note-button" type="button" class="btn btn__secondary modal__button modal__button--cancel">Cancel</button>
      <button id="confirm-delete-note-button" type="button" class="btn btn__danger modal__button modal__button--danger">Delete Note</button>
    </div>
  </div>
`;

/**
 * Builds a note list item template based on the input.
 * @param {string} title
 * @param {string[]} tags
 * @param {number} lastEdited
 * @returns {string} Note list item template
 */
export function createNoteListItemTemplate(title, tags, lastEdited) {
  return `
    <li class="note__list__item">
      <button class="note__list__inner">
        <h3 class="text-preset-3 list__item__title">${title}</h3>
        <ul class="note__tags__list">
          ${tags
            .map(
              (tag) => `
                <li class="note__tag text-preset-6">${tag}</li>
              `,
            )
            .join("")}
        </ul>
        <p class="text-preset-6">${new Date(lastEdited).toDateString()}</p>
      </button>
    </li>
  `;
}

/**
 * Creates and returns a full-width separator element used in layouts.
 *
 * @returns {HTMLDivElement} A div element with the "separator-full" class.
 */
export function separator() {
  const sep = document.createElement("div");
  sep.classList.add("separator-full");
  return sep;
}

export const fontThemeTemplate = `
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

export const colorThemeTemplate = `
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

export const changePasswordTemplate = `
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
