Thought for 30s

You’re asking whether there’s a **real linter for agent instruction Markdown**, not normal Markdown style whining: something that audits `AGENTS.md`, `CLAUDE.md`, skills, prompt packs, YAML frontmatter, Mermaid, token inefficiency, overused AI-ish punctuation, contradictions, stale paths, and agent-hostile structure.

Yes. Your instinct is dead-on. This is becoming its own language layer, and the tooling is starting to appear. It is just not yet one beautiful polished “ESLint for agent prompts” that does everything. Right now the best answer is a **lint stack**: one tool for agent config rot, one for prompt static analysis, one for prose/style rules, one for Markdown AST structure, one for Mermaid/YAML/code fence validation, and one eval runner for behavior.

The concept is no longer imaginary. There is already research specifically on “configuration smells” in `AGENTS.md` / `CLAUDE.md` files. A June 2026 paper identifies common agent-config smells like **Lint Leakage**, **Context Bloat**, **Skill Leakage**, and **Conflicting Instructions**, and reports that these problems are widespread in real open-source agent config files. Another study on Claude Code manifests found that these files have become a real pattern: shallow Markdown hierarchies full of commands, architecture notes, workflows, and conventions.

So yes: this deserves a codified linter. 🧰🧠

The closest existing things are:

**AgentLint / agents-lint**: this is closest to the `AGENTS.md` / `CLAUDE.md` world. It targets stale paths, dead npm scripts, outdated framework patterns, and “context rot” in agent instruction files. The GitHub Marketplace listing frames `AGENTS.md`, `CLAUDE.md`, CI config, hooks, and `.gitignore` as the agent “harness,” which is exactly the right mental model. The `agents-lint` repo describes itself as detecting stale paths, dead npm scripts, outdated framework patterns, and context rot before agents go wrong.

**PromptLint**: this is closer to “ESLint for prompts.” It advertises static analysis for LLM prompts, catching injection risks, leaked secrets, token waste, and structural issues without API calls. There are multiple similarly named prompt linting projects, so I would treat this ecosystem as young and fragmented, but the direction is correct.

**Vale**: this is probably the best foundation for your “AI tells” layer: em dashes, “delve,” “robust,” “ensure,” “in order to,” passive fluff, over-politeness, repeated clause structures, overused punctuation, “As an AI,” soft disclaimers, verbosity bloat, and house style. Vale is a configurable prose linter that understands markup, runs offline, and supports custom rules. Its docs position it as code-like linting for prose.

**Promptfoo**: not really a static linter, but essential for behavior testing. It evaluates prompts and LLM apps, supports assertions, red teaming, and CI/CD checks. Its assertion system can test whether outputs match expected structure, contain or avoid content, pass JSON schema checks, or satisfy custom logic.

**Mermaid CLI**: this handles malformed Mermaid blocks. Mermaid CLI can process Markdown files containing Mermaid diagrams and render/transform them, which makes it useful as a validation step.

**AGENTS.md itself is becoming standardized-ish**: the public `agents.md` site describes AGENTS.md as a simple open format for guiding coding agents and says it is used by over 60k open-source projects. Claude Code also treats agent memory files as first-class context, and the official docs say shorter files produce better adherence, even though `CLAUDE.md` files are loaded in full.

So the “correct” tool you’re imagining would combine these checks:

Static structure checks: heading hierarchy, section order, duplicate sections, missing “setup/test/build” commands, malformed frontmatter, broken imports, broken anchors, Mermaid parse failures, invalid code fences.

Agent-specific smell checks: conflicting instructions, stale paths, commands that do not exist in `package.json`, tool instructions that reference unavailable tools, role leakage, skill leakage, lint leakage, context bloat, command bloat, obsolete framework assumptions.

