# LLMint Claude Code Hook Design

## Hook purpose

Hooks give LLMint runtime coverage during Claude Code sessions. They are not the main linter and should not replace the VS Code extension or CLI.

## Recommended hooks

### InstructionsLoaded

Use when `CLAUDE.md` or `.claude/rules/*.md` is loaded into context. Run a fast audit of the loaded file and return a short warning if high-confidence problems exist.

### FileChanged

Use for literal watch names only: `CLAUDE.md|CLAUDE.local.md|AGENTS.md|GEMINI.md|SKILL.md`. Do not rely on it for complex glob detection.

### PostToolUse Edit|Write

Use this as the broad path-aware hook. The hook script should inspect the changed file path and decide whether it is an agent recipe.

### ConfigChange

Use to audit `.claude/settings.json`, skill frontmatter, hooks, plugin config, and permission drift.

### Stop

Use to prevent Claude from declaring done when high-severity harness diagnostics were introduced during the turn.

### PreToolUse Bash

Use sparingly for destructive command protection around harness folders.

## Failure policy

- Missing `llmint` executable: warn once, then exit 0.
- Low/medium diagnostics: advisory output only.
- High diagnostics: return concise reminder to Claude.
- Destructive harness commands: deny if confidence is high.
- Network repair: never run from a hook unless explicitly enabled.

## Noise controls

- Debounce repeated checks.
- Cap hook output to a small number of diagnostics.
- Deduplicate diagnostics by file/rule/span.
- Never autofix recursively from a hook without explicit user approval.
