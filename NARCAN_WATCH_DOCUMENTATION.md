# Misfit First Responders + Narcan Watch Documentation

## Mission

**Dope fiend saves dope fiend.**

We're putting Narcan in the hands of every person in recovery. When someone ODs, the person next to them hits a button. Real-time alerts go to all Misfit First Responders with Narcan in that city. The closest responder saves a life.

---

## System Architecture

### Privacy-First Design

**Core Principle:** Location is NEVER tracked. Location is ONLY shared during OD emergencies.

**How It Works:**

1. **Responder Registration** — Join the network with your Narcan count
2. **Location Stays Local** — Your location is stored ONLY on your device
3. **OD Alert Triggered** — Someone hits "Help Now" with their location
4. **Server Calculates Distance** — Backend finds closest responders (server-side only)
5. **Responders Notified** — Push notification sent to closest responders
6. **Responder Accepts** — You can choose to respond or decline
7. **Alert Resolves** — After help arrives, all location data is deleted

**What's NOT Stored:**
- Responder location history
- Victim location history (after alert resolves)
- Movement tracking
- Police access
- Government access
- Data broker access

---

## API Endpoints

### Responder Management

**POST /api/narcan/register**
```json
{
  "user_id": "string",
  "name": "string (optional)",
  "phone": "string (optional)",
  "narcan_count": 0
}
```

**GET /api/narcan/responder/:userId**
Returns responder profile with saves count and Narcan inventory.

**PATCH /api/narcan/responder/:userId**
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "narcan_count": 0,
  "is_active": true
}
```

**GET /api/narcan/stats**
Returns network statistics:
- Total responders
- Active responders
- Total Narcan kits
- Total lives saved

### OD Alerts

**POST /api/narcan/alert** (PRIVACY-FIRST)
```json
{
  "lat": 40.7128,
  "lng": -74.006,
  "location_description": "string (optional)",
  "responder_locations": [
    {
      "responderId": 1,
      "lat": 40.7128,
      "lng": -74.006
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "alert_id": 123,
  "closest_responders_count": 5,
  "message": "Help is on the way. Stay with me."
}
```

**POST /api/narcan/respond**
```json
{
  "responder_id": 1,
  "distance_miles": 0.5,
  "eta_seconds": 120
}
```

**PATCH /api/narcan/alert/:id/resolve**
Marks alert as resolved and deletes all location data.

**GET /api/narcan/active-alerts**
Returns active alerts (created in last 30 minutes).

### Real-Time Subscriptions

**GET /api/narcan/subscribe?responderId=1&city=NewYork**
Server-Sent Events (SSE) for real-time OD alerts.

### Community Stories

**POST /api/stories**
```json
{
  "responder_id": 1,
  "title": "How I Saved My Brother",
  "story": "Full story text...",
  "lives_saved": 1
}
```

**GET /api/stories**
Returns all community stories (newest first).

**GET /api/stories/featured**
Returns featured stories.

**GET /api/stories/:id**
Returns single story.

---

## Frontend Components

### HelpNowButton
```tsx
<HelpNowButton />
```
- Always visible (top-right corner)
- Red, unmissable
- Captures location and sends alert
- Shows "Help is Coming" message during alert

### NuraChat
```tsx
<NuraChat />
```
- Voice-enabled by default
- Text-only toggle available
- Crisis detection with 988 referral
- "Help Now" button integrated

### MisfitFirstResponders
```tsx
<MisfitFirstResponders />
```
- Registration form
- Network statistics
- How it works explanation
- Privacy notice

### ResponderDashboard
```tsx
<ResponderDashboard />
```
- Real-time alert subscription
- Active alerts display
- Narcan inventory management
- Response tracking

### CommunityFeed
```tsx
<CommunityFeed />
```
- All responder stories
- Story submission form
- Lives saved counter

---

## Database Schema

### narcan_responders
```sql
CREATE TABLE narcan_responders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  narcan_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  saves_count INT DEFAULT 0,
  last_location_update TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### od_alerts
```sql
CREATE TABLE od_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  location_description TEXT,
  status ENUM('active', 'resolved') DEFAULT 'active',
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### od_responses
```sql
CREATE TABLE od_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alert_id INT NOT NULL,
  responder_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'responding',
  distance_miles DECIMAL(5, 2),
  eta_seconds INT,
  arrived_at TIMESTAMP,
  narcan_administered VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (alert_id) REFERENCES od_alerts(id),
  FOREIGN KEY (responder_id) REFERENCES narcan_responders(id)
);
```

### responder_stories
```sql
CREATE TABLE responder_stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  responder_id INT NOT NULL,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  lives_saved INT DEFAULT 1,
  featured VARCHAR(10) DEFAULT 'false',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Security & Privacy

### Location Data Handling

**Client-Side:**
- Location stored ONLY in browser memory
- Never sent to server unless alert triggered
- Cleared after alert resolves

**Server-Side:**
- Distance calculated server-side only
- Responder locations NEVER stored
- Victim location deleted after alert resolves
- No location history maintained

### Authentication

- HttpOnly cookies for session management
- Responder ID required for alert subscription
- No unauthenticated access to alerts

### Encryption

- HTTPS for all API calls
- Secure cookies with SameSite flag
- No sensitive data in logs

### Data Deletion

- Location data auto-deleted after 30 minutes
- Alert records kept for statistics only
- No permanent location history

---

## Testing

**Run Tests:**
```bash
pnpm test
```

**Test Coverage:**
- Privacy-first location system
- Crisis detection
- Responder authentication
- Alert broadcasting
- Data deletion
- Security policies

---

## Deployment Checklist

- [ ] ElevenLabs API key configured
- [ ] Database migrations run
- [ ] HTTPS enabled
- [ ] Secure cookies configured
- [ ] Rate limiting enabled
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Crisis resources (988) visible
- [ ] Help Now button on all pages
- [ ] Responder registration tested
- [ ] OD alert flow tested
- [ ] Real-time alerts tested
- [ ] Location data deletion verified
- [ ] Security audit completed

---

## Support & Resources

**Crisis Resources:**
- **988 Suicide & Crisis Lifeline** — Call or text 988
- **SAMHSA National Helpline** — 1-800-662-4357
- **Narcan Distribution** — Contact local health department

**For Responders:**
- Training: Narcan administration
- Supply: Request Narcan kits
- Community: Share your story

---

## Language & Tone

**We use real language for real people.**

- "Dope fiend" — not "person with addiction"
- "OD" — not "overdose incident"
- "Help Now" — not "emergency assistance request"
- "Narcan" — not "naloxone"
- "Misfit" — not "marginalized individual"

We respect the dignity and agency of people in recovery. We don't shy away from hard truths or strong language. We meet people where they are.

---

## Future Enhancements

1. **Narcan Watch Wearable** — Biometric device that detects OD and alerts responders
2. **Government Narcan Supply Chain** — Integration with bulk Narcan distribution
3. **Responder Training Platform** — Online certification for Narcan administration
4. **Insurance Integration** — Coverage for Narcan and training
5. **International Expansion** — Narcan Watch in other countries
6. **AI Prediction** — Predict OD hotspots and pre-position responders

---

## Contact

For questions or support, reach out to the Misfit Ministries team.

**Mission:** Dope fiend saves dope fiend. Every person in recovery can be a first responder.
