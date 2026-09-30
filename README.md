# FRICTIONFIX

> **One customer journey. Multiple departments. One shared memory.**

FRICTIONFIX is an enterprise customer-journey intelligence platform built for the **TCS AIML Hackathon**. It provides cross-department organizational memory interaction powered by **Hindsight** and grounded LLM reasoning.

---

## 🌟 Key Features (Phase 1 Foundation)

1. **Department Selection & Demo Login**: Choose between **Product**, **Marketing**, and **Customer Service** preset identities or custom roles.
2. **Department-Aware Application Shell**: Visual context updates dynamically (`PRODUCT INTELLIGENCE`, `MARKETING INTELLIGENCE`, `CUSTOMER SERVICE INTELLIGENCE`).
3. **Pluggable Architecture**: Center main workspace (~80% width) has an intentionally designed reserved space ready for future department analytics components.
4. **Persistent AI Agent (~20% Width)**: Embedded right-side panel that remains visible during navigation with department-tailored suggested questions.
5. **Hindsight Organizational Memory Layer**:
   - `RETAIN`: Store organizational observations and evidence.
   - `RECALL`: Search memories across entities (e.g. `P500`, `Q3-Growth-Campaign`, `Auth-Flow`) and departments.
   - `REFLECT`: Synthesize evidence across teams.
6. **Fact vs. Inference Response Structure**: AI responses distinguish:
   - **OBSERVED**: Quantitative facts and evidence.
   - **INFERRED**: Deductions and root causes.
   - **RECOMMENDED**: Actionable next steps.
   - **HISTORICAL CONTEXT**: Previous actions & outcomes.
   - **MEMORY SOURCES**: Clickable drawer displaying grounded memory cards.
7. **Multi-LLM Abstraction**: Server-side support for **Gemini** (`@google/genai`), **OpenAI**, **Groq**, and **Demo Mode**.
8. **Editorial Visual Identity & Themes**: Light and Dark mode using **Alegreya** display headings and **Gentium Plus** body text.

---

## 🏗️ Architecture Overview

```
                        FRICTIONFIX
                             │
                           LOGIN
                             │
     ┌───────────────────────┼───────────────────────┐
     │                       │                       │
  PRODUCT                MARKETING            CUSTOMER SERVICE
     │                       │                       │
     └───────────────────────┼───────────────────────┘
                             │
                    DEPARTMENT WORKSPACE
                             │
              ┌──────────────┴──────────────┐
              │                             │
    DEPARTMENT WORKSPACE             AI AGENT PANEL
           (~80%)                        (~20%)
              │                             │
    RESERVED FUTURE MODULES        HINDSIGHT MEMORY LAYER
                                            +
                                       LLM PROVIDER
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18+ 
- npm v9+

### 2. Installation
```bash
git clone https://github.com/arjunvallala/FrictionFix.git
cd FrictionFix
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your parameters (optional for Live Mode; defaults to **Demo Mode**):
```env
PORT=3001
AI_PROVIDER=demo # Options: 'gemini' | 'openai' | 'groq' | 'demo'

# Optional API Keys for Live Mode
GEMINI_API_KEY=
OPENAI_API_KEY=
GROQ_API_KEY=

# Hindsight Integration
HINDSIGHT_API_KEY=
HINDSIGHT_BASE_URL=https://hindsight.vectorize.io/api/v1
```

### 4. Running locally
Start both Express backend and Vite frontend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

---

## 🧪 Demo Mode & Test Steps

1. Open `http://localhost:5173`.
2. Select **Product** (Arjun — Product Manager).
3. In the persistent AI Agent panel on the right, click **"Why are customers having problems with P500?"**.
4. Observe the grounded response with **OBSERVED**, **INFERRED**, **RECOMMENDED**, and **HISTORICAL CONTEXT**.
5. Click **"Based on X organizational memories"** to inspect memory sources.
6. Switch department to **Marketing** or **Customer Service** using the header dropdown or sidebar shortcuts.

---

## 📜 License
MIT License. Built for TCS AIML Hackathon.
