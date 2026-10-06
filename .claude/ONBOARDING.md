# Onboarding — how working with Claude on this repo goes

Claude: explain this to her in the first session after setup, short and in your own words.

## 1. What Claude reads every session
- `.claude/CLAUDE.md` loads automatically and pulls in the memory files, so every session starts
  knowing the state, the decisions and the backlog.
- Skills in `.claude/skills/` load when needed. The design skills are already there.
  `angular-stack` (copied from a friend's skill) is the Angular rulebook: new code follows it,
  old code is converted bit by bit whenever a task touches it. She can change any rule in it.

## 2. The memory files (`.claude/memory/`) — plain markdown, she can edit them too
- `STATE.md` — what exists now, what is in progress, last 5 sessions.
- `DECISIONS.md` — every decision with its reason, so nothing is argued twice.
- `BACKLOG.md` — open tasks, what the API changed ("From the API repo"), what the UI needs from
  the API ("For the API repo"), questions for her.
- `archive/` — old sessions, finished tasks, replaced decisions. Kept, not loaded.
- Claude updates these the moment something is decided or done, not only at the end.
  A Stop hook refuses to let Claude finish if code changed and memory did not.

## 3. One rule for her: merge before the next session
Claude on the web works on a new branch each session and opens a PR. Memory lives in the repo,
so **if the PR is not merged, the next session will not see what happened.**

## 4. Two repos, one app
The API (`TheMorisakiBookshop.api`) is a separate repo with its own `.claude/` and memory.
A session only sees one repo, so contract changes travel by hand: API session writes them under
"For the UI repo", she pastes them into this repo's "From the API repo" (and the other way round).

## 5. Where we start
Build the base pieces the skill expects (`ApiHelperService` etc., BACKLOG task 1), fix the API URL
mismatch, then convert old code gradually.
