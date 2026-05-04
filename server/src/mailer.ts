import nodemailer from 'nodemailer';
import { env } from './env.js';

export const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface NewContactMail {
  name: string;
  email: string;
  budget: string | null;
  message: string;
  locale: string | null;
  ip: string | null;
  userAgent: string | null;
  id: string;
  createdAt: Date;
}

export async function sendNewContactEmail(c: NewContactMail): Promise<void> {
  const subject = `New contact — ${c.name}`;
  const text =
    `New contact form submission\n\n` +
    `Name: ${c.name}\n` +
    `Email: ${c.email}\n` +
    `Budget: ${c.budget ?? '—'}\n` +
    `Locale: ${c.locale ?? '—'}\n` +
    `IP: ${c.ip ?? '—'}\n` +
    `Received: ${c.createdAt.toISOString()}\n` +
    `ID: ${c.id}\n\n` +
    `Message:\n${c.message}\n`;

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f0f14;">
      <h2 style="margin: 0 0 16px; font-weight: 600;">New contact</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr><td style="padding: 6px 0; color: #71717a; width: 90px;">Name</td><td>${escapeHtml(c.name)}</td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Email</td><td><a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Budget</td><td>${escapeHtml(c.budget ?? '—')}</td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Locale</td><td>${escapeHtml(c.locale ?? '—')}</td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Received</td><td>${c.createdAt.toISOString()}</td></tr>
      </table>
      <div style="border-left: 3px solid rgb(0 102 255); padding-left: 16px; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(c.message)}</div>
      <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa;">ID: ${c.id} · IP: ${escapeHtml(c.ip ?? '—')}</p>
    </div>
  `;

  await mailer.sendMail({
    from: env.MAIL_FROM,
    to: env.MAIL_TO,
    replyTo: c.email,
    subject,
    text,
    html,
  });
}
