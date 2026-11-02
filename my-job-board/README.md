# EthioWork backend

Next.js route handlers and Mongoose provide the backend in this project.

## Run locally

Install dependencies with `npm ci`. Copy `.env.example` to `.env.local`, set a real MongoDB URI, and generate a random SESSION_SECRET (at least 32 characters). Run `npm run dev`.

For development without MongoDB, explicitly set USE_MOCK_DB=true. This uses data/db.json and is disabled in production. SEED_DEMO_JOBS=true inserts demo listings only into an empty development database. Normal requests never delete existing jobs.

## APIs

- POST /api/auth/signup: name, email, password (6+ characters), role (candidate or employer).
- POST /api/auth/login: email and password. Sets an authenticated, expiring HttpOnly session cookie.
- GET /api/auth/me; POST /api/auth/logout.
- GET /api/jobs; POST /api/jobs (employers only, ownership set by server).
- POST /api/applications: jobId, name, email, cvText. Guests and candidates may apply to existing, open jobs.
- GET /api/applications: signed-in user's applications or applications to their own jobs.
- PATCH /api/applications/:id: status; only the employer owning the job may update.

Email delivery and verification are not configured. Signup supports immediate login; the legacy send-verification endpoint returns 501 instead of falsely claiming delivery. Add a mail provider and token storage before requiring verified emails.

## Deployment

Set MONGODB_URI and SESSION_SECRET in the hosting environment. Production requires MongoDB and HTTPS. Old session cookies are invalid after the session format change; users must log in again. A unique job/email index prevents duplicate applications; remove any existing duplicates before building that index. Apply authentication rate limits at the hosting gateway before exposing a public deployment. The local JSON adapter is for single-process development only.

Run `npm run lint`, `npm run build`, and `npm test` to validate.
