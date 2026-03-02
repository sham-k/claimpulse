# ClaimPulse — Revenue Operations Dashboard

A demo dashboard built to showcase AI-powered denial recovery for post-acute home health care agencies.

Built with React, TypeScript, Tailwind CSS, and the Anthropic Claude API.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3. Using the AI Denial Analyzer

1. Click any **Denied** claim in the table
2. Enter your Anthropic API key when prompted (stored locally in your browser)
3. Click **Analyze Denial** to get a full AI-powered recovery plan

Get an API key at: https://console.anthropic.com

---

## Features

- **Revenue metrics bar** — Total billed, recovered, at-risk, denial rate, avg days to reimbursement
- **Claims pipeline** — Filter by status (Denied, In Review, Submitted, Approved, Resubmitted)
- **Search** — Filter by patient name, claim ID, or payer
- **AI Denial Analyzer** — Powered by Claude; produces root cause, immediate actions, documentation checklist, resubmission strategy, and recovery probability
- **Live indicator** — Real-time status feel

---

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Anthropic Claude API (`claude-opus-4-6`)
- IBM Plex Sans / IBM Plex Mono (typography)
