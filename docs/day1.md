# DAY 1 — MAY 19 — CREDEX AI SPEND AUDIT
## Complete Build Guide for Cursor

---

## WHAT YOU ARE BUILDING

A free web app that audits a startup's AI tool spending and surfaces savings.
Built for **Credex** (credex.rocks) — they sell discounted AI infrastructure credits.

**The flow:**
1. User enters their AI tools, plans, monthly spend, seats, team size, use case
2. Audit engine (pure hardcoded logic, NO AI) calculates savings per tool
3. Results page shows breakdown + total monthly/annual savings
4. Anthropic API generates a ~100 word personalized summary
5. Email capture gates the full report
6. Each audit gets a unique shareable public URL with Open Graph tags

**Stack:**
- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (database)
- Anthropic API (AI summary)
- Resend (transactional email)
- Vercel (deploy)

---

## PASTE THIS IN EVERY NEW CURSOR CHAT (Global Context)

```
I am building "AI Spend Audit" for Credex (credex.rocks).
Credex sells discounted AI infrastructure credits. This tool is their free lead-gen product
that audits a startup's AI tool spending and surfaces savings opportunities.

Stack: Next.js 14 App Router, TypeScript strict, Tailwind CSS, shadcn/ui,
Supabase, Anthropic API, Resend, deployed on Vercel.

Folder structure:
src/
  app/
    page.tsx                    <- landing + form
    audit/[id]/page.tsx         <- shareable results page
    api/audit/route.ts          <- saves audit, returns ID
    api/leads/route.ts          <- email capture
  components/
    SpendForm.tsx
    AuditResults.tsx
    LeadCapture.tsx
    SavingsHero.tsx
  lib/
    auditEngine.ts              <- pure functions, no API calls
    pricing.ts                  <- all pricing constants
    supabase.ts
    anthropic.ts
  types/
    index.ts

The audit engine uses ZERO AI - pure deterministic rules only.
AI is only used for the ~100 word summary paragraph via Anthropic API.
```

---

## BEFORE YOU WRITE A SINGLE LINE OF CODE

Create these 3 accounts and keep the keys ready:

| Service | URL | Keys needed |
|---|---|---|
| Supabase | supabase.com | URL, anon key, service role key |
| Resend | resend.com | API key |
| Anthropic | console.anthropic.com | API key |

Also message 3 people right now on WhatsApp/Instagram asking for a 10 min call
about AI tools they use. The user interviews are mandatory and take the longest.

---

## SECTION 1 — PROJECT INIT
> Run in terminal. Not in Cursor.

```bash
# Inside your cloned empty repo folder:
npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint

# Prompts:
# src/ directory?        -> Yes
# App Router?            -> Yes
# import alias?          -> No (press enter)

# Init shadcn
npx shadcn@latest init
# Style -> Default
# Base color -> Slate
# CSS variables -> Yes

# Add shadcn components
npx shadcn@latest add button input label card select badge separator toast progress

# Install project dependencies
npm install @supabase/supabase-js @anthropic-ai/sdk resend nanoid
npm install -D @types/uuid

# First commit
git add .
git commit -m "feat: init Next.js 14 app with TypeScript, Tailwind, shadcn"
git push
```

---

## SECTION 2 — FOLDER STRUCTURE
> Run in terminal.

```bash
mkdir -p src/lib src/types src/components src/hooks

touch src/types/index.ts

touch src/lib/pricing.ts
touch src/lib/auditEngine.ts
touch src/lib/supabase.ts
touch src/lib/anthropic.ts

touch src/components/SpendForm.tsx
touch src/components/AuditResults.tsx
touch src/components/LeadCapture.tsx
touch src/components/SavingsHero.tsx

mkdir -p "src/app/audit/[id]"
touch "src/app/audit/[id]/page.tsx"

mkdir -p src/app/api/audit
mkdir -p src/app/api/leads
touch src/app/api/audit/route.ts
touch src/app/api/leads/route.ts

touch .env.local .env.example

git add .
git commit -m "chore: scaffold full folder structure"
git push
```

---

## SECTION 3 — ENV FILES
> Create manually.

**.env.local** (never commit this):
```
NEXT_PUBLIC_SUPABASE_URL=paste_your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key
RESEND_API_KEY=paste_your_resend_key
ANTHROPIC_API_KEY=paste_your_anthropic_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**.env.example** (commit this):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=
```

