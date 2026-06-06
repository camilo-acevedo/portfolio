<div align="center">

# camiloacevedo.dev

**The freelance portfolio of [Camilo Acevedo](https://camiloacevedo.dev) — Machine Learning Specialist & MLOps Engineer.**
Editorial design, full-stack contact form, EN / ES, dark / light, dockerized backend.

[![status](https://img.shields.io/badge/status-live-success?style=flat-square)](https://camiloacevedo.dev)
[![license](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![react](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![typescript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](#)
[![tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](#)
[![framer](https://img.shields.io/badge/Framer%20Motion-11-0055FF?style=flat-square&logo=framer&logoColor=white)](#)
[![express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](#)
[![prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma&logoColor=white)](#)
[![postgres](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](#)

</div>

---

## What it is

The personal site I use for freelance and full-time conversations — built end-to-end as a portfolio piece in itself. The frontend is editorial-magazine-style React + Tailwind with framer-motion choreography; the backend is a small dockerized Express + Prisma service that records contact submissions in PostgreSQL and emails me through Resend.

> Live at [camiloacevedo.dev](https://camiloacevedo.dev). Deployed on a Hostinger VPS alongside [amory](https://github.com/camilo-acevedo/amory) — Caddy reverse-proxies both with auto-issued TLS.

## Architecture

```
                    ┌───────────────────────────┐
                    │  camiloacevedo.dev        │
                    │  Caddy 2 (auto HTTPS)     │
                    └───────────┬───────────────┘
                                │
                ┌───────────────┴────────────────┐
                ▼                                ▼
   ┌──────────────────────────┐     ┌──────────────────────────┐
   │  portfolio-web           │     │  portfolio-api           │
   │  nginx-alpine            │     │  Node 22 + Express 4     │
   │  serving Vite build      │     │  Zod · helmet · rate-lim │
   │  (SPA fallback +         │     │  POST /api/contact       │
   │   immutable asset cache) │     └──────────┬───────────────┘
   └──────────────────────────┘                │
                                               ▼
                                    ┌──────────────────────┐
                                    │  portfolio-db        │
                                    │  PostgreSQL 16       │
                                    │  (docker volume)     │
                                    └──────────────────────┘
                                               │
                                               ▼
                                       ┌──────────────┐
                                       │  Resend SMTP │
                                       │  (notifies)  │
                                       └──────────────┘
```

The whole stack runs as `docker compose up -d` on the VPS. The contact form persists every submission to Postgres and fires a Resend email asynchronously — even if SMTP is down, the row lands in the database.

## Highlights

### Frontend
- **Editorial sections**: Hero with neural canvas, About iOS-style chat, Services accordion with abstract glyphs, Stack interactive Python REPL, Experience changelog accordion, Projects accordion with case studies, Education with degrees + 9 certifications, Contact with editorial form.
- **Theme switcher** powered by the **View Transitions API** — a circular ink-drop expansion from the click position when toggling dark / light.
- **Language switcher** with a soft blur reveal — i18next + a custom `LangReveal` wrapper triggers a CSS keyframe pulse (no remount, scroll and component state preserved).
- **Right-side rail navigation** inspired by spacedesk.net — fullscreen overlay menu with clip-path circle reveal, vertical "MENU" text, animated hamburger icon.
- **Live i18n** for every line of copy (EN / ES).
- **Mobile-first responsive** down to 320px, including the Stack REPL and the chat.

### Backend
- **Express 4** + **Zod** validation + **Prisma 5** ORM over **PostgreSQL 16**.
- **Helmet**, **rate limiting** (8 req/h/IP for contact), **honeypot field** for bots, **trust proxy** for IP capture.
- **Nodemailer** via **Resend SMTP** for async email notifications — failures don't drop submissions.
- **Pino** structured logging.
- **Health check** at `/api/health` for the deploy script's smoke test.

### Deploy
- **Custom Python deploy script** (paramiko-based) that packs the project, ships it via SFTP, builds containers remotely, and reloads Caddy gracefully — coexists with another stack on the same VPS without downtime.
- **Caddy** auto-handles TLS via Let's Encrypt; both `camiloacevedo.dev` and `www.` covered.
- **Idempotent**: re-running the deploy preserves the `.env`, doesn't regenerate the DB password, and only appends to the Caddyfile if the server block isn't there yet.

## Tech stack

| Layer | Tools |
| --- | --- |
| **Frontend** | React 18 · TypeScript 5.7 · Vite 6 · Tailwind CSS 3 · Framer Motion 11 · Lucide icons · react-i18next |
| **Backend** | Node 22 · Express 4 · Prisma 5 · Zod · Helmet · express-rate-limit · pino · nodemailer |
| **Database** | PostgreSQL 16 (alpine) |
| **Email** | Resend SMTP |
| **Infra** | Docker Compose · Caddy 2 · Hostinger VPS (Ubuntu 24.04) |
| **Deploy** | Custom paramiko script with SFTP upload + remote `docker compose build` + Caddy reload |

## Project layout

```
portfolio/
├── src/
│   ├── components/
│   │   ├── layout/        Header (rail + fullscreen menu), Footer, ThemeToggle, LanguageToggle
│   │   ├── sections/      Hero, About, Services, Stack, Experience, Projects, Education, Contact
│   │   └── fx/            NeuralCanvas, ChatConversation, AbstractGlyph, MagneticButton, DecryptText
│   ├── contexts/          ThemeContext (View Transitions API)
│   ├── hooks/             useReducedMotion, useThemeColors, useCvHref
│   ├── i18n/locales/      en.json · es.json
│   ├── data/              stack.ts (47 tools across 7 categories)
│   └── App.tsx
├── public/
│   ├── camilo.jpg         hero / chat avatar
│   ├── cv-en.pdf          downloadable CV (EN)
│   └── cv-es.pdf          downloadable CV (ES)
├── server/
│   ├── src/
│   │   ├── index.ts       Express bootstrap
│   │   ├── routes/contact.ts
│   │   ├── mailer.ts      Resend / nodemailer
│   │   ├── db.ts          Prisma client
│   │   └── env.ts         Zod-validated env
│   ├── prisma/schema.prisma
│   ├── Dockerfile
│   ├── docker-compose.yml (local dev: Postgres only)
│   └── README.md          backend deploy guide
├── vite.config.ts         Vite + dev proxy (/api → :3001)
├── tailwind.config.ts     theme tokens, custom keyframes
└── package.json
```

## Local development

```bash
# 1. Install
npm install
cd server && npm install && cd ..

# 2. Start Postgres + run prisma migrations
cd server
docker compose up -d
cp .env.example .env
# edit .env: set SMTP creds (or leave placeholders to skip email)
npm run prisma:migrate:dev -- --name init

# 3. Start backend (in server/)
npm run dev      # listens on :3001

# 4. Start frontend (root, separate terminal)
cd ..
npm run dev      # Vite at :5173, proxies /api → :3001
```

Open `http://localhost:5173` and you have the full site running locally.

## Deploy

The `server/README.md` documents the production deploy on a VPS with Caddy reverse-proxy. The Docker stack (`docker-compose.yml` at the project root, generated by the deploy script) brings up three containers:

- `portfolio-db` — Postgres 16
- `portfolio-api` — Node + Express
- `portfolio-web` — nginx-alpine serving the Vite build

The deploy script (kept private; not in this repo) automates this with `paramiko` over SSH.

## License

[MIT](LICENSE) — feel free to fork, study, and adapt. Attribution appreciated.

---

<div align="center">

Built by [Bryam Camilo Acevedo](https://camiloacevedo.dev) · [github.com/camilo-acevedo](https://github.com/camilo-acevedo) · [hi@camiloacevedo.dev](mailto:hi@camiloacevedo.dev)

</div>
