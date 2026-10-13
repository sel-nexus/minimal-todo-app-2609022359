# Minimal Todo App

A small Vite + React task-list fixture for developers and QA engineers validating browser automation. It supports adding tasks by button or Enter, toggling completion, and deleting tasks. Stable `data-testid` selectors and sequential IDs make the lifecycle deterministic.

Task state lives in React memory only and resets when the page reloads. This project intentionally has no backend, API, database, routing, authentication, or persistent storage.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify

Run component tests:

```sh
cd frontend
node node_modules/vitest/vitest.mjs run
```

Run the Playwright browser journey (install Chromium once with `node node_modules/@playwright/test/cli.js install chromium` if needed):

```sh
cd frontend
node node_modules/@playwright/test/cli.js test
```

Build the static app:

```sh
cd frontend
node node_modules/vite/bin/vite.js build
```