Confirm .gitignore has .env.local — Next.js adds it by default.

```bash
git add .env.example
git commit -m "chore: add env example file with all required variables"
git push
```

---

## SECTION 4 — TYPESCRIPT TYPES
> Cursor prompt for src/types/index.ts

```
Write the complete contents of src/types/index.ts for the AI Spend Audit app.

We support these AI tools:
cursor, github-copilot, claude, chatgpt, anthropic-api, openai-api, gemini, windsurf

Create and export these types with JSDoc comments:

1. AITool — union of all 8 tool string IDs

2. UseCase — 'coding' | 'writing' | 'data' | 'research' | 'mixed'

3. ToolEntry — {
     tool: AITool
     plan: string
     monthlySpend: number   // what the user is currently paying
     seats: number
   }

4. AuditInput — {
     tools: ToolEntry[]
     teamSize: number
     useCase: UseCase
     website?: string       // honeypot field, should always be empty
   }

5. RecommendationType —
   'downgrade' | 'switch-tool' | 'right-sized' | 'optimize-seats' | 'use-credits'

6. ToolRecommendation — {
     tool: AITool
     toolName: string
     currentPlan: string
     currentSpend: number
     recommendedAction: string
     recommendationType: RecommendationType
     savings: number
     annualSavings: number
     reason: string
     alternativeTool?: string
   }

7. AuditResult — {
     id: string
     input: AuditInput
     recommendations: ToolRecommendation[]
     totalMonthlySavings: number
     totalAnnualSavings: number
     aiSummary: string
     createdAt: string
     isHighSavings: boolean     // true if totalMonthlySavings > 500
   }

8. LeadCapture — {
     email: string
     companyName?: string
     role?: string
     teamSize?: number
     auditId: string
     phone?: string             // honeypot, should always be empty
   }

9. PricingPlan — {
     price: number | null       // null = custom/enterprise pricing
     name: string
     pricePerSeat: boolean
     minSeats?: number
   }

Use strict TypeScript. Export everything. No default exports.
```

```bash
git add .
git commit -m "feat: define all TypeScript types for audit engine and data models"
git push
```

---

## SECTION 5 — PRICING CONSTANTS
> Cursor prompt for src/lib/pricing.ts

```
Write the complete contents of src/lib/pricing.ts.

Import AITool from src/types/index.ts.

Create and export:

1. PRICING — a nested const object with all plan pricing.
   Add comment: // Source: verified May 2026 — see PRICING_DATA.md

   cursor:
     hobby: free, not per-seat
     pro: $20/user/month
     business: $40/user/month
     enterprise: null (custom)

   github-copilot:
     individual: $10/user/month
     business: $19/user/month
     enterprise: $39/user/month

   claude:
     free: $0
     pro: $20/user/month
     max: $100/user/month
     team: $30/user/month, min 5 seats
     enterprise: null (custom)
     api: null (usage-based)

   chatgpt:
     free: $0
     plus: $20/user/month
     team: $30/user/month, min 2 seats
     enterprise: null (custom)
     api: null (usage-based)

   anthropic-api:
     api: null (usage-based, no flat plan)

   openai-api:
     api: null (usage-based, no flat plan)

   gemini:
     free: $0
     advanced: $20/user/month (Google One AI Premium)
     api: null (usage-based)

   windsurf:
     free: $0
     pro: $15/user/month
     team: $35/user/month
     enterprise: null (custom)

2. TOOL_NAMES: Record<AITool, string> — human readable display names

3. TOOL_DESCRIPTIONS: Record<AITool, string> — one line per tool

4. PLAN_OPTIONS: Record<AITool, string[]> — ordered plan keys per tool

5. getPlanPrice(tool: AITool, plan: string): number | null

6. getMinSeats(tool: AITool, plan: string): number
   Claude Team = 5, ChatGPT Team = 2, all others = 1.

7. calculateCurrentCost(tool: AITool, plan: string, seats: number): number | null

Use TypeScript strict mode. Export everything as named exports.
```

```bash
git add .
git commit -m "feat: pricing constants for all 8 AI tools with helper functions"
git push
```

---

## SECTION 6 — AUDIT ENGINE
> Cursor prompt for src/lib/auditEngine.ts

