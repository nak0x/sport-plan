# Deploying on Coolify

The app builds into a static site served by nginx via Docker. No database, no env vars required.

## Prerequisites

- A running Coolify instance (v4+)
- The GitHub repo connected to Coolify (or SSH key added)
- A domain or Coolify-generated URL

---

## 1. Add the repository to Coolify

1. In Coolify, go to **Projects** → your project → **+ New Resource**
2. Choose **Application**
3. Select **GitHub** (or **Git repository** if using SSH)
4. Pick the `nak0x/sport-plan` repo and the `main` branch

---

## 2. Configure the build

| Setting | Value |
|---|---|
| Build Pack | **Dockerfile** |
| Dockerfile path | `Dockerfile` *(root of repo)* |
| Port | `80` |

Coolify will detect the `Dockerfile` automatically if you select the **Dockerfile** build pack.

---

## 3. Set up auto-deploy (webhook)

1. In Coolify → your application → **Webhooks**
2. Copy the webhook URL
3. In GitHub → repo **Settings** → **Webhooks** → **Add webhook**
   - Payload URL: paste the Coolify webhook URL
   - Content type: `application/json`
   - Events: **Just the push event**
4. Save — every push to `main` now triggers a rebuild automatically

---

## 4. Deploy

Click **Deploy** in Coolify. First build takes ~2 min (downloads base images). Subsequent builds are faster thanks to Docker layer caching.

---

## 5. (Optional) Custom domain

1. In Coolify → your app → **Domains**
2. Add your domain
3. Enable **HTTPS** — Coolify provisions a Let's Encrypt certificate automatically

---

## Local development

```bash
npm install
npm run dev       # starts Vite dev server on http://localhost:5173
npm run build     # produces dist/ for production
npm run preview   # serves the dist/ folder locally
```
