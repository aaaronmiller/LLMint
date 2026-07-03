# LLMint Rule Map

## Frontmatter and schema

- `LLM001 malformed-frontmatter`: YAML cannot parse.
- `LLM002 missing-skill-description`: skill lacks a useful invocation description.
- `LLM003 vague-activation-trigger`: description fails to say when to use the skill.
- `LLM031 invalid-skill-name`: name violates lowercase/hyphen constraints.
- `LLM032 unknown-frontmatter-field`: field is not supported for that harness type.

## Workspace truth

- `LLM004 stale-path-reference`: referenced path does not exist.
- `LLM005 command-not-found`: command or package script is missing.
- `LLM006 package-manager-conflict`: repo evidence conflicts with instructions.
- `LLM020 obsolete-framework-reference`: instructions mention old framework structure.
- `LLM023 undocumented-env-var`: env var is referenced but not documented.

## Cross-file consistency

- `LLM007 conflicting-instructions`: two harness files give incompatible instructions.
- `LLM019 duplicated-instruction`: repeated rule appears across multiple files.
- `LLM033 scoped-rule-shadowing`: local rule overrides global rule without saying so.
- `LLM034 mixed-agent-drift`: AGENTS.md, CLAUDE.md, and Cursor/Copilot/Gemini files diverge.

## Token economy

- `LLM008 context-bloat`: always-loaded file is too large for its role.
- `LLM015 token-waste-phrase`: verbose phrase can be shortened with no loss.
- `LLM035 example-bloat`: too many examples in always-loaded context.
- `LLM036 import-bloat`: import pulls large context at launch.

## Skill and hook leakage

- `LLM009 skill-leakage`: skill contains global rules better suited to AGENTS.md/CLAUDE.md.
- `LLM010 lint-leakage`: agent context contains ordinary linter output or transient errors.
- `LLM014 overbroad-always-on-rule`: rule should be path-scoped or skill-scoped.
- `LLM037 hook-noise-risk`: hook fires too broadly and will spam the session.

## Safety

- `LLM011 impossible-tool-capability`: instructions require unavailable tools.
- `LLM012 missing-secret-policy`: no policy for secrets despite env/config usage.
- `LLM013 destructive-policy-missing`: destructive commands are not gated.
- `LLM029 skill-supply-chain-risk`: skill fetches or executes untrusted external content.
- `LLM030 prompt-injection-shaped-instruction`: text asks the agent to ignore higher-priority rules.

## Markdown and embedded syntax

- `LLM017 malformed-mermaid-block`: Mermaid block fails parse/render.
- `LLM018 code-fence-language-missing`: code block language is missing or wrong.
- `LLM038 malformed-import`: `@path` import is probably accidental or broken.
- `LLM039 ambiguous-heading`: duplicate or misleading heading.

## Requirements quality

- `LLM024 untestable-requirement`: instruction cannot be verified.
- `LLM025 ambiguous-modal-phrasing`: weak modal language harms execution.
- `LLM026 contradictory-normative-strength`: `must`, `should`, and `never` conflict.
- `LLM027 missing-validation-loop`: no check command or done criteria.

## AI writing tells

- `LLM016 ai-tell-punctuation`: em dash or punctuation pattern overused.
- `LLM040 stock-ai-phrase`: generic LLM phrase reduces clarity.
- `LLM041 hedge-stack`: multiple hedges weaken imperative instructions.

## Portability

- `LLM021 unscoped-platform-specific-instruction`: OS-specific command lacks platform scope.
- `LLM022 shell-command-risk`: command is unsafe, brittle, or nonportable.
- `LLM042 absolute-local-path`: path appears tied to one machine.
