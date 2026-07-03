# Progressive Disclosure Rules for LLMint Skills

## Main principle

The skill entrypoint should teach Claude when and how to act. It should not contain the whole rule encyclopedia.

## Put in `SKILL.md`

- Trigger and scope.
- Short operating rules.
- The normal workflow.
- Safety posture.
- Output contract.
- Pointers to resources.

## Put in resources

- Long rule catalog.
- Examples and anti-examples.
- Hook installation recipes.
- API patch schemas.
- Marketplace notes.
- Research prompts.
- Compatibility tables.

## Put in scripts

- Deterministic parsing.
- YAML validation.
- Mermaid validation.
- Path checks.
- Package script checks.
- Token counting.
- Diff generation.

## Avoid

- Long motivational explanations.
- Duplicated instructions already present in other resources.
- Giant examples in the always-loaded body.
- Broad tool permissions in frontmatter.
- Hidden network calls.
