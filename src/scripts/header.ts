/**
 * Header behavior — same as production (wordpress/reference/production-header/vilax-header/assets/js/header.js).
 *
 * Desktop dropdowns / mega menu ([data-nav-item] = li with button[data-nav-toggle] + panel):
 *   - open on hover (mouse/trackpad only, 200ms delay to close) or click
 *   - close on Escape (focus back to the button), click outside or focus leaving
 *   - mega menu tabs: switch on click, hover or ArrowUp/ArrowDown
 * Mobile panel ([data-drawer]):
 *   - burger opens it on the main level and locks page scroll
 *   - buttons with data-target open a level; "Volver" goes back one level
 *   - closes with the X, Escape, click outside, or when resizing to desktop
 */

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const desktop = window.matchMedia('(min-width: 64.0625rem)');

// ---------- Desktop dropdowns and mega menu ----------

type NavItem = { li: HTMLElement; toggle: HTMLButtonElement; panel: HTMLElement; timer?: number };

const navItems: NavItem[] = [];
for (const li of document.querySelectorAll<HTMLElement>('[data-nav-item]')) {
  const toggle = li.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panel = toggle && document.getElementById(toggle.getAttribute('aria-controls') ?? '');
  if (toggle && panel) navItems.push({ li, toggle, panel });
}

function openNav(item: NavItem) {
  clearTimeout(item.timer);
  for (const other of navItems) if (other !== item) closeNav(other);
  if (!item.panel.hidden) return;
  item.panel.hidden = false;
  item.toggle.setAttribute('aria-expanded', 'true');
}

function closeNav(item: NavItem) {
  clearTimeout(item.timer);
  item.panel.hidden = true;
  item.toggle.setAttribute('aria-expanded', 'false');
}

for (const item of navItems) {
  const { li, toggle, panel } = item;

  toggle.addEventListener('click', () => (panel.hidden ? openNav(item) : closeNav(item)));
  li.addEventListener('mouseenter', () => {
    if (finePointer.matches) openNav(item);
  });
  li.addEventListener('mouseleave', () => {
    if (finePointer.matches) item.timer = window.setTimeout(() => closeNav(item), 200);
  });
  li.addEventListener('focusout', (event) => {
    if (!li.contains(event.relatedTarget as Node | null)) closeNav(item);
  });

  // Mega menu tabs
  const tabs = [...panel.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const select = (tab: HTMLButtonElement) => {
    for (const other of tabs) {
      const on = other === tab;
      other.setAttribute('aria-selected', String(on));
      other.tabIndex = on ? 0 : -1;
      const tabPanel = document.getElementById(other.getAttribute('aria-controls') ?? '');
      if (tabPanel) tabPanel.hidden = !on;
    }
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('mouseenter', () => {
      if (finePointer.matches) select(tab);
    });
    tab.addEventListener('keydown', (event) => {
      const next =
        event.key === 'ArrowDown' ? tabs[(i + 1) % tabs.length] : event.key === 'ArrowUp' ? tabs.at(i - 1) : undefined;
      if (next) {
        event.preventDefault();
        select(next);
        next.focus();
      }
    });
  });
}

// ---------- Mobile panel ----------

const burger = document.querySelector<HTMLButtonElement>('[data-drawer-open]');
const drawer = document.querySelector<HTMLElement>('[data-drawer]');
const back = drawer?.querySelector<HTMLButtonElement>('[data-drawer-back]');
const closeButton = drawer?.querySelector<HTMLButtonElement>('[data-drawer-close]');
let stack = ['main'];

function showPanel(key: string) {
  if (!drawer) return;
  for (const panel of drawer.querySelectorAll<HTMLElement>('[data-panel]')) {
    panel.hidden = panel.dataset.panel !== key;
  }
  if (back) back.hidden = stack.length < 2;
}

function openDrawer() {
  if (!drawer || !burger) return;
  stack = ['main'];
  showPanel('main');
  drawer.hidden = false;
  burger.setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('overflow-hidden');
  drawer.focus({ preventScroll: true });
}

function closeDrawer({ restoreFocus = false } = {}) {
  if (!drawer || !burger || drawer.hidden) return;
  drawer.hidden = true;
  burger.setAttribute('aria-expanded', 'false');
  document.documentElement.classList.remove('overflow-hidden');
  if (restoreFocus) burger.focus({ preventScroll: true });
}

if (burger && drawer) {
  burger.addEventListener('click', () => (drawer.hidden ? openDrawer() : closeDrawer()));
  closeButton?.addEventListener('click', () => closeDrawer({ restoreFocus: true }));
  back?.addEventListener('click', () => {
    if (stack.length > 1) {
      stack.pop();
      showPanel(stack[stack.length - 1]);
    }
  });
  drawer.addEventListener('click', (event) => {
    const target = (event.target as Element).closest<HTMLElement>('[data-target]');
    if (target?.dataset.target) {
      stack.push(target.dataset.target);
      showPanel(target.dataset.target);
    }
  });
  desktop.addEventListener('change', (event) => {
    if (event.matches) closeDrawer();
  });
}

// ---------- Shared: Escape and click outside ----------

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  for (const item of navItems) {
    if (!item.panel.hidden) {
      closeNav(item);
      item.toggle.focus();
    }
  }
  closeDrawer({ restoreFocus: true });
});

document.addEventListener('click', (event) => {
  const target = event.target as Node;
  for (const item of navItems) {
    if (!item.panel.hidden && !item.li.contains(target)) closeNav(item);
  }
  if (drawer && burger && !drawer.hidden && !drawer.contains(target) && !burger.contains(target)) closeDrawer();
});
