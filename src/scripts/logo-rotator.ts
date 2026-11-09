/**
 * Rotating client logos ([data-logo-rotator], see ClientLogos.astro).
 *
 * A change starts every ROTATE_MS: one slot fades its logo out and fades in the
 * next logo from a queue of logos not on screen; the logo that left goes to the
 * back of the queue, so no logo is ever shown twice.
 *
 * Slots change in rounds: each round visits every slot once in a shuffled order
 * (pure random picks made some slots change 2–3 times while others stayed put),
 * and a round never starts with the slot that ended the previous one.
 *
 * Pauses while the band is off-screen, the tab is hidden or the pointer is over
 * it. Does nothing with prefers-reduced-motion or when there's nothing to rotate.
 */

const ROTATE_MS = 2000; // from the start of one change to the start of the next
const FADE_MS = 800; // each way; matches duration-800 on the images

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Fisher–Yates shuffle (new array). */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function initRotator(root: HTMLElement) {
  const slots = [...root.querySelectorAll<HTMLElement>('[data-logo-slot]')];
  const pool = root.querySelector<HTMLTemplateElement>('template[data-logo-pool]');
  // Template images live in an inert document: imported only when they rotate in.
  const queue: HTMLImageElement[] = pool ? [...pool.content.querySelectorAll('img')] : [];
  if (slots.length === 0 || queue.length === 0) return;

  let onScreen = false;
  let hovered = false;
  let timer: number | undefined;
  const fading = new Set<HTMLElement>();

  let round: HTMLElement[] = [];
  let lastSlot: HTMLElement | undefined;
  function nextSlot(): HTMLElement {
    if (round.length === 0) {
      round = shuffle(slots);
      // Don't change the same slot twice in a row across rounds.
      if (round.length > 1 && round[0] === lastSlot) round.push(round.shift()!);
    }
    lastSlot = round.shift()!;
    return lastSlot;
  }

  const canRun = () => onScreen && !hovered && !document.hidden && !reducedMotion.matches;

  function schedule() {
    clearTimeout(timer);
    if (canRun()) timer = window.setTimeout(swap, ROTATE_MS);
  }

  async function swap() {
    schedule(); // the next change counts from the start of this one
    const slot = nextSlot();
    // Can't happen with the current timings (a change takes 2 × FADE_MS < ROTATE_MS); skip a beat if it does.
    if (fading.has(slot) || queue.length === 0) return;
    fading.add(slot);
    const current = slot.querySelector('img');
    let next = queue.shift()!;
    if (next.ownerDocument !== document) next = document.importNode(next, true);
    next.style.opacity = '0';

    // Load the incoming logo while the current one fades out.
    const ready = next.decode().catch(() => {});
    if (current) current.style.opacity = '0';
    await Promise.all([ready, wait(FADE_MS)]);

    if (current) {
      current.replaceWith(next);
      current.style.opacity = '';
      queue.push(current);
    } else {
      slot.append(next);
    }
    next.getBoundingClientRect(); // commit opacity 0 before fading in
    next.style.opacity = '';
    await wait(FADE_MS);

    fading.delete(slot);
  }

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    schedule();
  }).observe(root);

  root.addEventListener('pointerenter', () => {
    hovered = true;
    clearTimeout(timer);
  });
  root.addEventListener('pointerleave', () => {
    hovered = false;
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', schedule);
}

for (const root of document.querySelectorAll<HTMLElement>('[data-logo-rotator]')) initRotator(root);