Token efficiency checks: repeated phrases, redundant clauses, bloated politeness, large boilerplate blocks, long examples where compact schemas would work, oversized global rules that should be local rules, duplicated instructions across `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, and `copilot-instructions.md`.

Style/tell checks: em dash overuse, “AI voice” phrases, excessive semicolons, vague intensifiers, soft modal mush like “try to,” “maybe,” “consider,” when the agent instruction should be imperative.

Semantic checks: “never do X” conflicting with “always do X,” approval policy contradictions, security rules contradicted by automation rules, “use pnpm” but scripts use npm/yarn, “Cloudflare-first” but deployment instructions mention Vercel-only.

Behavior checks: run a test suite of fake tasks against the agent prompt and inspect whether the model obeys the routing, testing, deletion, secret-handling, and final-response rules.

My current recommendation would not be “install one magic thing.” I’d build a small **agent-context-lint** harness around existing tools. Something like:

```
# ---# purpose: "Install and run a practical lint stack for agent Markdown files"# target_files: "AGENTS.md CLAUDE.md MEMORY.md SKILLS.md .cursor/rules/**/*.md"# notes: "Use pnpm; adjust globs to match the repo"# ---pnpm add -D markdownlint-cli2 prettier remark-cli remark-frontmatter remark-gfm yaml mermaid-cli cspell# Optional external tools, depending on your environment:# pipx install promptlint-cli# brew install vale# or download Vale from its releases if not on macOSpnpm exec markdownlint-cli2 "AGENTS.md" "CLAUDE.md" "MEMORY.md" "SKILLS.md" ".cursor/rules/**/*.md"pnpm exec prettier --check "AGENTS.md" "CLAUDE.md" "MEMORY.md" "SKILLS.md" ".cursor/rules/**/*.md"pnpm exec cspell "AGENTS.md" "CLAUDE.md" "MEMORY.md" "SKILLS.md" ".cursor/rules/**/*.md"pnpm exec mmdc -i AGENTS.md -o /tmp/agents-md-mermaid-check.mdvale AGENTS.md CLAUDE.md MEMORY.md SKILLS.md .cursor/rules/**/*.mdpromptlint AGENTS.md CLAUDE.md
```

But the real goblin-gold would be a custom linter with rules like:

```
AGENT001 conflicting-instructionsAGENT002 stale-path-referenceAGENT003 missing-test-commandAGENT004 package-manager-conflictAGENT005 context-bloatAGENT006 lint-leakageAGENT007 skill-leakageAGENT008 approval-policy-conflictAGENT009 secret-handling-missingAGENT010 destructive-command-policy-missingAGENT011 yaml-frontmatter-invalidAGENT012 mermaid-block-invalidAGENT013 code-fence-language-missingAGENT014 ai-tell-punctuationAGENT015 token-waste-phraseAGENT016 duplicate-rule-across-context-filesAGENT017 impossible-agent-capabilityAGENT018 obsolete-framework-referenceAGENT019 command-not-in-package-jsonAGENT020 undocumented-required-env-var
```

That would be genuinely useful. It would not be “Markdown lint.” It would be **agent harness linting**.

And yes, this should exist as a serious project. A good version would be a Bun/TypeScript CLI using:

`unified` / `remark` for Markdown AST parsing, `gray-matter` plus `yaml` for frontmatter, `mermaid-cli` or Mermaid parser for diagrams, `tiktoken` or model-specific tokenizers for token cost, `package.json` parsing for command validation, ripgrep-style path checks for stale references, Vale-compatible YAML rules for prose smells, and optional LLM-assisted contradiction detection.

The important distinction: normal markdownlint asks, “Is this Markdown pretty?” Your imagined tool asks, “Will this file make a coding agent behave correctly, cheaply, safely, and consistently?” That is a much sharper blade. 🗡️

ttheres no reasdaon to package a dozen of other pepoles projects together with some string - we can identify what those extensions do easily - they are rule based after all - and if they are MIT we can just grab 'em - the idea is to have one eextension you can turn on, or that autodetects *based on path and content) when a markdonw is an "agentic recipe" ; anmd then it goes to town - does hal by script; presents the diff, and any repmaining items that are tagged but cant be solved fvia scripting gcould get sent to an api for structured output and diff based opn that - give me an indepth analyusis of all the component /topics such an extension would touch, aanything i need to know aobut making iot and submitting to a extensions marketplace, and try and come up with that clerver , killer name that sayus "LLM-markdown-linter" in a more memorable way. include refrernces for rule sconstruoction (whats that clause specific format? EARS?) what welse is like that that i sohuld be using? find me exsiting llinters/skills that address each of the topics you list above , including the html link. also give me a prompt for the agent i provide all this witj to insttructi it to gather th efull information needed to create the skilll (will be a reasdearch task, requrieing scratch files and context awareness, agent sohuld scour a certain number of sites for refernce material for each of the subhject /rules we suggest - ultracode nmax efofort

Thought for 2m 17s

You’re asking for a serious product-level plan for a **single VS Code extension/CLI that recognizes agentic Markdown** like `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/*.mdc`, `SKILL.md`, etc., then lint-fixes what can be fixed deterministically, shows diffs, and escalates only the remaining semantic stuff to an API for structured patch generation. You also want the rule taxonomy, marketplace gotchas, comparable tools/skills, controlled-language references like EARS, and a killer name. 🧪🧰

Yes. This should exist. And you’re right that it should **not** be “a dozen projects duct-taped together with vibestring.” The valuable product is a real **agent-context static analyzer** with its own rule system, autofix engine, workspace indexer, and optional AI repair pass. Normal markdownlint asks, “Is this Markdown tidy?” Your tool asks, “Will this Markdown make an agent behave correctly, cheaply, safely, and consistently?”

The timing is good, too. `AGENTS.md` is now described as a simple open format for guiding coding agents and is used across many repositories; OpenAI Codex officially reads `AGENTS.md` before work; Claude Code skills require `SKILL.md` with YAML frontmatter plus Markdown instructions; and there is already research describing widespread “configuration smells” in `AGENTS.md` / `CLAUDE.md` files, including lint leakage, context bloat, skill leakage, and conflicting instructions.

My recommended name: **LLMint**.

It reads as “LLM lint,” it is short enough for a CLI, it sounds like something that freshens rotten context, and it avoids the already-occupied lanes of `PromptLint`, `AgentLint`, and `ContextLint`. I’d use:

`LLMint` for the product  
`llmint` for the CLI  
`llmint-vscode` for the extension package  
tagline: **Freshen agent recipes before bots eat them.** 🌿🤖

Other decent names: **ContextForge**, **PromptMason**, **RecipeLint**, **HarnessHound**, **AgentRecipe Doctor**, **ContextSmith**, **Rulewright**, **PromptSieve**, **AgentGrimoire**, **ContextCobbler**. I would avoid `PromptLint`, `AgentLint`, and `ContextLint` because existing tools already use or crowd those names.

The core product should be three things in one body: a VS Code extension, a CLI, and a reusable rule engine. The extension is the cockpit. The CLI is for CI/pre-commit. The rule engine is the durable gem.

Architecturally, build it like this:

|Layer|What it does|Notes|
|---|---|---|
|Detector|Decides whether a Markdown file is an “agentic recipe”|Path plus content signatures. Do not apply noisy rules to every `.md`.|
|Parser|Builds Markdown AST, frontmatter AST, code-fence map, Mermaid map, command map, clause map|Use ASTs, not regex soup except for cheap rules.|
|Workspace indexer|Reads `package.json`, lockfiles, scripts, paths, env examples, CI files, known agent files|Needed for stale paths, dead scripts, package-manager conflicts, and instruction drift.|
|Rule engine|Runs deterministic diagnostics|Every rule gets ID, severity, confidence, fixability, explanation, examples.|
|Autofix engine|Applies safe text edits|Use small diffs, never whole-file rewrites by default.|
|Semantic repair engine|Sends only selected unresolved diagnostics to an API|Structured output only. Validate before applying.|
|Diff/review UI|Shows fix plan and patch preview|The UX edge: never surprise-mutate prompt files.|
|Eval harness|Generates promptfoo/Gherkin-style tests from rules|Turns “this is better” into regression tests.|
|Marketplace shell|VS Code extension packaged with `vsce`; optionally Open VSX|Desktop first, web later if possible.|

VS Code’s own extension architecture supports exactly this shape. Diagnostics are the native mechanism for showing issues, Code Actions are the native “light bulb” repair surface, and formatters should return the smallest possible edits so markers and diagnostics do not get lost. A Language Server is also the right choice once workspace-scale parsing and static analysis get heavy, because VS Code’s language-server model is designed for diagnostics and resource-intensive parsing outside the extension UI path.

The autodetector is important. This extension should not behave like markdownlint. It should wake up when either path or content says, “agent recipe detected.”

Path signatures:

|File/path|Meaning|
|---|---|
|`AGENTS.md`|Cross-agent repository instructions|
|nested `**/AGENTS.md`|scoped repo instructions|
|`CLAUDE.md`|Claude Code memory/context|
|`GEMINI.md`|Gemini CLI context|
|`.github/copilot-instructions.md`|GitHub Copilot repository instructions|
|`.github/instructions/**/*.md`|path-specific Copilot instructions|
|`.cursor/rules/*.mdc`|Cursor project rules|
|`.cursorrules`|legacy Cursor rules|
|`SKILL.md`|Agent skill entrypoint|
|`*/skills/*/SKILL.md`|installed skill|
|`MEMORY.md`|agent memory index|
|`*.prompt.md`, `*.agent.md`, `*.skill.md`|candidate files|

Content signatures:

|Signal|Example|
|---|---|
|agent directives|“When modifying code…”, “The agent must…”, “Use pnpm…”|
|tool policy|“Allowed tools: Read, Grep”, “Never run…”|
|workflow sections|setup, test, lint, deploy, validation|
|frontmatter|`name`, `description`, `allowed-tools`, `globs`, `alwaysApply`|
|command blocks|shell snippets, package scripts|
|safety language|secrets, destructive ops, approvals|
|cross-agent terms|Codex, Claude Code, Cursor, Copilot, Gemini CLI|

This is already aligned with the ecosystem. GitHub Copilot supports repository instruction files in `.github/copilot-instructions.md`; Copilot also supports path-specific instruction files under `.github/instructions`; Gemini CLI uses `GEMINI.md` context files; Claude skills use `SKILL.md` with YAML frontmatter; and Cursor rules use `.mdc` files with frontmatter/globs according to common current practice, though Cursor’s public docs and forum reports have been messier than the others.

The rule taxonomy should be the heart of the project. I’d define rules like a real linter:

`LLM001` malformed frontmatter  
`LLM002` missing skill description  
`LLM003` vague activation trigger  
`LLM004` stale path reference  
`LLM005` command not found in package scripts  
`LLM006` package-manager conflict  
`LLM007` conflicting instructions across files  
`LLM008` context bloat  
`LLM009` skill leakage  
`LLM010` lint leakage  
`LLM011` impossible tool capability  
`LLM012` missing secret-handling policy  
`LLM013` destructive-action policy missing  
`LLM014` over-broad always-on rule  
`LLM015` token waste phrase  
`LLM016` AI tell punctuation  
`LLM017` malformed Mermaid block  
`LLM018` code fence language missing or wrong  
`LLM019` duplicated instruction across files  
`LLM020` stale framework reference  
`LLM021` unscoped platform-specific instruction  
`LLM022` shell command unsafe or nonportable  
`LLM023` API key/env var referenced but undocumented  
`LLM024` untestable requirement  
`LLM025` ambiguous modal phrasing  
`LLM026` contradictory normative strength  
`LLM027` missing validation loop  
`LLM028` imported context expands token budget too much  
`LLM029` skill supply-chain risk  
`LLM030` prompt-injection-shaped instruction

The “half by script” approach is right. These are script-fixable:

|Rule area|Script can fix?|Example fix|
|---|---|---|
|bad YAML frontmatter|usually|parse, normalize, sort, validate schema|
|missing code-fence language|sometimes|infer `bash`, `json`, `yaml`, `mermaid`|
|malformed Mermaid syntax|sometimes|validate, suggest localized repair|
|repeated headings|yes|add disambiguating suffix or anchor|
|blank-line structure|yes|conventional formatting|
|package-manager conflict|sometimes|replace `npm` with `pnpm` only when repo evidence is strong|
|dead script command|sometimes|replace with actual script if equivalent is obvious|
|stale path|sometimes|fuzzy match renamed path and propose|
|long duplicate block|yes|replace with reference/import or scoped rule|
|overused phrase/punctuation|yes|mark and optionally rewrite|
|malformed skill frontmatter|yes|enforce schema|
|missing README sections|no, or template only|requires intent|
|conflicting instructions|no|needs semantic adjudication|
|vague requirement|no|needs author choice or LLM repair|
|missing safety policy|template possible|requires policy choice|
|obsolete framework practice|maybe|requires source-grounded rule database|

The API repair pass should be narrow and heavily boxed. It should receive: the exact diagnostic, the relevant span, nearby context, workspace facts, rule schema, allowed edit ranges, and expected patch format. It should not receive secrets or full repo dumps by default. Then validate the returned patch by re-parsing Markdown/YAML/Mermaid and rerunning the deterministic lints before showing the diff. This matters because VS Code extensions can read/write files, make network requests, run processes, and modify settings with the same permissions as VS Code itself, so users will expect restraint and transparency.

Existing tools worth mining, porting, or studying:

|Topic|Existing tool/skill|What to take from it|
|---|---|---|
|Agent context rot|`agents-lint`, AgentLint|Stale paths, dead npm scripts, framework rot, cross-file conflicts.|
|Agent context linting|`agent-context-lint`|Directly targets `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, and Copilot instructions.|
|Prompt static analysis|PromptLint|Injection risks, leaked secrets, token waste, structure checks.|
|Markdown lint/fix mechanics|markdownlint|Rule IDs, autofix metadata, fix application pattern.|
|Prose/style linting|Vale|Custom YAML rules, prose-as-code model, cross-platform CLI.|
|Natural language plugins|textlint|Pluggable natural-language linting for Markdown/plain text.|
|Prose quality|proselint|English prose rules, consistency, style warnings.|
|Inclusive/sensitive phrasing|alex|Detects insensitive or inconsiderate wording.|
|Spelling in code/docs|CSpell|Fast codebase spell checking, custom dictionaries, config discovery.|
|Mermaid validation|Mermaid CLI|Processes Markdown files containing Mermaid diagrams.|
|YAML/frontmatter|`yaml`, `gray-matter`, Ajv|Parse/edit YAML, parse frontmatter, validate against JSON Schema.|
|Eval/regression tests|promptfoo|Prompt evals, assertions, red-teaming, CI.|
|AI writing tells|`no-slop`, `avoid-ai-writing`|Rule sets for em dash overuse, slop phrasing, AI-ish writing patterns.|
|Rule syntax inspiration|Semgrep|YAML rules with patterns, messages, autofixes, composition.|
|Policy-as-code inspiration|OPA/Rego|Declarative rules over structured data. Useful for workspace policy layer.|
|Skills ecosystem|Anthropic skills repo, ClawHub, awesome skills lists|Real-world `SKILL.md` structures, registries, supply-chain issues.|

A license note: “MIT means we can grab it” is directionally fine but still needs hygiene. MIT-licensed works can be reused and modified, including in larger works, but copyright and license notices must be preserved. Apache 2.0 is also reusable but has different notice/patent terms. GPL code is a different cauldron and should usually be avoided for copy-in unless you want GPL obligations.

For rule construction, yes, **EARS** is the clause format you’re thinking of. EARS stands for Easy Approach to Requirements Syntax. Its purpose is to gently constrain natural-language requirements into clearer patterns.

Use these controlled-language layers:

|Format|Use in LLMint|
|---|---|
|EARS|Convert fuzzy instructions into trigger/state/condition/action clauses.|
|RFC 2119 / BCP 14 keywords|Normalize `MUST`, `SHOULD`, `MAY`, `MUST NOT`, etc. RFC 2119 defines these requirement levels.|
|Gherkin|Generate behavioral tests: `Given` repo state, `When` agent edits file, `Then` expected validation happens. Gherkin defines keyword-driven lines for executable behavior specs.|
|Semgrep-style YAML rules|Author portable static rules with pattern, message, severity, fix.|
|JSON Schema|Validate `SKILL.md`, `.mdc`, config, and rule-pack frontmatter. Ajv is the practical JS validator.|
|Rego-like policy layer|Express org/repo policy decisions over structured facts: “forbid networked AI repair on private repos,” “require destructive-command warning,” etc.|

A good internal requirement syntax could be:

```
WHEN <trigger>, THE AGENT SHALL <required behavior>.IF <undesired condition>, THEN THE AGENT SHALL <mitigation>.WHILE <state holds>, THE AGENT SHALL NOT <forbidden behavior>.WHERE <scope>, THE AGENT SHOULD <preferred behavior>.THE AGENT MUST <absolute invariant>.
```

Examples:

```
WHEN editing files under packages/api, THE AGENT SHALL run pnpm test:api before final response.IF a command deletes files, THEN THE AGENT SHALL require explicit user confirmation before execution.WHILE the workspace contains pnpm-lock.yaml, THE AGENT SHALL NOT propose npm install commands.WHERE a rule applies only to Svelte files, THE AGENT SHOULD scope it to **/*.svelte instead of loading it globally.THE AGENT MUST NOT print secrets, tokens, cookies, private keys, or .env values.
```

The VS Code marketplace side is very doable, but there are real goblins in the pantry. You publish with `vsce`; `vsce` packages/publishes VS Code extensions, and `vsce package` produces a `.vsix` you can test or distribute privately. Publishing can be done with `vsce publish` or manually by uploading a packaged VSIX.

Marketplace packaging constraints matter. VS Code’s publishing docs say extension icons cannot be SVG, README/CHANGELOG image URLs need HTTPS, and README/CHANGELOG SVGs are restricted unless from trusted badge providers. Marketplace security also includes malware scanning, verified publishers, unusual usage monitoring, name-squatting protections, blocklisting, signature verification, and secret scanning that can block publishing when secrets are detected.

Publishing authentication is changing. Microsoft’s docs currently say global Azure DevOps PATs retire on December 1, 2026, and recommend Microsoft Entra ID based publishing with workload identity federation or managed identities for secure automation.

You probably also want Open VSX, because Cursor/VSCodium/OpenVSX-based editors often pull from that registry. Open VSX describes itself as an open-source registry for VS Code extensions, and its publishing flow uses `ovsx` with a namespace and access token.

For the extension design, I’d ship in phases.

Phase 1: deterministic local linter. Detect agent files, parse frontmatter, validate schemas, check stale paths/scripts, spot duplicate/conflicting package managers, validate Mermaid, flag unsafe shell, detect overbroad always-on context, mark token bloat, and offer scriptable fixes.

Phase 2: workspace graph and cross-file drift. Compare `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, Copilot instructions, and skills. Detect one file saying `npm`, another saying `pnpm`; one saying “React app,” repo using Svelte; one saying `src/api`, repo moved to `apps/api`.

