/**
 * Navigation menus for components. Menus are managed in WordPress
 * (Appearance → Menus, one per language via WPML) and loaded into the
 * `menus` collection at build time — components only use these helpers.
 */
import { getEntry } from 'astro:content';
import type { Locale } from '../i18n/config';
import type { MenuItem } from './wp/normalize';
import type { MenuLocation } from './wp/queries';

export type { MenuItem, MenuLocation };

export async function getMenu(location: MenuLocation, locale: Locale): Promise<MenuItem[]> {
  const entry = await getEntry('menus', `${location}/${locale}`);
  if (!entry) throw new Error(`Menu "${location}" not found for locale "${locale}".`);
  return entry.data.items as MenuItem[];
}

/** True when an item has a third level (e.g. Servicios → category → service): rendered as a mega menu. */
export function isMegaItem(item: MenuItem): boolean {
  return item.children.some((child) => child.children.length > 0);
}

/**
 * Service groups (Servicios → categories) from the primary menu. The footer
 * renders them as columns, so services are edited in one place.
 */
export function getServiceGroups(primary: MenuItem[]): MenuItem[] {
  return primary.filter(isMegaItem).flatMap((item) => item.children);
}

/** Whether `item` (or one of its descendants) points to the current page. */
export function isActive(item: MenuItem, currentPath: string): boolean {
  if (item.href && !item.external && item.href === currentPath) return true;
  return item.children.some((child) => isActive(child, currentPath));
}
