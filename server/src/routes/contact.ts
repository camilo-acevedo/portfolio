import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { sendNewContactEmail } from '../mailer.js';

const bodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  budget: z.string().trim().max(60).optional().nullable(),
  message: z.string().trim().min(4).max(4000),
  locale: z.string().trim().max(10).optional().nullable(),
  website: z.string().max(0).optional(), // honeypot: must be empty
});

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_requests' },
});

export const contactRouter = Router();

contactRouter.post('/contact', limiter, async (req: Request, res: Response) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'invalid_input',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  // honeypot check — silently accept to avoid bot signal
  if (parsed.data.website && parsed.data.website.length > 0) {
    return res.status(200).json({ ok: true });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
    req.socket.remoteAddress ??
    null;
  const userAgent = req.headers['user-agent'] ?? null;

  try {
    const contact = await prisma.contact.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        budget: parsed.data.budget ?? null,
        message: parsed.data.message,
        locale: parsed.data.locale ?? null,
        ip,
        userAgent,
      },
    });

    sendNewContactEmail({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      budget: contact.budget,
      message: contact.message,
      locale: contact.locale,
      ip: contact.ip,
      userAgent: contact.userAgent,
      createdAt: contact.createdAt,
    }).catch((err) => {
      console.error('[mail] failed to send notification', err);
    });

    return res.status(201).json({ ok: true, id: contact.id });
  } catch (err) {
    console.error('[contact] db error', err);
    return res.status(500).json({ error: 'server_error' });
  }
});
