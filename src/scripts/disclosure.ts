/**
 * Accessible disclosure (show/hide) behavior for navigation.
 *
 * Markup contract:
 *   <button data-disclosure aria-expanded="false" aria-controls="panel-id">…</button>
 *   <div id="panel-id" hidden>…</div>
 *
 * - Opening one disclosure closes the others in the same `data-disclosure-group`.
 * - Escape closes the open disclosure and returns focus to its button.
 * - Clicking outside an open disclosure (button + panel) closes it.
 */

const SELECTOR = 'button[data-disclosure]';

function panelOf(button: HTMLButtonElement): HTMLElement | null {
  const id = button.getAttribute('aria-controls');
  return id ? document.getElementById(id) : null;
}

function isOpen(button: HTMLButtonElement) {
  return button.getAttribute('aria-expanded') === 'true';
}

function setOpen(button: HTMLButtonElement, open: boolean) {
  const panel = panelOf(button);
  if (!panel) return;
  button.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
}

function openButtons(): HTMLButtonElement[] {
  return [...document.querySelectorAll<HTMLButtonElement>(SELECTOR)].filter(isOpen);
}

document.addEventListener('click', (event) => {
  const target = event.target as Element;
  const button = target.closest<HTMLButtonElement>(SELECTOR);

  if (button) {
    const willOpen = !isOpen(button);
    if (willOpen) {
      const group = button.dataset.disclosureGroup;
      for (const other of openButtons()) {
        if (other !== button && group && other.dataset.disclosureGroup === group) setOpen(other, false);
      }
    }
    setOpen(button, willOpen);
    return;
  }

  // Click outside: close disclosures whose button and panel don't contain the target.
  for (const open of openButtons()) {
    const panel = panelOf(open);
    if (!panel?.contains(target)) setOpen(open, false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const open = openButtons();
  // Close the innermost (last opened in DOM order) first.
  const last = open.at(-1);
  if (last) {
    setOpen(last, false);
    last.focus();
  }
});