```
Write the complete contents of src/lib/auditEngine.ts.
This is the most important file. Pure functions only. Zero API calls. Zero side effects.

Import types from src/types/index.ts.
Import PRICING, TOOL_NAMES, getPlanPrice, getMinSeats from src/lib/pricing.ts.

Build these functions:

---
function analyzeToolEntry(entry: ToolEntry, input: AuditInput): ToolRecommendation

Evaluates one tool. Check in this order:

STEP 1 — SEAT OPTIMIZATION
Is the user paying for more seats than team size justifies?
- Claude Team min 5: if teamSize < 5, compare Team vs Pro x teamSize
  e.g. teamSize=2: Team=$150/mo vs Pro x 2=$40/mo -> save $110, type: optimize-seats
- ChatGPT Team min 2: if teamSize=1, Plus($20) vs Team($30) -> save $10
- GitHub Copilot Enterprise: if teamSize < 10, Business tier sufficient
  Enterprise=$39/seat vs Business=$19/seat -> save $20/seat

STEP 2 — SAME VENDOR DOWNGRADE
Is there a cheaper plan from same vendor that fits?
- Claude Max ($100) + useCase is writing/research/mixed -> Claude Pro ($20) sufficient
- Cursor Business ($40) + seats=1 -> Cursor Pro ($20)
- GitHub Copilot Enterprise ($39) + teamSize < 10 -> Business ($19)

STEP 3 — CROSS TOOL ALTERNATIVE (use case based)
Coding: Windsurf Pro ($15) is cheapest — recommend if on Copilot Business ($19) with 5+ seats
Writing: if on both Claude and ChatGPT flat plans -> drop one, save $20/seat
Research: if on ChatGPT Team ($30) for research -> Claude Pro ($20) saves $10/seat
Data: if on flat plan for intermittent data work -> suggest evaluating API-direct pricing

STEP 4 — ALREADY OPTIMAL
Return savings: 0, type: 'right-sized', action: 'Keep current plan'

RULES:
- savings = Math.max(0, currentSpend - recommendedSpend)
- reason must always include actual dollar numbers
- annualSavings = savings * 12
- If user's entered spend > seats x plan price, note the discrepancy
- Never fabricate savings

---
function runAudit(input: AuditInput): Omit<AuditResult, 'id' | 'aiSummary' | 'createdAt'>

- Runs analyzeToolEntry for each tool
- totalMonthlySavings = sum of all savings
- totalAnnualSavings = totalMonthlySavings * 12
- isHighSavings = totalMonthlySavings > 500

---
function generateAuditSummaryPrompt(
  result: Omit<AuditResult, 'aiSummary'>,
  input: AuditInput
): string

Returns prompt for Anthropic. Produce ~100 words.
Include: total savings, top 2 recommendations, use case, team size.
Tone: direct CFO-style paragraph, no bullets, no fluff.
Only mention Credex if savings > $500/mo.

---
Export: runAudit, generateAuditSummaryPrompt only.
Full TypeScript strict. No any.
```

```bash
git add .
git commit -m "feat: audit engine with seat optimization, downgrade, and cross-tool logic"
git push
```

---

## SECTION 7 — SUPABASE SETUP
> Run this SQL in Supabase dashboard -> SQL Editor

```sql
create table audits (
  id text primary key,
  input jsonb not null,
  recommendations jsonb not null,
  total_monthly_savings numeric not null,
  total_annual_savings numeric not null,
  ai_summary text,
  is_high_savings boolean default false,
  created_at timestamp with time zone default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company_name text,
  role text,
  team_size integer,
  audit_id text references audits(id),
  created_at timestamp with time zone default now()
);

create table rate_limits (
  ip text primary key,
  count integer default 1,
  window_start timestamp with time zone default now()
);

alter table audits enable row level security;
alter table leads enable row level security;
alter table rate_limits enable row level security;

create policy "audits public read" on audits for select using (true);
create policy "audits service insert" on audits for insert with check (true);
create policy "leads service insert" on leads for insert with check (true);
create policy "rate_limits all" on rate_limits using (true) with check (true);
```

> Cursor prompt for src/lib/supabase.ts:

