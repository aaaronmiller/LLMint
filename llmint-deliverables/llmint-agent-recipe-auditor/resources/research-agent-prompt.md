<!--
---
purpose: "UltraCode max-effort research task for LLMint hook, skill, and VS Code extension implementation"
mode: "research-first"
---
-->

You are UltraCode operating at maximum effort. Research and produce the complete implementation dossier for LLMint: a VS Code extension, CLI, Claude Code skill, and optional Claude Code plugin/hook layer for linting and repairing agentic Markdown.

Research official docs first:

1. VS Code extension API: diagnostics, Code Actions, FileSystemWatcher, text document events, language server architecture, publishing, marketplace security, web extension constraints.
2. Claude Code: skills, SKILL.md frontmatter, progressive disclosure, hooks, hook events, plugin structure, CLAUDE.md memory, path-scoped rules, permissions, workspace trust.
3. OpenAI Codex: AGENTS.md discovery, precedence, nesting, size limits, and fallback filenames.
4. GitHub Copilot: custom instructions and path-scoped instruction files.
5. Cursor: `.mdc` rules, frontmatter, globs, always-apply behavior, legacy `.cursorrules` migration.
6. Gemini CLI: `GEMINI.md` memory/context discovery and precedence.

Research existing tools by rule family:

- Markdown linting and fixing.
- Prose linting and style rules.
- Prompt linting.
- Agent context linting.
- AI-writing-tell detection.
- YAML/frontmatter validation.
- Mermaid validation.
- Secret scanning.
- Prompt injection detection.
- Prompt evals.
- Skill security scanners or studies.

For each source, record URL, license, current version or date, rule model, fix model, useful APIs, and whether code can be reused or only studied.

Design deliverables:

1. Final package architecture with `@llmint/core`, `llmint` CLI, `llmint-vscode`, and `llmint-agent-recipe-auditor` skill/plugin.
2. Hook strategy covering `InstructionsLoaded`, `FileChanged`, `PostToolUse`, `ConfigChange`, `Stop`, and `PreToolUse`.
3. Skill progressive-disclosure layout and exact `SKILL.md` frontmatter.
4. Internal IR for agent recipes.
5. At least 80 rules with IDs, severity, confidence, fixability, examples, and tests.
6. API semantic repair protocol and local validation gates.
7. Marketplace checklist for VS Code Marketplace and Open VSX.
8. Security and privacy threat model.
9. License compliance plan for reused MIT/Apache/BSD code.
10. Test corpus plan with golden files for AGENTS.md, CLAUDE.md, SKILL.md, `.mdc`, Copilot instructions, hooks, and mixed repos.

Create scratch files:

- scratch/source-log.md
- scratch/rule-taxonomy.md
- scratch/hook-matrix.md
- scratch/skill-design.md
- scratch/vscode-api-notes.md
- scratch/marketplace-notes.md
- scratch/security-threat-model.md
- scratch/license-matrix.md
- scratch/test-corpus-plan.md

Do not implement until the research dossier is complete. Cite every factual claim with URLs. Do not invent APIs, versions, syntax, or marketplace behavior.
