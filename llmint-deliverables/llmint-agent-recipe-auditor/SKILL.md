---
name: llmint-agent-recipe-auditor
description: Audit, repair, and improve agentic Markdown such as AGENTS.md, CLAUDE.md, GEMINI.md, SKILL.md, .cursor/rules/*.mdc, Copilot instructions, hooks, and agent skill files. Use when writing, editing, reviewing, migrating, or debugging agent harness instructions.
when_to_use: Use for agent recipes, prompt manuals, coding-agent harness files, Claude Code skills/hooks/plugins, Codex AGENTS.md files, Cursor rules, Copilot instructions, Gemini context files, and Markdown that controls LLM agent behavior.
argument-hint: "[file-or-folder] [audit|fix|migrate|explain|install-hooks]"
allowed-tools: Read Glob Grep
---

# LLMint Agent Recipe Auditor

Use this skill to audit and improve Markdown that controls coding agents. Treat these files as semi-code: they shape tool use, project behavior, safety, token cost, and agent reliability.

## Operating rules

1. Identify the harness surface before editing: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `SKILL.md`, `.mdc`, Copilot instructions, hooks, plugin files, or generic prompt Markdown.
2. Gather local facts first: package manager, scripts, repo layout, existing agent files, harness directories, hooks, skills, CI, and referenced paths.
3. Prefer deterministic checks and small patches. Do not rewrite the whole file unless explicitly requested.
4. Preserve user intent. Improve structure, specificity, scope, safety, and token efficiency without laundering the author’s voice into generic AI paste.
5. Separate always-on rules from procedural workflows. Move long procedures into skills or referenced resources when possible.
6. Escalate unresolved conflicts to the user or a structured repair API. Do not silently adjudicate mutually exclusive requirements.
7. Present a diff-oriented answer: what changed, why, what remains, and which issues require human judgment.

## Quick audit workflow

1. Locate candidate files.
2. Classify each file as global memory, project instruction, path-scoped rule, skill, hook config, plugin config, or prompt fragment.
3. Check frontmatter and schema validity.
4. Validate paths, commands, package-manager assumptions, code fences, Mermaid diagrams, imports, and hook references.
5. Detect conflicts, context bloat, skill leakage, lint leakage, overbroad activation, stale instructions, missing safety policy, and token sludge.
6. Apply only safe fixes automatically.
7. Report remaining semantic diagnostics with severity, confidence, affected span, and recommended next action.

## When to read supporting resources

- Read `resources/rule-map.md` when you need the full rule taxonomy.
- Read `resources/hook-design.md` when installing or auditing Claude Code hooks.
- Read `resources/progressive-disclosure.md` when deciding what belongs in `SKILL.md` versus resources.
- Read `resources/repair-patch-schema.md` when preparing an API-based semantic repair request.
- Read `resources/research-agent-prompt.md` when asked to launch a deep research/build planning task for the full LLMint product.

## Output contract

Return results in this order:

1. Harness classification.
2. High-risk findings.
3. Safe fixes applied or proposed.
4. Diff summary.
5. Remaining decisions for the user.
6. Next validation command.

Use concise diagnostic IDs where possible, for example `LLM004 stale-path-reference` or `LLM017 malformed-mermaid-block`.
