# Training & Meal Plan

A personal sport and nutrition dashboard built with React. Combines weekly training periodization, daily meal plans, grocery lists, and a 6-month medical tracking schedule into a single offline-capable web app.

## Features

- **Meals** — daily meal plans (breakfast → dinner) with kcal targets, prep times, and nutrition tips. Adapts portions automatically for deload weeks.
- **Monthly training plan** — 6-month periodization following a 3:1 charge/deload cycle, with weekly volume targets and coaching notes.
- **Grocery list** — full weekly shopping list organized by category, with budget estimates and sourcing tips (Grenoble-specific).
- **Stock & Batch** — monthly pantry stock, freezer strategy, Sunday batch-cooking guide, and supplement recommendations.

The app is entirely static — no backend, no database, no accounts. Everything runs in the browser.

## Stack

- React 18
- Vite 5
- Deployed via Docker + nginx

## Deploy

See [docs/DEPLOY.md](docs/DEPLOY.md) for step-by-step Coolify deployment with auto-deploy on push.
