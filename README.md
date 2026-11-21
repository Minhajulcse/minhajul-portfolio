# Minhajul Islam — Developer Portfolio & AI Assistant

A modern, high-performance personal portfolio website for **Minhajul Islam** — Computer Science student at Daffodil International University, competitive programmer (Codeforces Specialist 1432, AtCoder Green 828), PPS Lab Prefect, problem setter, and software developer.

Built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, featuring an integrated **AI-powered Portfolio Assistant**.

---

## 🌟 Key Features

- **AI-Powered Portfolio Assistant**:
  - Interactive floating chat assistant in the bottom-right corner.
  - Powered by configurable LLM backends (Google Gemini AI, OpenAI, Groq).
  - Full knowledge of Minhajul's education, competitive programming achievements, projects, skills, and experience.
  - Bilingual support (understands and responds in both English and Bangla).
  - Suggested quick questions, typing indicators, markdown message rendering, and error handling.
  - Secure server-side API endpoint (`/api/chat`) with in-memory rate limiting and request validation.

- **Updated Competitive Programming Showcase**:
  - **Codeforces**: Rating **1432 — Specialist** with official Cyan branding (`#03A89E`).
  - **AtCoder**: Rating **828** with official Green tier branding (`#22c55e` / `#008000`).
  - **CodeChef**: Rating **1429** (`NoObMin`).
  - Verified contest achievements (ICPC Dhaka Regional, NSU IUPC, Unlock The Algorithm 2nd place, CodeTrap 4th place).

- **Modernized UI/UX**:
  - Refined typography (`Manrope` display font, `DM Sans` body font, `JetBrains Mono` numerical accents).
  - Dynamic theme switcher (light and dark mode) with system preference detection and persistent storage.
  - Interactive bento-grid statistics and academic cards.
  - Project showcase with tech badges, categorization, and GitHub links.
  - Fullscreen achievements photo gallery with keyboard navigation (Esc, Arrow keys).
  - Fully responsive from mobile devices (360px) to large desktop monitors (1920px+).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (For AI Assistant)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your API key:
```env
# Google Gemini (Recommended - Free API key at https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash

# Or OpenAI / Groq (Optional alternative)
# OPENAI_API_KEY=your_openai_api_key_here
```

> **Note:** If no API key is configured, the chatbot gracefully notifies visitors with instructions on how to activate live AI responses without throwing unhandled exceptions or exposing backend credentials.

### 3. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Architecture & File Structure

```text
├── components/
│   ├── Chatbot.tsx       # AI assistant widget (UI, suggestions, markdown renderer)
│   └── Icons.tsx         # Lightweight, crisp SVG icon collection
├── data/
│   └── profile.ts        # Central single source of truth for personal data, stats & links
├── lib/
│   ├── ai-provider.ts    # Secure server-side AI interface (Gemini / OpenAI / Groq)
│   └── knowledge.ts      # Structured system prompt generator for the AI assistant
├── pages/
│   ├── api/
│   │   └── chat.ts       # Secure Next.js API route with rate limiting & sanitization
│   ├── _app.tsx          # Root app wrapper with synchronized theme management
│   └── index.tsx         # Main portfolio landing page
├── public/
│   ├── achievements/     # Gallery images & contest moments
│   ├── resume.pdf        # Downloadable CV
│   └── sitemap.xml       # Search engine sitemap
├── styles/
│   └── globals.css       # Design tokens, theme variables, animations & layouts
├── .env.example          # Environment variables template
└── sitemap.js            # Automated post-build sitemap generator
```

---

## 🛠️ Updating Personal Information in the Future

All personal information, contest ratings, new projects, and skills are maintained in:
```text
data/profile.ts
```
Whenever you update this file, the changes will automatically update:
1. The entire portfolio website UI.
2. The AI assistant's system knowledge base.
3. SEO and OpenGraph metadata.

---

## 📄 License

Designed and developed for Minhajul Islam. All rights reserved.
