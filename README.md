# GOBLOX Preview

This repository contains an early-stage implementation of GOBLOX Preview — a modular, playable platform prototype. This initial commit sets up the frontend (Vite + Three.js) and a simple Express backend.

Getting started

Prerequisites: Node.js 18+

Install dependencies:

  npm install

Run frontend dev server (in one terminal):

  npm run dev

Run backend server (in another terminal):

  npm run start:server

Open http://localhost:5173 for the frontend.

What is included in this commit

- Vite-based frontend skeleton
- Simple SPA navigation and pages (home, games)
- GOengine: small Three.js-based runtime with a Starter Valley sample scene
- Express backend with /api/health and /api/games
- SQLite schema and DB initializer

Known limitations

- Authentication, shop, avatar saving, and server-authoritative currency are not yet implemented (planned in following phases).
- No package-lock.json committed in this initial pass.

