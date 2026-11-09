/**
 * Contact form notification email (replaces the Elementor Pro form email).
 *
 * The email provider isn't chosen yet (Resend, existing SMTP…): it plugs in as a
 * `MailTransport`. Keep it fetch-based so it also runs on Cloudflare Workers
 * (SMTP/nodemailer only works on Vercel).
 *   - `astro dev`: submissions are printed to the terminal.
 *   - production without a transport: throws, so the form shows its error
 *     message (with the email address) instead of losing the lead silently.
 */
import { CONTACT_TO_EMAIL } from 'astro:env/server';
import type { Locale } from '../../i18n/config';

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  locale: Locale;
};

type Mail = { to: string; replyTo: string; subject: string; text: string; html: string };
type MailTransport = { send(mail: Mail): Promise<void> };

const consoleTransport: MailTransport = {
  async send(mail) {
    console.info(`[contact] Email to ${mail.to} (reply-to ${mail.replyTo})\n${mail.subject}\n\n${mail.text}`);
  },
};

// TODO: add the production transport once the provider is chosen.
const transport: MailTransport | undefined = import.meta.env.DEV ? consoleTransport : undefined;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildContactMail(data: ContactSubmission): Mail {
  const rows: Array<[string, string | undefined]> = [
    ['Nombre', data.name],
    ['Email', data.email],
    ['Teléfono', data.phone],
    ['Empresa', data.company],
    ['Idioma', data.locale.toUpperCase()],
  ];
  const filled = rows.filter((row): row is [string, string] => Boolean(row[1]));
  return {
    to: CONTACT_TO_EMAIL,
    replyTo: data.email,
    subject: `Nueva solicitud de contacto: ${data.name}${data.company ? ` (${data.company})` : ''}`,
    text: `${filled.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMensaje:\n${data.message}`,
    html: `<table>${filled
      .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`)
      .join('')}</table><p><strong>Mensaje:</strong></p><p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`,
  };
}

export async function sendContactNotification(data: ContactSubmission): Promise<void> {
  if (!transport) throw new Error('No email transport configured (src/lib/contact/notify.ts)');
  await transport.send(buildContactMail(data));
}
