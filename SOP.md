# Standard Operating Procedure (SOP): Adding & Managing Chapters

This document serves as the authoritative operational guide for developers and AI agents adding, editing, or curating chapters in the **Backend from First Principles** codebase.

---

## 1. System Architecture & Design Philosophy

* **Engine**: [Astro 5](https://astro.build/) with static site generation (`output: "static"`), MDX content collections, and Vite.
* **Hosting & CI/CD**: GitHub Pages with automated deployment via `.github/workflows/deploy.yml` on push to branch `main`.
* **Routing Base**: Deployed with `base: '/Backendd'` and `site: 'https://amankashyapp07.github.io'`. All internal links must prepend `import.meta.env.BASE_URL.replace(/\/$/, '')`.
* **Design System**: Artful minimalism inspired by Stripe Press and Linear.
  * Deep obsidian background: `#0d0f13`.
  * Semantic domain jewel accents: Cyan (`#38bdf8`), Emerald (`#34d399`), Amber (`#f59e0b`), Violet (`#a78bfa`), Rose (`#fb7185`).
  * Contrast Requirement: All foreground text must achieve WCAG AA contrast ($\ge 4.5:1$).
* **Core Spirit**: Strictly **First Principles over Frameworks**. Avoid AI slop, avoid generic textbook fluff, and ground concepts in real-world systems machinery (such as Aman Kashyap's **NexusIDE** and **MagnusCI**).

---

## 2. Content Schema & Collection Configuration

Chapters are managed via Astro Content Collections in `src/content.config.ts`:

```typescript
// src/content.config.ts
const chapters = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/chapters' }),
  schema: z.object({
    order: z.number().int().positive(), // Unique sequence number
    title: z.string(),                  // Full title for <h1> and <title>
    navTitle: z.string().optional(),     // Short title for sidebar and cards
    summary: z.string(),                // 1-2 sentence editorial summary
    readingTime: z.string(),            // e.g. "2-3 hours" or "3-4 hours"
    keywords: z.array(z.string()).default([]),
    draft: z.boolean().default(false),  // If true, hidden from frontend navigation
  }),
});
```

---

## 3. Step-by-Step Procedure to Add a Chapter

### Step 1: Create the Chapter File
Create a new file in `src/content/chapters/`:
```text
src/content/chapters/{order}-{slug}.mdx
```
*Example*: `src/content/chapters/26-distributed-consensus.mdx`.

### Step 2: Define Valid Frontmatter
The file must begin with YAML frontmatter containing all required schema fields:

```yaml
---
order: 26
title: "Distributed Consensus: Raft, Paxos & Quorum Mechanics"
navTitle: "Distributed Consensus"
summary: "A first-principles dive into consensus algorithms, leader election, log replication, and split-brain defenses in clustered backends."
readingTime: "3-4 hours"
keywords:
  - consensus
  - raft
  - paxos
  - distributed systems
  - quorum
draft: false
---
```

### Step 3: Write First-Principles Content
Follow the structural pattern established across all chapters:
1. **The Mental Model / Wire Mechanics**: What is physically occurring in memory, sockets, or disk before introducing software abstractions.
2. **Interactive SVG Diagrams**: Wrap inline SVGs in `<Diagram caption="...">`:
   ```html
   <Diagram caption="Leader election heartbeat across 3 Raft nodes">
     <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" font-family="var(--font-diagram-mono)" font-size="10">
       <!-- Use design tokens: var(--dg-surface), var(--dg-line), var(--dg-accent), etc. -->
     </svg>
   </Diagram>
   ```
3. **Structured Callouts**: Use the custom `<Callout>` component:
   ```html
   <Callout type="info|ok|warn|danger" title="Systems Rule">
     Explaining why split-brain occurs during network partitions.
   </Callout>
   ```
4. **Runnable Code Blocks**: Include clear language identifier and filename headers:
   ````javascript
   ```javascript title="consensus.js / Minimum Raft leader election in Node.js"
   import crypto from 'node:crypto';
   // implementation...
   ```
   ````
5. **Production Case Studies**: Anchor theoretical concepts with real implementations (e.g. NexusIDE's CRDT WebSockets or MagnusCI's Docker Engine API scheduler).

---

## 4. Critical MDX Rules & Gotchas

> [!CAUTION]
> Failing to follow these MDX rules will break Vite/Acorn parsing and fail the static build.

1. **Escape Angle Brackets in Text**:
   * **WRONG**: `Latency is <20ms.` (Parsed as invalid unclosed JSX `<20ms>`)
   * **CORRECT**: `Latency is under 20ms.` OR `Latency is &lt;20ms.`
2. **Avoid LaTeX Math Blocks**:
   * **WRONG**: `$$\text{Header} = \text{type} + ...$$` OR `$O(1)$` (Acorn parser fails on unconfigured math delimiters).
   * **CORRECT**: Use standard markdown code ticks: `` `Header = type + size + \0` `` or `O(1)`.
3. **Balanced Code Fences**:
   * Every opening triple-backtick (```` ``` ````) must have an exact matching closing triple-backtick.
4. **Self-Closing or Explicitly Closed Components**:
   * `<Callout ...>...</Callout>` and `<Diagram ...>...</Diagram>` must be perfectly balanced.

---

## 5. Integrating with Homepage & Curriculum (`index.astro`)

When adding or categorizing chapters, update `PARTS` in `src/pages/index.astro`:

```typescript
// src/pages/index.astro
const PARTS = [
  { from: 1, to: 7, label: 'Part I: The Request Path', theme: 'cyan', tag: 'NETWORKS & INGRESS', blurb: '...' },
  { from: 8, to: 14, label: 'Part II: State & Machinery', theme: 'emerald', tag: 'PERSISTENCE & STATE', blurb: '...' },
  { from: 15, to: 20, label: 'Part III: Running in Production', theme: 'amber', tag: 'PRODUCTION & CONCURRENCY', blurb: '...' },
  { from: 21, to: 24, label: 'Part IV: Distribution & Scale', theme: 'violet', tag: 'SCALE & STREAMING', blurb: '...' },
  { from: 25, to: 26, label: 'Part V: Personal & Developer Craft', theme: 'rose', tag: 'SYSTEMS CRAFT', blurb: '...' },
];
```

* **Domain Themes available**:
  * `theme-cyan`: Blue-cyan (`#38bdf8`)
  * `theme-emerald`: Mint-green (`#34d399`)
  * `theme-amber`: Gold-amber (`#f59e0b`)
  * `theme-violet`: Indigo-violet (`#a78bfa`)
  * `theme-rose`: Coral-rose (`#fb7185`)

---

## 6. Hiding vs Exposing Chapters (`draft: true`)

To remove low-priority or work-in-progress chapters from the frontend **without deleting file content**:
1. Add `draft: true` to the chapter's frontmatter.
2. Astro's `getStaticPaths()` in `[...slug].astro` and `getCollection()` in `index.astro` filter on `!c.data.draft`.
3. The chapter is omitted from:
   * Homepage curriculum index.
   * Prev/Next pagination links (links automatically reconnect adjacent active chapters).
   * XML sitemap and static HTML routes.
4. The `.mdx` file remains 100% intact on disk for future reactivation.

---

## 7. Mandatory Verification Checklist

Before committing or pushing any new chapter, run the automated validation suite:

```bash
# 1. Audit MDX integrity (checks frontmatter, code fences, tags balance)
node scripts/audit_all_mdx.mjs
# MUST Output: Total Errors: 0, Total Warnings: 0

# 2. Run Test Suite (verifies design system invariants & WCAG AA contrast)
npm test
# MUST Output: 5 pass, 0 fail

# 3. Static Production Build (verifies Vite/MDX compilation & sitemap generation)
npm run build
# MUST Output: Complete! (200 status on all generated HTML pages)
```

---

## 8. Deployment

Once the verification checklist passes:
```bash
git add src/content/chapters/XX-your-chapter.mdx src/pages/index.astro README.md
git commit -m "feat: add Chapter XX (Chapter Title)"
git push origin main
```
GitHub Actions will automatically build and publish the live chapter to:
`https://amankashyapp07.github.io/Backendd/{chapter-slug}/`