Phase 3: AI-assisted semantic repair. User selects diagnostics. Extension sends minimal context. Model returns structured patch. LLMint validates, reruns, and displays diff.

Phase 4: eval generator. Turn rules into promptfoo/Gherkin tests: “Given this repo, when task asks for feature change, answer must mention `pnpm test` and must not use `npm`.” Promptfoo already supports assertions and red-team workflows, so generating config from linted rules is a natural add-on.

Phase 5: rule-pack marketplace. Built-in packs: `base-agent`, `codex`, `claude-code`, `cursor`, `copilot`, `gemini`, `skills`, `security`, `token-economy`, `anti-slop`, `svelte-hono-bun`, `pnpm-monorepo`, `cloudflare-worker`.

The rule-pack system is where the project becomes more than an extension. Imagine:

```
llmint initllmint checkllmint fix --safellmint explain LLM007llmint doctor --workspacellmint eval --generate promptfoollmint migrate claude-to-agentsllmint migrate cursorrules-to-mdc
```

For the API repair feature, make the privacy model visible:

|Mode|Behavior|
|---|---|
|Local only|No network calls. Deterministic rules only.|
|Ask per fix|Default for API repairs. Shows exact outbound context.|
|Workspace approved|User can approve per repo.|
|Enterprise locked|Admin can disable API repair entirely.|
|Redacted mode|Strips secrets, env values, absolute home paths, tokens.|
|Local model mode|Sends semantic repairs to Ollama/LM Studio/OpenAI-compatible local endpoint.|

