# AGENTS.md — Skillpad

Tauri v2 desktop app for managing skills.sh skills. React 18 + TypeScript + Tailwind CSS v4.

---

## Commands

```bash
# Testing
bun run test                 # Run all tests
bun run test <file>          # Run single test file

# Build
bun run tauri build --target universal-apple-darwin  # macOS
bun run tauri build --target x86_64-pc-windows-msvc  # Windows
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
