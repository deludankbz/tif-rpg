# This Is Fine!
The TIF Roleplaying Game system for FoundryVTT

> **Disclaimers**
> 
> This is still a work in progress. Bugs are expected, and so are missing features.
> Several icons used from gameicons.net

![Foundry v13](https://img.shields.io/badge/foundry-v13-green)

# Commits
## Version bump rules

> **Use conventional commits**
>
> This is an essential part to project releasing, since it allows
> `Release Please` to actually release new system versions.
>
> Read more about [semantic versioning](https://semver.org/) here.

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `fix:` | PATCH (0.0.1) | Bug fixes |
| `feat:` | MINOR (0.1.0) | New features |
| `!` or `BREAKING CHANGE:` | MAJOR (1.0.0) | Breaking changes |
| `chore:`, `docs:`, `style:` | None | No release |

## Releasing
1. **Make commits on `dev` (or others)** using conventional commits
2. **Create PR: `dev` → `main`**
3. **Merge that PR**
4. **Release Please runs the job** (triggered by push to main)
5. **Release Please creates a release PR** with all commits from your dev branch
6. **Merge the release PR** to create the actual release