```
Write the complete contents of src/lib/supabase.ts.

Import createClient from @supabase/supabase-js.
Import AuditResult, LeadCapture from src/types/index.ts.

Create:
1. supabaseClient — public browser client (NEXT_PUBLIC env vars)
2. supabaseAdmin — server-only client (SERVICE_ROLE_KEY)
   Comment: // Only use in API routes, never in client components

3. async saveAudit(audit: AuditResult): Promise<void>
   Uses supabaseAdmin. Maps camelCase to snake_case. Logs errors, never throws.

4. async getAudit(id: string): Promise<AuditResult | null>
   Uses supabaseClient. Returns null if not found. Maps snake_case back.

5. async saveLead(lead: LeadCapture): Promise<void>
   Uses supabaseAdmin. Logs errors, never throws.

6. async checkRateLimit(ip: string): Promise<boolean>
   Max 10 audits per IP per hour. true = allowed, false = blocked.
   On any Supabase error: return true (fail open).
```

```bash
git add .
git commit -m "feat: supabase client with audit storage, lead capture, rate limiting"
git push
```

---

## SECTION 8 — ANTHROPIC INTEGRATION
> Cursor prompt for src/lib/anthropic.ts:

```
Write the complete contents of src/lib/anthropic.ts.

Import Anthropic from @anthropic-ai/sdk.
Import AuditResult, AuditInput from src/types/index.ts.
Import generateAuditSummaryPrompt from src/lib/auditEngine.ts.

Create and export:
async function generateAISummary(
  result: Omit<AuditResult, 'aiSummary'>,
  input: AuditInput
): Promise<string>

- Uses claude-sonnet-4-20250514, max_tokens: 200
- system: "You are a concise financial analyst. Direct, specific. No fluff. No sales pitch. Under 120 words. Plain paragraph, no bullets."
- On ANY error: return a fallback template paragraph using real numbers from result.
  The fallback must look like a real summary, not an error message.
  Fill in: current total spend, tool count, total savings, top recommendation, annual savings.
  If isHighSavings: mention Credex discounted credits.
  If savings < $100: say stack is well-optimized.
- Log errors to console. Never throw.
```

```bash
git add .
git commit -m "feat: Anthropic API summary generation with graceful fallback"
git push
```

---

## SECTION 9 — API ROUTES

> Cursor prompt for src/app/api/audit/route.ts:

```
Write src/app/api/audit/route.ts — Next.js 14 App Router POST handler.

Imports: NextRequest, NextResponse, nanoid, runAudit, generateAISummary,
saveAudit, checkRateLimit, AuditInput, AuditResult.

Steps:
1. Get IP from x-forwarded-for or x-real-ip header
2. checkRateLimit(ip) — return 429 if blocked
3. Parse body as AuditInput
4. Validate: tools array length >= 1, teamSize > 0, valid useCase
5. Honeypot: if body.website is non-empty, return fake { success: true, id: 'fake-'+nanoid(6) }
6. runAudit(input) -> auditData
7. generateAISummary(auditData, input) -> aiSummary
8. Build AuditResult: { ...auditData, id: nanoid(10), aiSummary, input, createdAt: new Date().toISOString() }
9. saveAudit(audit)
10. Return { id, totalMonthlySavings, totalAnnualSavings, isHighSavings }

Wrap in try/catch. Return 500 on unexpected error. TypeScript strict.
```

> Cursor prompt for src/app/api/leads/route.ts:

```
Write src/app/api/leads/route.ts — Next.js 14 App Router POST handler.

Imports: NextRequest, NextResponse, Resend, saveLead, getAudit, LeadCapture.

Steps:
1. Parse body: { email, companyName?, role?, teamSize?, auditId, phone? }
2. Honeypot: if body.phone is non-empty, return { success: true } immediately
3. Validate email with regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/
4. getAudit(auditId) — return 400 if not found
5. saveLead({ email, companyName, role, teamSize, auditId })
6. Send email via Resend:
   From: onboarding@resend.dev
   Subject: savings > 0 ? "Your AI Spend Audit — $X/mo savings found" : "Your AI Spend Audit — Stack optimized"
   Text: share link, savings numbers, Credex follow-up note if isHighSavings
7. If Resend throws: log but still return success
8. Return { success: true }

TypeScript strict. Full try/catch.
```

```bash
git add .
git commit -m "feat: API routes for audit and lead capture with honeypot and validation"
git push
```

---

## SECTION 10 — SPEND FORM
> Cursor prompt for src/components/SpendForm.tsx:

