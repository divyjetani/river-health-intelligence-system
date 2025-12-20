# HackVeda Backend

Simple Node.js + Express backend to support the frontend in `web/frontend`.

Features
- JWT authentication (register/login)
- File upload endpoint (multipart/form-data) with simulated AI processing
- Dashboard endpoints for health score, pollution zones, and detections
- Server-Sent Events (SSE) stream for live updates
- SQLite persistence (file `data.db`)

Getting started
1. Copy `.env.example` to `.env` and update values if needed.
2. cd `web/backend`
3. npm install
4. npm run dev (or `npm start`)

Default environment
- PORT=4000
- CORS_ORIGIN=http://localhost:5173 (Vite default)

Notes
- The backend simulates processing of uploads and emits updates on `/api/stream/live` using SSE.
- No changes are required to your frontend, but to integrate you'll add fetch/axios calls from the frontend to these endpoints.
