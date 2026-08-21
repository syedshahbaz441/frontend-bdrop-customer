# BuddyDrop Admin Frontend

Angular frontend for the BuddyDrop administration experience. The application is intended to run alongside the BuddyDrop Spring Boot backend and currently provides the starting point for administrator API integration.

## Prerequisites

- Node.js compatible with Angular 22
- npm 11.7.0 or a compatible npm version
- BuddyDrop backend running locally on `http://localhost:8081` when testing API calls

Check your local versions with:

```bash
node --version
npm --version
```

## Getting started

From the repository root:

```bash
npm install
npm start
```

Open `http://localhost:4200/` in a browser. The Angular development server reloads the application when source files change.

> **Important:** If this checkout contains merge-conflict markers such as `<<<<<<< HEAD`, resolve them before running `npm install`, building, or committing. The conflict must be resolved consistently for the admin application; do not leave customer-only services or template bindings in the admin branch unless they are intentionally required.

## Backend and API proxy

The frontend uses `/api` as its API base URL. During local development, `proxy.conf.json` forwards `/api` requests to:

```text
http://localhost:8081
```

The proxy avoids browser cross-origin issues and means frontend services should call relative paths such as `/api/admin/products`, rather than hard-coding the backend host.

The current admin service endpoints are:

| Service | Endpoint | Supported operations |
| --- | --- | --- |
| `AdminProductService` | `/api/admin/products` | List, get by ID, create |
| `AdminUserService` | `/api/admin/users` | List, get by ID, create |

The API base URL is defined in `src/environments/environment.ts`. Update the environment and proxy configuration together if the backend location changes.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the development server on port 4200 |
| `npm run build` | Create a production build in `dist/` |
| `npm run watch` | Continuously build with the development configuration |
| `npm test -- --watch=false` | Run the Vitest suite once |
| `npm test` | Run tests in watch mode |
| `npx ng generate component components/name` | Generate an Angular component |

## Project structure

```text
src/
  app/
    app.ts                 Root component and connection status checks
    app.html               Root component template
    app.css                Root component styles
    app.config.ts          Angular providers, routing, and HttpClient
    app.routes.ts          Application routes
    services/              Backend API services
  environments/
    environment.ts         Local API configuration
  main.ts                  Application bootstrap
  styles.css               Global styles
public/                    Static assets copied to the build
proxy.conf.json            Local API proxy configuration
angular.json               Angular workspace configuration
package.json               Scripts and dependencies
```

## Adding a feature

1. Add or update a service under `src/app/services/` for backend communication.
2. Keep API URLs relative to `environment.apiBaseUrl`.
3. Add a route in `src/app/app.routes.ts` and a component for user-facing functionality.
4. Add or update focused tests beside the code they cover.
5. Run the build and one-shot test command before opening a pull request:

```bash
npm run build
npm test -- --watch=false
```

## Troubleshooting

- **The page loads but the admin status is unavailable:** verify that the Spring Boot backend is running on port `8081` and exposes the admin endpoints.
- **API requests fail with CORS errors:** start the frontend with `npm start` so the configured development proxy is used.
- **The application does not compile:** search the repository for `<<<<<<<`, `=======`, and `>>>>>>>`; unresolved merge conflicts must be fixed first.
- **The browser shows an old page:** stop any other Angular dev server, then restart `npm start` and reload the page.

## Related documentation

- [Angular CLI documentation](https://angular.dev/tools/cli)
- [Angular testing guide](https://angular.dev/guide/testing)
- [Vitest documentation](https://vitest.dev/)
