# LLMint Semantic Repair Patch Schema

API repair is optional. It should receive only a narrow diagnostic packet and return structured patches. The deterministic engine must validate every patch before presenting a diff.

## Request shape

```json
{
  "ruleId": "LLM007",
  "severity": "error",
  "confidence": 0.86,
  "file": "CLAUDE.md",
  "span": { "startLine": 42, "endLine": 49 },
  "diagnostic": "Conflicting package manager instructions",
  "workspaceFacts": {
    "packageManager": "pnpm",
    "lockfiles": ["pnpm-lock.yaml"],
    "scripts": ["dev", "test", "lint"]
  },
  "allowedEditRanges": [
    { "file": "CLAUDE.md", "startLine": 42, "endLine": 49 }
  ],
  "redaction": "secrets-and-home-paths-redacted"
}
```

## Response shape

```json
{
  "ok": true,
  "summary": "Replace npm instruction with pnpm instruction matching repo lockfile.",
  "patches": [
    {
      "file": "CLAUDE.md",
      "startLine": 44,
      "endLine": 44,
      "replacement": "- Use `pnpm install` and `pnpm test`; do not use npm or yarn in this repository."
    }
  ],
  "requiresHumanReview": false,
  "notes": []
}
```

## Validation gates

1. Patch touches only allowed ranges.
2. Markdown still parses.
3. YAML frontmatter still parses.
4. Mermaid/code fences still validate when present.
5. Deterministic diagnostics improve or remain explainably unchanged.
6. Diff is shown before application.