```
Write the complete src/components/SpendForm.tsx.

Props: { onSubmit: (input: AuditInput) => void, isLoading: boolean }

Features:
1. Array of ToolEntry rows. Initialize with one empty row.

2. localStorage persistence:
   Key: "credex-audit-form-v1"
   Save on every state change. Restore on mount.
   Show a small "Draft saved" badge that fades in/out.

3. Each tool row:
   - Tool dropdown (all 8 tools, use TOOL_NAMES for labels)
   - Plan dropdown (dynamic from PLAN_OPTIONS[selectedTool], show price in label)
   - Monthly spend: number input, placeholder "Current monthly spend ($)"
   - Seats: number input, min=1
   - Remove button (trash icon), hidden if only 1 row
   - Below row: "Estimated: $X/mo" if calculable from getPlanPrice

4. "Add another tool" button below rows

5. Global fields:
   - Team size: number input
   - Use case: Select (coding/writing/data/research/mixed)

6. Honeypot: hidden input name="website" display:none tabIndex={-1}

7. Submit button "Run My Audit →"
   Disabled if: no tools, isLoading, rows missing selections
   Shows spinner when isLoading

8. Validate before onSubmit:
   At least 1 complete tool row, teamSize >= 1, useCase selected

Imports: types from src/types/index.ts, pricing from src/lib/pricing.ts, shadcn components.
useState + useEffect + useCallback only. No external form libraries.
Mobile responsive. TypeScript strict.
```

```bash
git add .
git commit -m "feat: SpendForm with dynamic pricing, localStorage, honeypot"
git push
```

---

## SECTION 11 — DISPLAY COMPONENTS

> Cursor prompt for src/components/SavingsHero.tsx:

```
Write src/components/SavingsHero.tsx.

Props: { totalMonthlySavings: number, totalAnnualSavings: number, isHighSavings: boolean, toolCount: number }

If savings > 0:
  Large green number "$X,XXX/month"
  Below: "= $XX,XXX per year"
  If isHighSavings: pulsing badge "High savings found"

If savings === 0:
  Blue/teal colors
  Main text: "Stack Optimized"
  Sub: "Your current AI tools are right-sized for your team"

Always: small gray text "across X tools analyzed"

Make the numbers large and impactful. This gets screenshotted.
Tailwind only. Default export.
```

> Cursor prompt for src/components/AuditResults.tsx:

```
Write src/components/AuditResults.tsx.

Props: { recommendations: ToolRecommendation[], aiSummary: string }

SECTION 1 — Per-tool cards
Each card:
  Left: tool name (bold) + current plan + "You pay: $X/mo"
  Center: arrow icon
  Right: recommended action (bold) + savings or "Optimized"
  Bottom: reason in gray text
  Badge: type label ('Downgrade available', 'Better alternative', 'Seat mismatch', 'Optimal')
  Color: green right panel if savings > 0, slate if savings = 0

SECTION 2 — AI Summary card
  Heading: "Your personalized audit summary"
  aiSummary paragraph
  Badge: "Generated by Claude"

Import ToolRecommendation, TOOL_NAMES. Mobile responsive. TypeScript strict.
```

> Cursor prompt for src/components/LeadCapture.tsx:

```
Write src/components/LeadCapture.tsx.

Props: { auditId: string, isHighSavings: boolean, totalMonthlySavings: number }

States: idle | submitting | success | error

Success state: green checkmark + "Report sent to your email"

Form state:
  Heading based on isHighSavings
  Fields: email (required), company name (optional), role (optional)
  Honeypot: hidden input name="phone" display:none
  Submit: POST to /api/leads
  Error: inline message below form

Small text: "No spam. Credex may reach out for high-savings audits only."
TypeScript strict. shadcn components.
```

```bash
git add .
git commit -m "feat: SavingsHero, AuditResults, LeadCapture components"
git push
```

---

## SECTION 12 — HOME PAGE
> Cursor prompt for src/app/page.tsx:

