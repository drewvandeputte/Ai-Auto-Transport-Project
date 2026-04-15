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

## AI-Assisted Booking (Build This)
When a customer selects a carrier and confirms their booking, the system
should prepare a complete booking package and present it as a ready-to-execute
task. This means:
- All carrier details pre-populated (MC number, contact, rate, route)
- Bill of lading pre-drafted and ready to send
- A single confirmation screen for the operator (or VA) showing everything
  needed to complete the Central Dispatch booking in under 3 minutes
- After operator confirms, customer receives automated booking confirmation
  email with carrier details and tracking info

The goal is to reduce manual booking time from 15-20 minutes to 2-3 minutes
per shipment. The human clicks confirm — the AI has done everything else.

## AI Customer Support Chat (Build This)
Add an AI chat widget to the website and customer dashboard. The AI should:
- Answer questions about shipment status, timing, policies, and process
- Know our carrier vetting standards, what customers can/can't put in their car,
  open vs enclosed differences, and typical transit times by route
- Pull live shipment status data to answer "where is my car" questions
- Handle standard cancellation requests automatically
- Detect when a question needs human escalation and route it appropriately
- Be available 24/7 with no human involvement for routine questions

Target: AI handles 80-90% of all inbound customer questions without
human intervention.

## Automated Cancellation Recovery (Build This - Phase 3)
If a carrier cancels or goes dark before pickup:
- System detects the cancellation automatically
- AI immediately notifies the customer with a reassurance message
- AI queries available carriers on the same route using our scoring engine
- If a replacement scores above our minimum threshold, auto-book and notify
  customer with new carrier details
- If no carrier clearly qualifies, surface top 3 options for operator approval
- Log everything for review
- Entire process from detection to customer notification should complete
  in under 10 minutes without human involvement for standard cases

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

## Security & Bot Protection (Add Before Public Launch)
Before the site goes live to real customers, implement:
- Google reCAPTCHA v3 on all public forms (quote form, contact form)
- Rate limiting on the backend: max 3 quote requests per IP per 10 minutes
- ZIP code validation before any Anthropic API call is made
- Honeypot hidden field on the quote form
- Admin dashboard flags for suspicious submission patterns
- AI chat widget requires email or order number for shipment-specific info
- Never expose carrier pricing logic or internal scoring weights to 
  unauthenticated users via the chat widget
  