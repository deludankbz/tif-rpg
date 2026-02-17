# TODO
## Actor and actor sheet
- Config the document for npc, creature, and explorer (img etc...)
- set prototoken for correct image
- Add effect info on effects tab on _source vs system

## Item and Item sheet
- Config the document for item types (img etc...)


## Sass
Use new imports

# Rules for Commits

## Version Bump Rules

**PATCH (1.0.0 → 1.0.1)** - Bug fixes
**MINOR (1.0.0 → 1.1.0)** - New features (backward compatible)
**MAJOR (1.0.0 → 2.0.0)** - Breaking changes

## Summary

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `fix:` | PATCH (0.0.1) | Bug fixes |
| `feat:` | MINOR (0.1.0) | New features |
| `!` or `BREAKING CHANGE:` | MAJOR (1.0.0) | Breaking changes |
| `chore:`, `docs:`, `style:` | None | No release |

## Examples

```bash
# Patch release (1.2.3 → 1.2.4)
git commit -m "fix: <message>"

# Minor release (1.2.3 → 1.3.0)
git commit -m "feat: <message>"

# Major release (1.2.3 → 2.0.0)
git commit -m "feat!: <message>"
```

# Release Please flow for releasing
1. **Make commits on `dev` (or others)** using conventional commits
2. **Create PR: `dev` → `main`**
3. **Merge that PR**
4. **Release Please runs the job** (triggered by push to main)
5. **Release Please creates a release PR** with all commits from your dev branch
6. **Merge the release PR** to create the actual release