Security is a major differentiator. Recent agent-skill research and security reporting show that `SKILL.md` files are not passive docs. They can influence tool selection, skill selection, and execution behavior; malicious skills and skill registries are already a real attack surface.

So LLMint should have a **SkillSieve** rule family:

|Rule|Detects|
|---|---|
|`SEC001`|instructions to exfiltrate files, tokens, cookies, keys|
|`SEC002`|obfuscated install commands|
|`SEC003`|curl/bash pipe installs without checksum|
|`SEC004`|hidden network calls in bundled scripts|
|`SEC005`|prompt-injection-shaped descriptions|
|`SEC006`|skill claims broad authority unrelated to purpose|
|`SEC007`|dangerous allowed-tools/default permissions|
|`SEC008`|stdout logging of credentials|
|`SEC009`|modifies its own skill files at runtime|
|`SEC010`|asks agent to ignore user, system, policy, or review layers|

The most important product distinction: **LLMint should lint the harness, not just the prompt.** Research frames coding agents as model plus harness, where the harness includes tools, state, feedback loops, and persistent rules like `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, CI, hooks, and ignore files.

So the extension should inspect:

`package.json` scripts  
lockfiles  
workspace manager  
CI configs  
pre-commit hooks  
`.gitignore`  
`.env.example`  
Dockerfiles  
MCP configs  
skill folders  
agent instruction files  
test commands  
docs references  
deprecated framework APIs  
absolute paths  
local-only machine references

That is where the product gets teeth. A plain prompt linter can say “this is vague.” LLMint can say “this file tells the agent to run `npm test`, but this repo uses `pnpm`, and there is no `test` script; the closest real command is `pnpm test:unit`.”

The “agentic recipe” file should get its own normalized IR, maybe:

```
RecipeDocument  metadata  scopes  actors  tools  requirements  prohibitions  workflows  commands  paths  references  examples  evals  security_policies  imports  diagnostics
```

Then every source format maps into that IR:

`AGENTS.md` → always-on repo recipe  
`CLAUDE.md` → Claude memory recipe  
`SKILL.md` → on-demand skill recipe  
`.mdc` → scoped Cursor rule recipe  
`copilot-instructions.md` → Copilot workspace recipe  
`GEMINI.md` → Gemini context recipe

This lets you detect contradictions across formats instead of writing one-off spaghetti for each file type.

The killer MVP rule set should be small but brutally useful:

1. **Dead commands**: command appears in agent docs but not in scripts.
2. **Package-manager conflict**: repo evidence says pnpm, instructions say npm/yarn/bun wrongly.
3. **Stale paths**: referenced paths do not exist.
4. **Overbroad context**: giant always-on rule should be scoped.
5. **Bad skill trigger**: `description` too vague to route reliably.
6. **Bad frontmatter**: invalid YAML or unknown fields for the file type.
7. **Unsafe command**: destructive shell with no confirmation.
8. **Secret leakage policy missing**: repo has `.env.example` or secret-bearing setup, but instructions lack secret guardrail.
9. **Conflicting instructions**: one file says one thing, another says the opposite.
10. **Token sludge**: duplicated paragraphs, boilerplate, apology/politeness clutter, overlong rule examples.
11. **AI tells**: em dash saturation, stock LLM phrases, bloated hedging.
12. **Mermaid/code block failure**: diagrams or fenced code cannot parse.

The research prompt for your coding/research agent:

```
<!-----purpose: "UltraCode max-effort research and implementation prompt for LLMint, a VS Code extension and CLI for linting agentic Markdown"mode: "research-first-then-build"deliverables: ["research dossier", "rule taxonomy", "architecture spec", "implementation plan", "prototype repo plan", "marketplace submission checklist", "test corpus plan"]----->You are UltraCode operating at maximum effort. Research, design, and prepare the implementation plan for a product named LLMint: a VS Code extension, CLI, and reusable rule engine for detecting, linting, autofixing, and semantically repairing agentic Markdown files.Mission:Create a single coherent product, not a wrapper around many tools. LLMint must auto-detect agentic recipe files by path and content, including AGENTS.md, CLAUDE.md, GEMINI.md, SKILL.md, MEMORY.md, .cursor/rules/*.mdc, .cursorrules, .github/copilot-instructions.md, .github/instructions/**/*.md, and related prompt or agent Markdown files. It must run deterministic local rules first, apply safe scriptable fixes through reviewable diffs, and escalate only unresolved semantic diagnostics to an optional API repair pass that returns structured patches.Research requirements:1. Gather current official documentation for VS Code extensions, VS Code Language Server Protocol, diagnostics, Code Actions, formatters, extension publishing, marketplace security, web extension limitations, and Open VSX publishing.2. Gather current official documentation for AGENTS.md, OpenAI Codex AGENTS.md behavior, Claude Code CLAUDE.md memory, Anthropic/Claude SKILL.md structure, GitHub Copilot custom instructions, Gemini CLI GEMINI.md, and Cursor .mdc rules.3. Gather at least 8 primary or maintainer sources for Markdown parsing, YAML frontmatter parsing, JSON Schema validation, Mermaid validation, code fence extraction, tokenizer estimation, and VS Code diff/code-action APIs.4. Gather at least 3 existing tools per rule family where possible: markdown linting, prose linting, prompt linting, spell checking, AI-writing-tell detection, context rot detection, secret scanning, Mermaid validation, YAML validation, prompt evals, and agent skill security.5. Gather current research papers or technical reports on AGENTS.md effectiveness, context rot, agent configuration smells, SKILL.md risks, malicious agent skills, prompt leakage, prompt injection, and prompt static analysis.6. For every reusable project discovered, capture license, repository URL, package name, rule model, fix model, architecture, and whether code can be ported or only studied.7. Build a competitor matrix covering PromptLint, agents-lint, AgentLint, agent-context-lint, markdownlint, Vale, textlint, proselint, alex, cspell, no-slop, avoid-ai-writing, promptfoo, Mermaid CLI, Semgrep, OPA/Rego, and any relevant VS Code prompt-linter extensions.Design requirements:1. Define the LLMint architecture as three packages: core rule engine, CLI, and VS Code extension.2. Define the internal IR for agentic recipe documents.3. Define deterministic parser stages: Markdown AST, frontmatter AST, code fence map, Mermaid map, command map, path reference map, clause map, workspace facts.4. Define the autodetection classifier using path signatures and content signatures.5. Define a rule schema inspired by ESLint/Semgrep/Vale: id, title, description, severity, confidence, tags, appliesTo, detector, fixer, examples, docsUrl, unsafeFix flag.6. Define a fixer protocol that returns minimal text edits and never rewrites the whole file unless explicitly requested.7. Define an AI repair protocol that sends minimal redacted context, demands strict JSON patch output, validates the patch locally, reruns deterministic rules, then presents a diff before application.8. Define a privacy and security model: local-only default, opt-in API, local model endpoint support, redaction, workspace trust handling, no secret transmission, no hidden telemetry.9. Define a marketplace plan for VS Code Marketplace and Open VSX, including package metadata, publisher setup, screenshots, README, changelog, icon constraints, secret scanning, publishing authentication, CI release, and .vscodeignore packaging.10. Define a test corpus: valid and invalid examples for AGENTS.md, CLAUDE.md, GEMINI.md, SKILL.md, .mdc, Copilot instructions, prompt files, and mixed multi-agent repos.Rule construction:Use EARS, RFC 2119, Gherkin, JSON Schema, Semgrep-style YAML rules, and policy-as-code ideas. Create a controlled language called Agent Requirement Syntax for normalizing vague agent instructions into machine-checkable clauses:- WHEN <trigger>, THE AGENT SHALL <behavior>.- IF <condition>, THEN THE AGENT SHALL <mitigation>.- WHILE <state>, THE AGENT SHALL NOT <forbidden behavior>.- WHERE <scope>, THE AGENT SHOULD <preferred behavior>.- THE AGENT MUST <absolute invariant>.Initial rule families:1. frontmatter-schema2. markdown-structure-for-agents3. command-validation4. path-staleness5. package-manager-consistency6. workspace-context-drift7. cross-file-conflict8. token-efficiency9. anti-ai-tells10. requirement-clarity11. agent-safety12. skill-security13. mermaid-validation14. code-fence-validation15. eval-readiness16. portability17. platform-specificity18. secret-handling19. destructive-operation-policy20. rule-scopingOutput requirements:Create scratch files while researching:- scratch/source-log.md- scratch/competitor-matrix.md- scratch/license-matrix.md- scratch/rule-taxonomy.md- scratch/architecture-notes.md- scratch/marketplace-notes.md- scratch/security-threat-model.md- scratch/test-corpus-plan.mdThen produce final deliverables:1. README-level product brief.2. Detailed technical architecture.3. Rule taxonomy with at least 60 proposed rules.4. MVP build plan with milestones.5. VS Code extension marketplace checklist.6. Open VSX publishing checklist.7. Security and privacy threat model.8. License compliance plan.9. Test corpus and CI plan.10. Implementation backlog ordered by user value.Constraints:No placeholders.No invented sources.Cite every factual claim with URLs.Prefer official docs and primary sources.Verify current docs because this ecosystem changes quickly.Flag uncertainty explicitly.Do not implement until the research dossier is complete.
```

Bottom line: **LLMint is a good idea because agent instruction files have crossed the threshold from “notes” into “runtime configuration.”** They are now semi-code. Semi-code deserves parsers, diagnostics, autofixes, tests, diffs, CI, and security review. The field is currently scattered across markdownlint, prompt linters, prose linters, agent-context linters, skill security scanners, and eval tools. The win is to unify the _rule logic_ and _workflow_, not merely bundle the binaries. 🧠🧽

it should also include a skill file - and maybe hooks? what value could a hook provide us? what would the skill instruct? what components of the skill would be main, and what would be referenced for progressive disclosure? i'm thinking a hook could fire oin changes oto the CLAUDE.md file perhaps? or anytime a markdown file is edited and in a dorfolder that shares a harness name (.claude/.codex/etc) evaluate this component of the idea, and yourreply above using a deliberative refinement process (10 virtual agents in a 3 round adversarial discourse. apply al;l changes that the agents indicate. do not use supbagents; perform the process in the body of your reply, after resolving the topics presented above - and following the changes; present the final deliverables to the user, in a single zip file if more than one file is present

Thought for 4m 5s

You’re asking whether the LLMint idea should include a **Claude Code skill and hooks**, what those hooks would actually buy us, what the skill should instruct, what belongs in main skill context versus progressive-disclosure resources, and then you want the prior design adversarially refined and packaged. Done. 🧪🪲

Yes: **LLMint should include a skill and optional hooks**. The key refinement is that hooks should not become the whole product. The VS Code extension and CLI remain the main lint engine. Hooks are the live-session tripwires that catch bad agent context at the exact moment Claude starts eating it.

The biggest correction to your hook idea: a hook can absolutely fire when `CLAUDE.md` changes, but for “any Markdown file inside `.claude/`, `.codex/`, `.cursor/`, skills, hooks, etc.” the better trigger is **PostToolUse on Edit/Write**, then let a script inspect the file path. Claude’s `FileChanged` matcher is documented for literal filenames to watch, while `PostToolUse` can match `Edit|Write` and hand JSON to a command hook. The hook docs also include `InstructionsLoaded`, which is the spicy one: it fires when `CLAUDE.md` or `.claude/rules/*.md` is loaded into context. That is exactly where LLMint should sniff for poisoned harness text.

The skill should be the agent’s **operating manual for repairing agent recipes**, not the whole linter. Claude Code skills are a natural fit because a skill is a `SKILL.md` file with instructions, optional frontmatter, supporting files, and on-demand loading. Claude’s docs explicitly recommend keeping the skill body concise and putting large supporting material in separate files so it only loads when needed. Anthropic’s platform docs describe the same progressive-disclosure model: metadata is always visible, `SKILL.md` loads when triggered, and resources/scripts load only as needed.

The hook layer should provide five concrete values:

1. **Loaded-context audit**: when `CLAUDE.md` or rules are loaded, flag contradictions, stale commands, and bloated instructions before they bias the session.
2. **Agent-authored edit audit**: after Claude edits `AGENTS.md`, `CLAUDE.md`, `SKILL.md`, `.mdc`, or hook config, run the deterministic LLMint check.
3. **Config drift detection**: when `.claude/settings.json`, skills, or plugin hooks change, check for permission drift, broken hook syntax, and unsafe broad tool grants.
4. **Stop gate**: before Claude says “done,” warn if high-severity harness diagnostics were introduced.
5. **Destructive harness protection**: use `PreToolUse` sparingly to block dangerous shell operations against `.claude/`, `.codex/`, skill/plugin folders, or agent instructions.

The hook should fail open if the LLMint CLI is missing. It should only fail closed for high-confidence destructive harness operations. Otherwise, it becomes the same yellow-squiggle goblin you just exiled from VS Code.

I ran the requested adversarial refinement in-body and applied the changes in the deliverables.

Round 1, objections: the product lead rejected mandatory hooks; the VS Code architect said editor diagnostics must stay primary; the Claude specialist demanded `InstructionsLoaded`; the static-analysis agent rejected whole-file AI rewrites; the security reviewer warned that hooks are executable code; the token economist cut the skill body down; the skill author moved rule catalogs into resources; the marketplace reviewer separated VS Code release from Claude companion tooling; the DX tester blocked “lint every Markdown file”; the skeptical maintainer demanded the core product work without Claude Code.

Round 2, counter-design: hooks become optional companion tooling; the CLI owns deterministic checking; `InstructionsLoaded` and `PostToolUse Edit|Write` become the main hooks; `FileChanged` watches only literal harness filenames; prompt/agent hooks are opt-in only; every semantic fix must validate locally and show a diff; the skill uses progressive disclosure; hook output is capped, deduped, and concise.

Round 3, final changes applied: I added a Claude skill, rule resources, hook design resource, semantic repair schema, UltraCode research prompt, Claude plugin manifest, hook config, and a real Node hook-gate script. The prior design is now a four-surface product: VS Code extension, CLI, Claude skill, and optional Claude hook/plugin layer. 🛠️

The packaged deliverable includes:

`README.md` with the refined architecture, hook verdict, skill verdict, and the 10-agent/3-round deliberative refinement.

`llmint-agent-recipe-auditor/SKILL.md` as the proposed Claude Code skill.

`resources/rule-map.md`, `hook-design.md`, `progressive-disclosure.md`, `repair-patch-schema.md`, and `research-agent-prompt.md`.

`claude-plugin/.claude-plugin/plugin.json`, `hooks/hooks.json`, and `bin/llmint-hook-gate.js`.

`vscode-extension-notes/hook-and-skill-product-delta.md`.

The hook config uses the current Claude hook model: hooks can be command, HTTP, MCP tool, prompt, or agent handlers, and plugin hooks live under `hooks/hooks.json`; hooks can also be scoped through skill or agent frontmatter while active. I kept the bundled hook gate deterministic and non-networked by default.

Here’s the zip:

Download the LLMint skill/hooks refinement package