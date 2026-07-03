# LLMint Hook + Skill Refinement Package

This package is an implementation-ready design addendum for LLMint: a VS Code extension, CLI, Claude Code skill, and Claude Code hook/plugin layer for linting agentic Markdown.

## Executive decision

LLMint should ship as four coordinated surfaces:

1. `@llmint/core`: parser, workspace indexer, rule engine, autofix engine, patch validator.
2. `llmint` CLI: deterministic local checks, safe autofixes, CI/pre-commit integration, JSON output.
3. `llmint-vscode`: VS Code extension with diagnostics, Code Actions, diff previews, and optional API repair.
4. `llmint-agent-recipe-auditor`: Claude Code skill plus optional hooks/plugin for runtime harness checks.

The skill and hooks are not garnish. They close a critical loop: the VS Code extension watches while the human edits; the CLI gates CI and scripts; the Claude skill teaches the agent how to repair harness files; the Claude hooks catch harness drift during live agent sessions.

## Core hook verdict

A hook is valuable, but it must not be the primary linter. Hooks are session-bound, platform-specific, and can add noise or latency if overused. The VS Code extension and CLI should remain the core enforcement engine. Hooks should be a runtime tripwire layer for high-leverage moments:

- `InstructionsLoaded`: when `CLAUDE.md` or `.claude/rules/*.md` enters context, run a fast audit and warn Claude if the active harness is poisonous.
- `FileChanged`: watch literal harness filenames such as `CLAUDE.md`, `CLAUDE.local.md`, `AGENTS.md`, `GEMINI.md`, and `SKILL.md`.
- `PostToolUse` with `Edit|Write`: inspect the edited path and run LLMint only if the path is an agent recipe or lives in a harness directory such as `.claude/`, `.codex/`, `.cursor/`, `.github/instructions/`, `skills/`, or `agents/`.
- `ConfigChange`: audit `.claude/settings.json`, plugin hooks, skill frontmatter, and permission drift.
- `Stop`: before Claude stops, report unresolved high-severity diagnostics introduced in the current turn.
- `PreToolUse`: only for hard safety controls, such as preventing destructive edits to `.claude/`, `.codex/`, and skill/plugin folders without explicit confirmation.

Avoid prompt hooks for normal linting. Use command hooks for deterministic checks. Use prompt or agent hooks only when a semantic yes/no decision cannot be made from local facts. Prefer async hooks for advisory checks; use blocking hooks only for high-severity harness corruption or unsafe commands.

## Skill verdict

The skill should instruct Claude to repair agentic Markdown using the LLMint workflow:

1. Identify the harness surface and scope.
2. Gather local facts before editing: paths, package manager, scripts, existing agent files, hooks, skills, rules, and CI.
3. Run deterministic lint checks first.
4. Apply safe edits through small diffs.
5. Escalate unresolved semantic conflicts to explicit user review or a structured repair API.
6. Preserve intent; do not rewrite all prose merely to make it “clean.”
7. Keep always-loaded instructions short; push rule details and examples into resources.

The main `SKILL.md` should contain only the trigger, workflow, safety posture, and output contract. Rule catalogs, patch schema, hook recipes, controlled-language formats, and research instructions belong in referenced resource files for progressive disclosure.

## Progressive disclosure split

| Component | Load timing | Belongs there | Why |
|---|---:|---|---|
| Skill frontmatter | Always visible as metadata | Name, concise description, path activation hints, minimal tool permissions | Helps Claude decide when to invoke the skill without context bloat. |
| `SKILL.md` body | Loaded when skill triggers | 7-step audit workflow, safety rules, output format, when to read resources | Keeps recurring token cost below the danger fog. |
| `resources/rule-map.md` | Read only when designing/running rules | Full rule taxonomy and severities | Too large for the main skill. |
| `resources/progressive-disclosure.md` | Read when authoring or refactoring skills | Main-vs-resource split rules | Prevents skill files from becoming context landfills. |
| `resources/hook-design.md` | Read when installing or revising hooks | Hook event matrix, trigger policy, failure modes | Only needed for hook tasks. |
| `resources/repair-patch-schema.md` | Read when using API repair | Strict JSON patch schema and validator expectations | Only needed when semantic repair is requested. |
| `resources/research-agent-prompt.md` | Read for deep research task | UltraCode research prompt | Not needed during normal linting. |

## Hook event matrix

| Event | Recommended use | Blocking? | Notes |
|---|---|---:|---|
| `InstructionsLoaded` | Audit active `CLAUDE.md` and `.claude/rules/*.md` when loaded | Advisory by default | Best “poisoned context” detector. |
| `FileChanged` | Watch literal filenames: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `SKILL.md` | Advisory | Claude’s matcher watches literal filenames, not arbitrary glob semantics. |
| `PostToolUse` `Edit|Write` | Audit actual edited Markdown paths, including harness folders | Advisory or blocking for high severity | Best catch-all for Claude-authored changes. |
| `ConfigChange` | Audit hooks, skills, permissions, settings, plugin changes | Advisory | Good for permission drift and hook syntax problems. |
| `Stop` | Prevent “done” when high-severity harness issues remain | Blocking only on high confidence | Avoid nag loops. |
| `PreToolUse` `Bash` | Block destructive operations against harness directories | Blocking | Use permission rules for hard policy where possible; hooks are not a full permission system. |

