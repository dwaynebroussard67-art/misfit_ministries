# Misfit Ministries — Express 5 + MySQL Rebuild

This is the complete rebuild of Misfit Ministries as a monorepo using Express 5 REST API, MySQL database, and React frontend with Wouter routing.

## Architecture

**Monorepo Structure:**

```
artifacts/api-server/    → Express 5 REST API (Node.js backend)
artifacts/misfit/        → React + Vite frontend (Wouter routing)
lib/db/                  → Drizzle ORM + MySQL schema
lib/api-spec/            → OpenAPI specification (future)
lib/api-client-react/    → Generated React Query hooks (future)
scripts/                 → Utility scripts
```

## Key Features

### 1. Express 5 REST API (`artifacts/api-server/`)

**All 14 Routes Implemented:**

- `POST /api/prayers` — Submit prayer requests (crisis detection enabled)
- `GET /api/prayers` — List prayers
- `PATCH /api/prayers/:id/status` — Update prayer status (Forge only)
- `PATCH /api/prayers/:id/pray` — Increment prayer count
- `DELETE /api/prayers/:id` — Delete prayer (Forge only)

- `POST /api/testimonies` — Submit testimonies
- `GET /api/testimonies` — List approved testimonies
- `PATCH /api/testimonies/:id` — Update testimony (Forge only)
- `DELETE /api/testimonies/:id` — Delete testimony (Forge only)

- `GET /api/resources` — List crisis resources
- `POST /api/resources` — Create resource (Forge only)
- `PATCH /api/resources/:id` — Update resource (Forge only)
- `DELETE /api/resources/:id` — Delete resource (Forge only)

- `GET /api/content` — List content pages
- `POST /api/content` — Create content (Forge only)
- `PATCH /api/content/:id` — Update content (Forge only)
- `DELETE /api/content/:id` — Delete content (Forge only)

- `GET /api/site-copy` — Get all site copy with defaults
- `PUT /api/site-copy/:key` — Update site copy (Forge only)
- `DELETE /api/site-copy/:key` — Reset to default (Forge only)

- `POST /api/nura/chat` — Chat with Nura AI (Groq backend)
- `GET /api/nura/backend` — Get active backend info
- `GET /api/nura/sessions` — List sessions (Forge only)
- `GET /api/nura/stats` — Session analytics (Forge only)

- `POST /api/forge/auth` — Authenticate with passphrase (HttpOnly cookie)
- `POST /api/forge/logout` — Logout (clear HttpOnly cookie)
- `GET /api/forge/verify` — Verify current session

- `POST /api/stripe/checkout` — Create Stripe checkout session
- `GET /api/stripe/products` — List Stripe products
- `POST /api/stripe/webhook` — Handle Stripe webhook events

- `GET /api/stats/overview` — Get platform statistics
- `GET /api/stats/activity` — Get recent activity feed

- `POST /api/crisis/od-alert` — Submit overdose alert
- `GET /api/crisis/od-alerts` — List OD alerts (Forge only)
- `PATCH /api/crisis/od-alerts/:id/resolve` — Mark alert resolved (Forge only)

- `GET /api/forge/autopilot/status` — Get autopilot status
- `POST /api/forge/autopilot/start` — Start autopilot
- `POST /api/forge/autopilot/stop` — Stop autopilot
- `POST /api/forge/autopilot/run-now` — Run immediately
- `GET /api/forge/autopilot/content` — List generated content
- `PATCH /api/forge/autopilot/content/:id` — Approve/reject content

- `GET /api/forge/media/status` — Get generator status
- `POST /api/forge/media/generate` — Generate content immediately
- `POST /api/forge/media/start` — Start scheduled generation
- `POST /api/forge/media/stop` — Stop scheduled generation

### 2. Crisis Detection & Nura AI

**Crisis Keywords Detected:**
- Suicide, suicidal ideation, self-harm
- Overdose, opioid, heroin, fentanyl, meth
- Abuse, assault, violence
- Hopelessness, worthlessness

**Nura AI Features:**
- Powered by Groq (llama-3.3-70b-versatile)
- Ethiopian Orthodox theological framework
- Automatic 988 referral for crisis situations
- Conversation history tracking
- Crisis flagging and monitoring

### 3. HttpOnly Cookie Authentication (Forge)

- **No localStorage exposure** — All tokens in HttpOnly cookies
- **Timing-safe comparison** — Prevents timing attacks
- **Passphrase-based** — Default passphrase is "988"
- **8-hour TTL** — Automatic expiration
- **Strict SameSite** — CSRF protection

### 4. Autopilot Publisher & Content Creator

**Autopilot:**
- Scheduled social media posting
- Platform support: Twitter/X, Facebook, Instagram, LinkedIn
- Content approval workflow
- Status tracking (pending, approved, posted)

