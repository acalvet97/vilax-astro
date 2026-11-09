/**
 * Astro Actions (server functions; the only on-demand code of the site).
 *
 * `contact`: the Contact page form (src/components/contact/ContactForm.astro).
 * Validates the fields, drops bots that fill the honeypot and sends the
 * notification email (src/lib/contact/notify.ts). Field errors come back as an
 * input error; the form shows its own localized messages per field.
 */
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { locales } from '../i18n/config';
import { sendContactNotification } from '../lib/contact/notify';

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().trim().min(1).max(200),
      email: z.email().max(254),
      phone: z.string().trim().max(50).optional(),
      company: z.string().trim().max(200).optional(),
      message: z.string().trim().min(10).max(5000),
      privacy: z.boolean().refine((accepted) => accepted),
      locale: z.enum(locales),
      // Honeypot: hidden from people, bots tend to fill it.
      website: z.string().optional(),
    }),
    handler: async (input) => {
      // Pretend it worked so bots don't learn anything.
      if (input.website) return { ok: true };

      try {
        await sendContactNotification({
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          message: input.message,
          locale: input.locale,
        });
      } catch (error) {
        console.error('[contact] Notification email failed:', error);
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not send the message' });
      }

      return { ok: true };
    },
  }),
};
