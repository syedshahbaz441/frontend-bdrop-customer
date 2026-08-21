# BuddyDrop Customer Frontend

Angular customer application for booking and tracking delivery services.

## Prerequisites

- Node.js compatible with Angular 22
- npm 11.7.0 or compatible
- BuddyDrop backend running on `http://localhost:8081` for live API calls

## Getting started

```bash
npm install
npm start
```

Open `http://localhost:4300/` in a browser.

## Customer API

The customer app uses the shared backend through the `/api` proxy. Customer services call:

- `/api/customer/orders`
- `/api/customer/profile`
- `/api/health`

Admin APIs and admin UI belong to `frontend-admin`, not this project.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the customer development server on port 4300 |
| `npm run build` | Create a production build |
| `npm test -- --watch=false` | Run the customer unit tests once |

## Structure

```text
src/app/
  pages/       Customer login, home, booking, tracking, and history
  services/    Customer order, profile, journey, and health services
```