**Content Creator:**
- AI-generated social posts (4 per cycle)
- Merchandise ideas (2 per cycle)
- Scheduled generation (default: 24 hours)
- Manual trigger available

### 5. Stripe Payment Processing

- Checkout session creation
- Product listing
- Webhook event handling
- Payment intent tracking

### 6. MySQL Database Schema

**Tables:**
- `prayers` — Prayer requests with crisis flags
- `testimonies` — User testimonies with approval workflow
- `resources` — Crisis resources and helplines
- `content` — Website pages and announcements
- `site_copy` — Editable website copy with defaults
- `nura_conversations` — Chat sessions with crisis tracking
- `autopilot_content` — Generated content for publishing
- `od_alerts` — Overdose alert locations
- `conversations` — Chat conversation metadata
- `messages` — Individual chat messages

## Development

### Install Dependencies

```bash
pnpm install
```

### Start Development Servers

```bash
# Terminal 1: API Server (port 5000)
pnpm --filter @workspace/api-server dev

# Terminal 2: Frontend (port 5173)
pnpm --filter @workspace/misfit dev
```

### Run Tests

```bash
pnpm test
```

### Build for Production

```bash
pnpm build
```

## Environment Variables

**Required:**
- `DATABASE_URL` — MySQL connection string (auto-provided by Manus)
- `GROQ_API_KEY` — Groq API key for Nura AI
- `STRIPE_SECRET_KEY` — Stripe secret key (auto-provided by Manus)
- `STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `PRINTIFY_JWT_TOKEN` — Printify API token
- `FORGE_PASSPHRASE` — Forge authentication passphrase (default: "988")
- `JWT_SECRET` — JWT signing secret (auto-provided by Manus)

**Optional:**
- `NODE_ENV` — "production" or "development"
- `PORT` — API server port (default: 5000)
- `AUTOPILOT_CHECK_MINUTES` — Autopilot check interval (default: 5)
- `MEDIA_INTERVAL_HOURS` — Content generation interval (default: 24)

## API Documentation

### Prayer Submission with Crisis Detection

```bash
curl -X POST http://localhost:5000/api/prayers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "request": "Please pray for me, I am struggling with suicidal thoughts",
    "category": "mental_health",
    "is_anonymous": false
  }'
```

**Response:**
```json
{
  "success": true,
  "crisis_flag": true,
  "message": "Prayer submitted. Crisis detected. 988 resources available."
}
```

### Nura AI Chat

```bash
curl -X POST http://localhost:5000/api/nura/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello Nura, I am struggling",
    "sessionId": "session-123",
    "history": []
  }'
```

**Response:**
```json
{
  "reply": "I hear your pain, friend. Jesus Christ is the answer...",
  "crisis_flag": false,
  "refer_988": false
}
```

### Forge Authentication

```bash
curl -X POST http://localhost:5000/api/forge/auth \
  -H "Content-Type: application/json" \
  -d '{"passphrase": "988"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Authenticated"
}
```

(Sets HttpOnly cookie: `forge_vault_token`)

## Frontend Pages

- `/` — Home page
- `/prayer` — Prayer wall
- `/shine` — Testimonies
- `/wreckage` — Crisis resources
- `/armory` — Articles and teachings
- `/nura` — AI chat interface
- `/about` — About Misfit Ministries
- `/constitution` — Nura's operating principles
- `/forge` — Admin dashboard (requires authentication)
- `/store` — Merchandise store (Stripe + Printify)

## Testing

**Test Files:**
- `artifacts/api-server/src/utils/crisis-detection.test.ts` — Crisis keyword detection
- `artifacts/api-server/src/middleware/forge-auth.test.ts` — HttpOnly cookie auth
- `artifacts/api-server/src/routes/prayers.test.ts` — Prayer submission
- `artifacts/api-server/src/utils/nura-adapter.test.ts` — Groq API integration

**Run Tests:**
```bash
pnpm test
```

## Deployment

This project is deployed on Manus webdev with:
- Auto-scaling Express 5 API
- MySQL database (TiDB Cloud)
- React frontend with Vite
- HttpOnly cookies for security
- Rate limiting on all endpoints

## Troubleshooting

### "Cannot find module" errors

Ensure you're using ES modules:
```bash
# Check package.json has "type": "module"
# Check all imports use .js extensions
```

### Database connection errors

Verify `DATABASE_URL` environment variable:
```bash
echo $DATABASE_URL
```

### Groq API errors

Check `GROQ_API_KEY` is set:
```bash
echo $GROQ_API_KEY
```

### Stripe webhook not working

Ensure `STRIPE_WEBHOOK_SECRET` is correct and webhook is configured in Stripe dashboard.

## Support

For issues or questions:
1. Check the logs in `.manus-logs/`
2. Review the audit document: `CODE_AUDIT_FINAL.md`
3. Test individual endpoints with curl
4. Run the test suite

## License

Misfit Ministries — A Beacon for Humanity
