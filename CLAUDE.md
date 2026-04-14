# AutoRoute AI — Project Briefing for Claude Code

## What We Are Building
An AI-powered auto transport comparison platform. Consumers who need to
ship a car (relocation, online car purchase, military PCS move) enter their
route and vehicle details, and the platform uses AI to compare carriers and
recommend the best option in plain English — with transparent pricing,
carrier ratings, and a clear explanation of why that carrier was selected.

## Current Phase
Phase 1 — Build the Demo Product (no real payments or live carrier data yet).
We are building a working demo good enough to show real people for feedback.
No FMCSA license has been obtained yet. No real bookings. Demo only.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js with Express
- Database: PostgreSQL (via Supabase for now, to keep setup simple)
- AI Layer: Anthropic API (claude-sonnet-4-6) for recommendation explanations
- Payments: Stripe (Phase 3 only — not yet)
- Email: SendGrid (Phase 3 only — not yet)
- Hosting: Render or Railway (later)

## Core Features to Build (Phase 1)
1. Homepage with headline and quote form
2. Quote form inputs: pickup ZIP, delivery ZIP, vehicle year/make/model,
   transport type (open/enclosed), target ship date
3. AI comparison engine — returns ranked carrier list with scores
4. Plain-English AI explanation for the top recommendation
5. Results page showing ranked carriers with price, rating, transit time
6. Internal admin view showing all quotes generated
7. Mobile responsive throughout

## What We Are NOT Building Yet
- Real carrier API integration (we use realistic sample/mock data in Phase 1)
- Stripe payments
- User accounts or login
- Email automation
- Live booking confirmation

## Business Context
- Target customers: individuals relocating, military families, online car buyers
- Revenue model: commission per shipment (~15-20% of shipment value, ~$175/shipment)
- Revenue goal: $130K/year within 20-24 months
- Founder is non-technical — Claude Code is doing the building
- Every decision should favor simplicity and speed of build over complexity

## AI Recommendation Logic
Score each carrier on:
- Price (40% weight) — lower is better
- Carrier rating (30% weight) — out of 5 stars
- Transit time in days (20% weight) — fewer days is better
- Insurance coverage level (10% weight) — higher is better
Generate a 2-3 sentence plain-English explanation using the Anthropic API
explaining WHY the top carrier was recommended for this specific shipment.

## Sample Carrier Data (Phase 1 Mock Data)
Use these realistic carriers for demo purposes:
- FastHaul Transport: $850, 4.8 stars, 4 days, $100K insurance
- MidWest Auto Movers: $920, 4.5 stars, 5 days, $150K insurance
- CoastLine Carriers: $780, 4.2 stars, 7 days, $100K insurance
- PrimeShip Auto: $1,050, 4.9 stars, 3 days, $200K insurance
- DirectRoute LLC: $890, 4.6 stars, 5 days, $125K insurance

## Coding Preferences
- Write clean, well-commented code — the founder will be reading it
- Prefer simple solutions over clever ones
- Keep components small and single-purpose
- Use .env files for all API keys — never hardcode them
- After each major feature, confirm it works before moving to the next