# SPEC.md — askopenclaw.com

## One-liner

A voice-powered knowledge base that explains OpenClaw to non-technical people through natural conversation.

## Problem

OpenClaw is blowing up (100k+ GitHub stars, 2M visitors in a week) but everything about it — the README, blog posts, tutorials — is written for developers. There's no resource for the massive wave of curious non-technical people who keep hearing about it and want to understand what it actually is, whether it's safe, and whether it's for them.

## Solution

A single-purpose website with one big button: **"Ask me anything about OpenClaw."**

You click it, you talk to a voice agent, it explains OpenClaw like a patient, knowledgeable friend. No jargon. No docs to read. Just a conversation.

## Target User

- 40-65 years old
- Heard about OpenClaw from a news article, podcast, or their kid
- Comfortable using a website and talking to Siri/Alexa but not comfortable with a terminal
- Wants to understand: What is it? Is it safe? Should I care? Could I use it?

## Core Experience

1. User lands on askopenclaw.com
2. Sees a clean, minimal page with a brief tagline and a single call-to-action
3. Clicks "Try it free" — an embedded ElevenLabs voice agent activates
4. User asks questions in plain English, agent responds conversationally
5. Free session caps at **90 seconds**
6. User is prompted to unlock a full **20-minute session** via Stripe

## Voice Agent

### Provider: ElevenLabs Conversational AI

- ElevenLabs voice agent handles all speech-to-text, LLM reasoning, and text-to-speech
- Warm, calm, conversational tone — like a knowledgeable friend, not a lecturer
- Explains concepts using analogies and everyday language
- Never assumes technical knowledge
- Stays on topic — this is about OpenClaw, not general tech support

### Can handle questions like:

- "What even is OpenClaw?"
- "Is it like Siri?"
- "Is it safe?"
- "Why is everyone talking about it?"
- "Could I use it or is it only for programmers?"
- "What's the deal with the name changes?"

### Honest about:

- Limitations and risks (prompt injection, security concerns)
- The fact that it currently requires technical knowledge to set up
- What it costs to run

## Knowledge Base

The ElevenLabs agent is grounded in curated knowledge covering:

- **What it is**: Open-source personal AI assistant that runs on your own device
- **How it works** (simplified): Connects your messaging apps to an AI brain
- **History**: Clawdbot -> Moltbot -> OpenClaw, Peter Steinberger, the viral growth story
- **Why people care**: Privacy, control, runs locally, free and open-source
- **Supported apps**: WhatsApp, Telegram, iMessage, Slack, Discord, etc.
- **Security**: Honest take — powerful but has real risks, Cisco findings, prompt injection
- **Who it's for / not for**: Currently requires technical setup, not plug-and-play yet
- **The ecosystem**: Skills, ClawHub, community
- **Comparisons**: How it differs from ChatGPT, Siri, Alexa, Google Assistant

## Monetization — Freemium

| Tier | What you get | Price |
|------|-------------|-------|
| **Free** | 90-second conversation on the website | $0 |
| **Full session** | 20-minute conversation via dedicated ElevenLabs agent link | €6 (€0.30/min × 20min) |

### Flow

1. Free: Embedded ElevenLabs widget on landing page, hard-capped at 90 seconds
2. Paid: Stripe Payment Link checkout → manual fulfillment for now (you get notified, send the ElevenLabs agent link)
3. v2: Automate delivery via Stripe webhooks + email

### No accounts. Anonymous. Just pay and talk.

## Tech Stack

- **Frontend**: Static HTML/CSS/JS — single page, no framework
- **Voice**: ElevenLabs Conversational AI (embedded widget for free tier)
- **Payments**: Stripe Payment Link (no server-side integration needed for MVP)
- **Hosting**: Vercel, Cloudflare Pages, or Netlify (pure static site)
- **No backend needed for MVP** — ElevenLabs handles the AI, Stripe handles payments

## Pages

Just one page: **/**

Landing page with:
- Hero + tagline
- Embedded ElevenLabs voice agent (free 90s)
- Pricing section
- "Unlock full session" Stripe CTA
- Brief "How it works" explainer
- Footer with disclaimers

## Design Principles

- **Radically simple** — if your mom wouldn't understand it, redesign it
- **Big text, big buttons** — accessibility first
- **No tech jargon on the page** — save that for the voice agent to explain
- **Trust signals** — transparent about who made it, not affiliated with OpenClaw
- **Mobile-first** — many users will arrive from shared links on their phone

## MVP Scope

Ship the smallest thing that works:

1. Beautiful static landing page
2. Embedded ElevenLabs voice widget (90s free cap)
3. Stripe Payment Link for paid tier
4. Manual fulfillment of paid sessions
5. Deploy as static site

Everything else is v2.

## Open Questions

- [x] Pricing model → Freemium (90s free / 20min paid)
- [x] Voice provider → ElevenLabs
- [x] Accounts → No, anonymous
- [x] Payment → Stripe Payment Link, manual fulfillment
- [x] Exact price point for paid tier → €6 (€0.30/min, 3x cost of €0.10/min)
- [ ] ElevenLabs agent configuration (voice, model, knowledge base)
- [ ] Legal: trademark considerations with "OpenClaw" in the domain/branding
- [ ] How to handle knowledge base updates as OpenClaw evolves

## Success Metrics

- Conversion rate: visitors → started free conversation
- Free → paid conversion rate
- Session length: how long do people actually talk
- Word of mouth: shared links, return visits
