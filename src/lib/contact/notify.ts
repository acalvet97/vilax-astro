/**
 * Contact form notification email (replaces the Elementor Pro form email).
 *
 * The email provider isn't chosen yet (Resend, existing SMTP…): it goes in
 * `sendMail`. Keep it fetch-based so it also runs on Cloudflare Workers
 * (SMTP/nodemailer only works on Vercel).
 *   - `astro dev`: submissions are printed to the terminal.
 *   - production without a provider: throws, so the form shows its error
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

async function sendMail(mail: Mail): Promise<void> {
  if (import.meta.env.DEV) {
    console.info(`[contact] Email to ${mail.to} (reply-to ${mail.replyTo})\n${mail.subject}\n\n${mail.text}`);
    return;
  }
  // TODO: send `mail` with the email provider once it's chosen.
  throw new Error('No email provider configured (src/lib/contact/notify.ts)');
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildContactMail(data: ContactSubmission): Mail {
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
  await sendMail(buildContactMail(data));
}