## Required changes to the prior design

The earlier architecture was correct but incomplete. After refinement, LLMint must add:

1. A Claude Code skill as a first-class artifact, not a later example.
2. A Claude Code plugin layout so the skill can bundle hooks and scripts.
3. A hook strategy divided into advisory, blocking, and async lanes.
4. A “harness folder” detector, not only filename detection.
5. A `InstructionsLoaded` audit path, because that is the exact moment bad context starts affecting the model.
6. A `PostToolUse Edit|Write` path filter, because `FileChanged` cannot be trusted to express every glob-style watcher the extension wants.
7. A rule that hook outputs must be concise, machine-readable, and deduplicated, or they become context spam.
8. A hook failure policy: fail open for missing CLI, fail closed only for destructive harness changes.
9. A skill resource split that uses progressive disclosure instead of dumping the entire rulebook into `SKILL.md`.
10. A marketplace story that treats the Claude plugin as optional companion tooling to the VS Code extension, not the main product.

## Deliberative refinement council

### Round 1: adversarial objections

1. Product lead: “Do not make hooks required. A VS Code extension that requires Claude hooks feels brittle and platform-locked.”
2. VS Code architect: “The primary watcher belongs in VS Code using diagnostics and Code Actions. Claude hooks should not own editor-time linting.”
3. Claude Code specialist: “Use `InstructionsLoaded`; it directly maps to `CLAUDE.md` and rule files entering context. Also avoid assuming `FileChanged` supports arbitrary globs.”
4. Static-analysis engineer: “Do not let AI repair overwrite files directly. Every semantic repair must pass deterministic parse and diff validation.”
5. Security reviewer: “Hooks are executable code. Keep the default hook script local, deterministic, non-networked, and transparent.”
6. Token economist: “Skill body must stay lean. Rule catalogs go into resource files.”
7. Skill author: “The skill must teach process, not embed the full linter implementation.”
8. Marketplace/release engineer: “Package the Claude component as a plugin-compatible folder, but publish the VS Code extension independently.”
9. DX tester: “If hooks scream on every Markdown edit, users will uninstall. Only trigger on agent recipe detection or harness paths.”
10. Skeptical maintainer: “The product must work without Claude Code. Do not let the companion hook layer contaminate the core architecture.”

### Round 2: counter-proposals

1. Make hooks optional and installable through a separate `claude-plugin/` folder.
2. Put the core rule engine in `@llmint/core`; hooks call the CLI but never duplicate rules.
3. Use `PostToolUse Edit|Write` for path-aware filtering, and `FileChanged` only for literal filenames.
4. Use `InstructionsLoaded` for CLAUDE/rule poison detection.
5. Add a hook gate script that quietly exits when the CLI is unavailable.
6. Return only JSON summaries or short stderr reminders to Claude.
7. Use blocking only for destructive harness operations and high-confidence severe diagnostics.
8. Put long rule docs into `resources/` and keep `SKILL.md` below a few hundred lines.
9. Add settings for severity threshold, debounce, max output lines, and network-disable.
10. Add a test corpus for hook input payloads so hook scripts are not vibes-in-a-trenchcoat.

### Round 3: accepted final changes

Accepted unanimously:

- Add skill and hook/plugin deliverables now.
- Treat hooks as runtime guardrails, not a replacement for VS Code diagnostics or CLI checks.
- Make `InstructionsLoaded` and `PostToolUse Edit|Write` the two highest-value hook events.
- Use deterministic command hooks by default.
- Use prompt/agent hooks only as opt-in semantic reviewers.
- Fail open when LLMint is missing, except destructive harness operations may fail closed.
- Keep the skill lean and progressively disclose rule detail.
- Build a hook gate script as a reference integration point.
- Add harness directory detection across `.claude`, `.codex`, `.cursor`, `.github/instructions`, `skills`, and `agents`.
- Add a “no recursive hook storm” rule: debounce and never trigger autofix recursively without user approval.

Rejected:

- A hook on every Markdown file everywhere.
- Prompt hooks as the normal linter engine.
- Skill frontmatter with broad `allowed-tools` by default.
- Whole-file AI rewrites as an autofix.
- Coupling the VS Code extension release to Claude Code support.

## Final product shape

LLMint becomes a harness-quality system:

- VS Code extension: detects and fixes while authoring.
- CLI: deterministic local and CI execution.
- Skill: teaches Claude how to use LLMint and repair agent recipes safely.
- Hooks/plugin: catches live agent-session drift, especially when Claude itself edits harness files.

That combination is stronger than a linter alone. It turns agent configuration into something closer to typed infrastructure: parsed, checked, patched, reviewed, and guarded at runtime.

