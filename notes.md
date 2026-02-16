# TODO
- Add scroll transition inside journal sheets for pages with image headers

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