```
Write complete src/app/page.tsx. Client component ('use client').

Two states: FORM and LOADING.

Layout:
1. Nav: "AI Spend Audit" left, "by Credex" link right
2. Hero:
   Headline: "Find out if you're overpaying for AI tools"
   Sub: "Free, instant audit. No login. See exactly where your budget is going."
   3 stat pills: "Takes 2 minutes" | "No login required" | "Avg. $340/mo found" (mocked)
3. SpendForm
4. Footer: "Built by Credex · credex.rocks"

On submit:
  isLoading = true
  POST to /api/audit with AuditInput
  On success: router.push("/audit/" + data.id)
  On error: toast error, isLoading = false

While loading:
  Spinner overlay on form
  Cycling messages every 1.5s:
  ["Analyzing your tools...", "Calculating savings...", "Generating your report...", "Almost done..."]

TypeScript strict. useRouter from next/navigation.
```

```bash
git add .
git commit -m "feat: home page with hero section, form, and loading states"
git push
```

---

## SECTION 13 — RESULTS PAGE
> Cursor prompt for src/app/audit/[id]/page.tsx:

```
Write complete src/app/audit/[id]/page.tsx. Server component.

Params: { id: string }

generateMetadata: fetch audit, return OG title/description/twitter card with savings numbers.

Page body:
1. Back link: "<- Run your own audit" href="/"
2. SavingsHero
3. "Recommended actions" heading + AuditResults
4. CREDEX CTA (only if isHighSavings):
   Teal card: heading with annual savings, Credex pitch, "Book Free Consultation" button -> credex.rocks
5. LeadCapture
6. Share section:
   "Copy link" button -> copies URL, shows "Copied!" for 2s
   "Share on X" -> twitter intent with savings number and URL
7. Footer

If audit not found: "Audit not found" + home link.

Import all components. TypeScript strict.
This page gets screenshotted — design the CTA and share section carefully.
```

```bash
git add .
git commit -m "feat: results page with OG metadata, Credex CTA, share functionality"
git push
```

---

## SECTION 14 — DEPLOY
> Run in terminal.

```bash
npm i -g vercel
vercel
# Link to GitHub repo, follow prompts

# Add env vars at vercel.com -> project -> Settings -> Environment Variables
# All 6 vars from .env.local

vercel --prod
```

Update .env.local:
```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

```bash
git commit -m "chore: configure Vercel production deployment"
git push
```

---

## SECTION 15 — DEVLOG
> Create DEVLOG.md at repo root (not in src/).

```markdown
## Day 1 — 2026-05-19

**Hours worked:** 5

**What I did:**
Initialized Next.js 14 project with TypeScript, Tailwind, and shadcn/ui.
Set up Supabase with audits, leads, rate_limits tables and RLS policies.
Created Resend and Anthropic API accounts. Defined all TypeScript types.
Built pricing constants for all 8 AI tools. Implemented audit engine with
three-level logic: seat optimization, same-vendor downgrade, cross-tool
alternatives. Built Anthropic integration with fallback. Created API routes
with honeypot. Built SpendForm with localStorage. Built home and results pages.
Deployed to Vercel.

**What I learned:**
[Fill in honestly as you work]

**Blockers / what I'm stuck on:**
[Fill in honestly]

**Plan for tomorrow:**
Verify all pricing URLs -> PRICING_DATA.md.
Write 5 audit engine tests + TESTS.md.
Set up GitHub Actions CI.
Polish results page UI.
Write ARCHITECTURE.md with Mermaid diagram.
Collect first user interview notes.
```

```bash
git add DEVLOG.md
git commit -m "docs: DEVLOG day 1 entry"
git push
```

---

## END OF DAY 1 CHECKLIST

- [ ] npm run dev works, no errors
- [ ] Live Vercel URL loads
- [ ] Form: add tools, select plans, see estimated costs
- [ ] Form: page refresh restores state (localStorage)
- [ ] Submit: calls /api/audit, redirects to /audit/[id]
- [ ] Results: shows per-tool breakdown and AI summary
- [ ] Results: share buttons work
- [ ] DEVLOG.md written at repo root
- [ ] .env.example committed (.env.local NOT committed)
- [ ] 10+ commits on May 19 in git history
- [ ] 3 people messaged for user interviews

---

## DAY 2 PREVIEW

- PRICING_DATA.md — verify all 8 vendor URLs (30 min)
- 5+ audit engine unit tests -> TESTS.md
- GitHub Actions CI (.github/workflows/ci.yml)
- UI polish on results page
- ARCHITECTURE.md with Mermaid diagram
- Collect 1-2 user interview notes
- GTM.md first draft
