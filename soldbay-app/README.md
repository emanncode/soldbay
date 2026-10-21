# Soldbay Mobile App

Soldbay's student marketplace client is built with Expo SDK 57, React Native,
Expo Router, NativeWind, and TypeScript. It contains buyer and seller flows;
backend/API behavior is provided by [`../soldbay-web`](../soldbay-web/README.md).

**Integration status:** Browse and Search use mock product arrays; chat is
in-memory sample state; order views use placeholder data; seller verification
uses mock image selection and a local role switch. Do not treat those screens as
connected end-to-end flows yet.

## Run locally

1. Install dependencies with `npm install`.
2. Configure the API base URL and any other required Expo environment values.
3. Start the Expo development server with `npm start`; use `npm run android`,
   `npm run ios`, or `npm run web` for a target platform.

Do not run `reset-project` against this app: it replaces the current routes with
starter scaffolding.

## Checks

- `npx tsc --noEmit`
- `npm run lint`

The AllOnSoldBay Linear project contains the current product scope, screen
flows, component build status, and locked design tokens. Follow
[`AGENTS.md`](AGENTS.md) for Expo SDK-specific contributor guidance. Treat
historical local logs and superseded design references as history, not active
specifications.
