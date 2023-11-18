/** @param {HTMLElement} el */
export function enable(el) {
  el.toggleAttribute('disabled', false);
}
/** @param {HTMLElement} el */
export function disable(el) {
  el.toggleAttribute('disabled', true);
}

/**
 * @param {HTMLDivElement} div
 * @param {HTMLSpanElement} span
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 */
export function swapInnerSpanInput(div, span, input) {
  if (input.getAttribute('hidden') !== null) {
    resizeSpanInput(div, input);
    input.value = span.textContent ?? '';
    input.removeAttribute('hidden');
    input.focus();
    input.setSelectionRange(0, input.value.length);
  } else {
    span.textContent = input.value;
    input.toggleAttribute('hidden', true);
  }
}
/**
 * @param {HTMLDivElement} div
 * @param {HTMLElement} el
 */
export function resizeSpanInput(div, el) {
  const rect = div.getBoundingClientRect();
  el.style.left = rect.left + 'px';
  el.style.width = rect.width + 'px';
  el.style.height = rect.height + 'px';
}

/**
 * @param {string} data
 * @return {Promise<boolean>}
 */
export async function setClipboard(data) {
  if (window?.navigator?.clipboard) {
    try {
      await navigator.clipboard.writeText(data);
      return true;
    } catch (ignore) {}
  }
  return false;
}
/**
 * @return {Promise<string>}
 */
export async function getClipboard() {
  if (window?.navigator?.clipboard) {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (ignore) {}
  }
  return '';
}

//

/**
 * @param {string} str
 * @returns {HTMLButtonElement}
 */
export function $button(str) {
  const el = document.querySelector(str);
  if (el instanceof HTMLButtonElement) return el;
  throw `${str} not HTMLButtonElement.`;
}
/**
 * @param {string} str
 * @returns {HTMLDivElement}
 */
export function $div(str) {
  const el = document.querySelector(str);
  if (el instanceof HTMLDivElement) return el;
  throw `${str} not HTMLDivElement.`;
}
/**
 * @param {string} str
 * @returns {HTMLInputElement}
 */
export function $input(str) {
  const el = document.querySelector(str);
  if (el instanceof HTMLInputElement) return el;
  throw `${str} not HTMLInputElement.`;
}
/**
 * @param {string} str
 * @returns {HTMLSpanElement}
 */
export function $span(str) {
  const el = document.querySelector(str);
  if (el instanceof HTMLSpanElement) return el;
  throw `${str} not HTMLSpanElement.`;
}
/**
 * @param {string} str
 * @returns {HTMLTextAreaElement}
 */
export function $textarea(str) {
  const el = document.querySelector(str);
  if (el instanceof HTMLTextAreaElement) return el;
  throw `${str} not HTMLTextAreaElement.`;
}
