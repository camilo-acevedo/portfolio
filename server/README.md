# portfolio-server

Minimal Node + Express + Prisma + PostgreSQL API that backs the contact form and records submissions.

## Local development

```bash
# 1. Start Postgres (dev)
docker compose up -d

# 2. Install + generate client + migrate
npm install
cp .env.example .env            # adjust SMTP creds
npm run prisma:migrate:dev -- --name init
npm run prisma:generate

# 3. Run the API
npm run dev                      # listens on http://localhost:3001
```

The Vite dev server proxies `/api/*` to this port automatically — no frontend env var needed.

## Production on a VPS

Two supported paths — pick one.

### A) Docker (recommended)

```bash
# On the VPS
git clone <repo>
cd portfolio/server
cp .env.example .env             # fill DATABASE_URL, SMTP_*, MAIL_*, CORS_ORIGIN

# Bring up Postgres + migrate + run
docker compose up -d postgres
docker build -t portfolio-server .
docker run -d --name portfolio-api \
  --env-file .env \
  --network host \
  --restart unless-stopped \
  portfolio-server
```

### B) systemd + Node

```bash
npm ci
npm run build
npx prisma migrate deploy
# copy systemd unit (see below) and:
sudo systemctl enable --now portfolio-api
```

Example `/etc/systemd/system/portfolio-api.service`:

```ini
[Unit]
Description=Portfolio API
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=/opt/portfolio/server
EnvironmentFile=/opt/portfolio/server/.env
ExecStart=/usr/bin/node dist/index.js
Restart=always
User=portfolio

[Install]
WantedBy=multi-user.target
```

## Nginx

Reverse-proxy the API at `/api` and serve the built frontend as static files:

```nginx
server {
  listen 443 ssl http2;
  server_name camilo.dev;

  root /var/www/portfolio;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri /index.html;
  }
}
```

## SMTP

Any SMTP provider works — Resend, Brevo, Mailgun, Postmark, SendGrid, or your own Postfix. Set `SMTP_*` and `MAIL_*` in `.env`. Gmail requires an app password.

## Endpoints

- `GET  /api/health` — `{ ok: true, ts }`
- `POST /api/contact` — `{ name, email, budget?, message, locale?, website? }` (body limited to 16kb, rate-limited to 8 req/hour/IP, honeypot field `website` must be empty)
