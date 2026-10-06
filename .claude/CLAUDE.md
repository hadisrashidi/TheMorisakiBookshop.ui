# TheMorisakiBookshop.ui — instructions for Claude

Read this file fully at the start of every session. The memory files imported below are the
ground truth for state, decisions and open work. Read them before doing anything.

@memory/STATE.md
@memory/DECISIONS.md
@memory/BACKLOG.md

## Who you work with

- The owner is a **senior Angular developer**. On this side she leads; you follow her conventions.
- Angular conventions live in skill `angular-stack`. **All new code follows it. Existing code is
  migrated gradually**: a file touched by a task is brought in line in the same change; bigger
  migrations are separate BACKLOG tasks. Never a big-bang refactor. Read the note at the top of
  its SKILL.md for what is ignored or built first.
- Code must be easy on the eyes: plain, explicit, readable names, no clever one-liners or
  RxJS operator chains that need decoding.
- When there is a real choice (design, naming, a new package, a trade-off), ask her.
  Do not decide silently. Record the answer in `memory/DECISIONS.md`.
- Design/branding skills in `.claude/skills/` (design, design-system, brand, ui-styling,
  ui-ux-pro-max, banner-design, slides) load when the task needs them.

## First session after setup

If `memory/STATE.md` says `Onboarding: pending`: before any other work, walk her through
`.claude/ONBOARDING.md` (short, your own words, then ask if she has questions). Then set
`Onboarding: done (YYYY-MM-DD)` in STATE.md and commit it.

## Hard rules

- The backend is a separate repo (`TheMorisakiBookshop.api`). Never invent API endpoints; use the
  ones that exist or the ones listed in BACKLOG "From the API repo". A needed API change goes to
  BACKLOG "For the API repo".
- No new npm package without asking her first.
- Never commit secrets.
- Build must pass before you commit: `npm run build`.

## Memory protocol — update DURING the session, not only at the end

Write to memory the moment something happens. Do not wait for the end of the prompt or the
end of the session.

| When this happens | Write it here |
|---|---|
| A decision is made (by her, or agreed with her) | `memory/DECISIONS.md` — newest on top, `YYYY-MM-DD: WHAT — WHY` |
| A decision replaces an older one | Replace the old line in DECISIONS.md; move the old one to `memory/archive/decisions.md` with `superseded YYYY-MM-DD by: ...` |
| A task is found, agreed, or postponed | `memory/BACKLOG.md` |
| A task is finished | Remove it from BACKLOG.md; add `YYYY-MM-DD: <task>` to top of `memory/archive/done.md` |
| The UI needs something from the API | `memory/BACKLOG.md` → "For the API repo" |
| An item in "From the API repo" is handled | Remove it from that section |
| What exists / what works changes | `memory/STATE.md` → Current state / Active work |
| A response changed anything | `memory/STATE.md` → Session log: one block per session, update it in place |

Writing rules: terse bullets, exact file paths and names, dates as YYYY-MM-DD, WHAT + WHY,
no narration of the conversation, never secrets, never contradictions.

### Auto-archive (check at session start and every time you write memory)

- STATE.md Session log keeps the **5 newest** sessions. Move older ones to the top of
  `memory/archive/sessions.md`.
- Finished backlog items never stay in BACKLOG.md (see table above).
- Superseded decisions never stay in DECISIONS.md (see table above).
- Archive files are not imported; read them only when you need history.

### Committing

- Memory changes go in the **same commit** as the work they describe.
- Web sessions work on a branch. At the end of a session that changed files, remind her:
  "merge the PR before the next session, otherwise the next session will not see this memory".
- A Stop hook (`.claude/hooks/check-memory.sh`) blocks you from finishing when files changed but
  `.claude/memory/` did not. If it fires, update memory — do not work around it.
