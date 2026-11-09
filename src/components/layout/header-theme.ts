/**
 * Header color modes, as in production: dark by default, light on blog,
 * cases, archives, authors and 404. Only design tokens.
 *
 *            dark                      light
 * surface    bg-inverse / text-inverse bg / text
 * muted      text-subtle (#848484)     text-subtle (#848484)
 * hover      text-subtle (#848484)     text-muted (#5a5a5a)
 * border     bg-inverse-alt (#2c2c2c)  border (#d7d7d7)
 * Text colors follow the Figma Header / NavLink components (dark text = text-inverse).
 */
export type HeaderSurface = 'light' | 'dark';

export type HeaderTheme = {
  surface: string;
  border: string;
  /** Hover / "open" color of nav links and buttons. */
  hoverMuted: string;
  /** Muted items (tabs, mega links) that turn to the main color on hover. */
  hoverFg: string;
  selectedFg: string;
  currentFg: string;
};

export function headerTheme(surface: HeaderSurface): HeaderTheme {
  return surface === 'dark'
    ? {
        surface: 'bg-bg-inverse text-text-inverse',
        // Production uses rgba(196,196,196,.2) on #040404 ≈ #2a2a2a.
        border: 'border-bg-inverse-alt',
        hoverMuted: 'hover:text-text-subtle aria-expanded:text-text-subtle',
        hoverFg: 'hover:text-text-inverse',
        selectedFg: 'aria-selected:text-text-inverse',
        currentFg: 'aria-[current=page]:text-text-inverse',
      }
    : {
        surface: 'bg-bg text-text',
        border: 'border-border',
        hoverMuted: 'hover:text-text-muted aria-expanded:text-text-muted',
        hoverFg: 'hover:text-text',
        selectedFg: 'aria-selected:text-text',
        currentFg: 'aria-[current=page]:text-text',
      };
}
