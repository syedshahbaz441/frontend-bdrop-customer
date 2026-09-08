# BuddyDrop Customer Frontend

A customer-facing React + TypeScript app for booking delivery and drop services through BuddyDrop. The interface lets users:

- choose a service type
- enter pickup and drop-off locations
- place an order
- view the active order status
- review recent orders

## Tech stack

- React 19
- TypeScript
- Vite
- Vitest
- Testing Library

## Project structure

- `src/App.tsx` — main customer order flow UI
- `src/api/customerApi.ts` — API calls for customer orders
- `src/types.ts` — shared types
- `src/App.css` — styling for the app

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the app in development mode:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Run lint checks:

```bash
npm run lint
```

## Features

- Service selection cards for food delivery, pickup/drop, and goods transfer
- Dynamic order summary with total cost
- Live order panel showing order progress
- Recent orders history
- API integration layer for customer order actions

## Notes

This frontend is designed to work with a BuddyDrop backend that exposes customer order endpoints such as:

- fetching recent orders
- fetching active order
- creating a new order

## Repository

- GitHub: https://github.com/syedshahbaz441/frontend-bdrop-customer.git
