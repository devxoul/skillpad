# AGENTS.md — SkillPad

Tauri v2 desktop app for managing skills.sh skills. React 18 + TypeScript + Tailwind CSS v4.

Also includes a **docs site** (`docs/`) — Next.js 16 + Fumadocs + React 19 + Tailwind CSS v4. Deployed at [skillpad.dev](https://skillpad.dev).

---

## Commands

```bash
# Testing
bun run test                 # Run all tests
bun run test <file>          # Run single test file

# Build
bun run tauri build --target universal-apple-darwin  # macOS
bun run tauri build --target x86_64-pc-windows-msvc  # Windows

# Release — see "Release" section below for versioning rules
gh workflow run Release -f version=<version>
```

---

## Project Structure

```
src/
├── components/     # Feature components
├── ui/             # Base UI primitives
├── views/          # Page-level components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and API
├── contexts/       # React contexts
├── types/          # TypeScript types
├── data/           # Static data
└── test-setup.ts   # Bun test setup (Tauri mocks)
src-tauri/          # Rust backend
docs/               # Docs site (Next.js + Fumadocs) — skillpad.dev
├── src/app/        # Next.js App Router pages
├── content/docs/   # MDX documentation content
└── public/         # Static assets (screenshots, etc.)
badge/              # SVG badge service (Vercel Edge) — badge.skillpad.dev
├── api/badge.ts    # Edge function: generates SVG badges per skill
└── public/         # Static SVG assets (icon, light/dark variants)
```

---

## Code Style

- Path alias: `@/*` → `./src/*`
- Filenames: `kebab-case.ts`
- Named exports only (no default exports)
- Tests: `<filename>.test.ts` co-located with implementation

---

## Testing

Bun Test + React Testing Library. Tauri APIs must be mocked (see `src/test-setup.ts`).

---

## UI Guidelines

See **STYLE_GUIDE.md** for the complete design system (Arc-inspired glassmorphism, colors, typography, icons, component patterns).

When editing styles, UI primitives, component patterns, or adding new UI elements, **you must update STYLE_GUIDE.md** to reflect the changes.

---

## Preferred Libraries

| Purpose | Library |
|---------|---------|
| Icons | `@phosphor-icons/react` |
| Classnames | `clsx` |
| UI primitives | `@base-ui-components/react` |
| HTTP | `@tauri-apps/plugin-http` |

---

## Git Commits

- Lowercase, no period, imperative mood
- One logical change per commit
- Include tests with implementation

---

## Don'ts

- Don't use `npm`, `npx`, `yarn` — use `bun`, `bunx`
- Don't use solid background colors for interactive elements
- Don't mix icon libraries
- Don't add comments that repeat what code says

## Release

**Command**: `gh workflow run Release -f version=<version>`

### Version Decision Rules

When asked to release, determine the version automatically:

1. Read current version from `package.json`
2. Run `git log <current-version>..HEAD --oneline` to review changes since last release
3. Classify and bump:

| Change Type | Bump | Examples |
|---|---|---|
| New feature, new capability, new UI surface | **minor** | new view, new command, new integration |
| Bug fix, refactor, dependency update, docs, styling tweak | **patch** | fix crash, update deps, typo fix |

4. **NEVER bump major.** Major version changes are owner-decided only.
5. If mixed (features + fixes), bump **minor** (minor subsumes patch).
6. Confirm the computed version with the user before running the workflow.