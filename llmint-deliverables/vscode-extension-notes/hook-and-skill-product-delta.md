# Hook and Skill Product Delta for VS Code Extension

## Extension integration points

The VS Code extension should not depend on Claude hooks. It should implement:

- document selector for Markdown, MDX, MDC, JSON, JSONC, YAML where harness context applies;
- path/content autodetection for agent recipes;
- DiagnosticCollection for lint results;
- CodeActionProvider for quick fixes;
- WorkspaceEdit for deterministic patches;
- FileSystemWatcher for repo-wide changes to agent files;
- command palette actions: `LLMint: Check Workspace`, `LLMint: Fix Safe Issues`, `LLMint: Explain Diagnostic`, `LLMint: Install Claude Companion`;
- optional API repair command with explicit outbound-context preview.

## Companion installer

The extension can offer to copy the Claude skill/plugin into `.claude/skills/llmint-agent-recipe-auditor/` and `.claude-plugin/` or provide manual instructions. It should not silently install executable hooks.

## Detection rule

A Markdown file is an agent recipe if path or content matches agent harness signatures. Do not lint ordinary notes with agent-only rules unless the user opts in.

## Hook coordination

If hooks are installed, the hook should call the CLI. The VS Code extension and hooks must share the same `@llmint/core` rule engine to avoid contradictory diagnostics.
