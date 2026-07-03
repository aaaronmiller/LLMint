#!/usr/bin/env node
/*
---
purpose: "Claude Code hook gate for LLMint agentic Markdown checks"
runtime: "node"
safety: "Deterministic local command wrapper; no network calls; fails open when llmint is unavailable."
---
*/

const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');

const mode = process.argv[2] || 'unknown';
const input = readJsonFromStdin();
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const candidatePaths = extractCandidatePaths(input, projectDir);
const harnessPaths = candidatePaths.filter((p) => isAgentRecipePath(p));

if (harnessPaths.length === 0 && mode !== 'instructions-loaded' && mode !== 'config-change') {
  process.exit(0);
}

const llmint = resolveExecutable('llmint');
if (!llmint) {
  warnOnce('LLMint CLI not found on PATH. Install the CLI to enable runtime harness audits.');
  process.exit(0);
}

const args = ['check', '--format', 'claude-hook', '--max-diagnostics', '5'];
if (harnessPaths.length > 0) {
  for (const file of unique(harnessPaths)) args.push('--file', file);
} else {
  args.push('--workspace', projectDir, '--changed-harness-only');
}

const result = spawnSync(llmint, args, {
  cwd: projectDir,
  encoding: 'utf8',
  timeout: 18000,
  maxBuffer: 1024 * 128
});

if (result.error) {
  warnOnce(`LLMint hook could not run: ${result.error.message}`);
  process.exit(0);
}

const stdout = trimForClaude(result.stdout || '', 3000);
const stderr = trimForClaude(result.stderr || '', 1200);

if (result.status === 0) {
  if (stdout.trim()) console.log(stdout.trim());
  process.exit(0);
}

const message = stdout.trim() || stderr.trim() || `LLMint found agent harness issues in ${mode}.`;
console.error(message);

// Exit 2 nudges Claude to continue/react on supported events, but avoid hard-denial for ordinary advisory checks.
process.exit(result.status === 2 ? 2 : 0);

function readJsonFromStdin() {
  try {
    const chunks = [];
    const buffer = require('node:fs').readFileSync(0, 'utf8');
    if (!buffer.trim()) return {};
    return JSON.parse(buffer);
  } catch {
    return {};
  }
}

function extractCandidatePaths(payload, root) {
  const out = [];
  const maybe = [
    payload.file_path,
    payload.path,
    payload.filename,
    payload.tool_input && payload.tool_input.file_path,
    payload.tool_input && payload.tool_input.path,
    payload.tool_input && payload.tool_input.notebook_path
  ];
  for (const item of maybe) {
    if (typeof item === 'string' && item.trim()) out.push(toAbs(item, root));
  }
  if (Array.isArray(payload.files)) {
    for (const item of payload.files) {
      if (typeof item === 'string') out.push(toAbs(item, root));
      if (item && typeof item.path === 'string') out.push(toAbs(item.path, root));
    }
  }
  return unique(out);
}

function isAgentRecipePath(file) {
  const normalized = file.split(path.sep).join('/');
  const base = path.basename(file);
  if (/^(AGENTS|CLAUDE|CLAUDE\.local|GEMINI|SKILL)\.md$/i.test(base)) return true;
  if (/\.(prompt|agent|skill)\.md$/i.test(base)) return true;
  if (/\.mdc$/i.test(base)) return true;
  return [
    '/.claude/',
    '/.codex/',
    '/.cursor/',
    '/.github/instructions/',
    '/skills/',
    '/agents/',
    '/hooks/'
  ].some((segment) => normalized.includes(segment)) && /\.(md|mdc|json|jsonc|ya?ml)$/i.test(base);
}

function toAbs(file, root) {
  return path.isAbsolute(file) ? file : path.resolve(root, file);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function resolveExecutable(name) {
  const check = spawnSync(process.platform === 'win32' ? 'where' : 'command', process.platform === 'win32' ? [name] : ['-v', name], {
    shell: process.platform !== 'win32',
    encoding: 'utf8'
  });
  if (check.status !== 0) return null;
  const first = (check.stdout || '').split(/\r?\n/).find(Boolean);
  return first || name;
}

function trimForClaude(text, max) {
  const clean = text.replace(/\u001b\[[0-9;]*m/g, '').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max)}\n[LLMint hook output truncated]`;
}

function warnOnce(message) {
  if (process.env.LLMINT_HOOK_QUIET === '1') return;
  console.error(`[LLMint hook advisory] ${message}`);
}
