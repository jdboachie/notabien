# Git Workflow Documentation

## Branching Strategy

We use a simple, practical three-branch workflow:

- `main` — production-ready code. Only reviewed, tested, and approved changes are merged here.
- `dev` — integration branch where completed feature branches are merged for combined testing.
- Feature branches (`feat/<short-desc>`, `fix/<short-desc>`, `hotfix/<short-desc>`) — short-lived branches created from `dev` (or `main` for urgent hotfixes). Typical flow:
  1. Create feature branch off `dev` (`git checkout -b feat/my-feature dev`)
  2. Work locally and push branch to origin.
  3. Open a PR targeting `dev` (or `main` for hotfixes).
  4. After review and CI pass, merge to `dev`.
  5. Periodically merge `dev` into `main` (or open a release PR) when ready.

Branch naming examples from this repo:
- `feat/export-import-notes`
- `fix/auth-redirect`
- `hotfix/*`

Notes:
- For production hotfixes, branch from `main`, fix, then merge the fix back into both `main` and `dev`.
- Prefer explicit merge commits (no fast-forward) for feature PRs if you want to preserve branch topology; teams that prefer cleaner history can use squash merges.

## Commit Conventions

We follow a Conventional Commits-inspired style:
- Format: `<type>(<scope>): <short description>`
- Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`, `ci`, `build`, `hotfix`, etc.
- Scope is optional (`auth`, `README`, etc.)
- Keep the subject short (<= 50 chars), imperative, lowercase start.

Examples:
- `feat: add note export feature`
- `fix(auth): prevent infinite redirect on client`
- `docs(README): add usage examples`

Good practice:
- Leave a blank line between subject and body.
- Use the body to explain the why and link to issues/PRs when useful.

## Merge Conflicts Encountered

Example (controlled demo):
- Scenario: Two branches both add or modify `GIT_WORKFLOW.md` in incompatible ways.
- Merge attempt: merging `feat/gwf-conflict` into `feat/add-git-workflow` will show:
  - `CONFLICT (add/add): GIT_WORKFLOW.md`
  - `Automatic merge failed; fix conflicts and then commit the result.`

How this was (or would be) resolved:
1. Run `git merge feat/gwf-conflict` on `feat/add-git-workflow`.
2. Check `git status` — it lists conflicted files (`GIT_WORKFLOW.md`).
3. Open the file and look for conflict markers:
   - <<<<<<< HEAD
   - (content from current branch)
   - =======
   - (content from merged branch)
   - >>>>>>> feat/gwf-conflict
4. Edit the file to combine or pick changes, removing the markers and producing the final merged content.
5. Stage the resolved file: `git add GIT_WORKFLOW.md`
6. Complete the merge: `git commit -m "fix: resolve merge conflict in GIT_WORKFLOW.md"`
7. Run tests / linters as needed, then merge the resolved branch into `dev` or `main` as appropriate.

Note: This document includes an alternate version intentionally (for a demonstration merge). After resolving the conflict, update this section to reference the merge commit SHA and attach a screenshot (`assets/resolved-conflict.png`) showing the resolved conflict and `git status` output.

If you'd like, I can create this conflict and resolve it in the repository; I'll then update this section with the exact commit SHA and add screenshots.

## Git Commands Used

Common and useful commands for the workflow:

- Branching & navigation
  - `git branch -a`
  - `git checkout -b <branch> <base>`
  - `git switch <branch>`

- Working with commits
  - `git status`
  - `git add <file>`
  - `git commit -m "type(scope): message"`
  - `git commit --amend` (for local fixes)
  - `git log --oneline --graph --decorate --all`
  - `git show <commit>`

- Sharing & integration
  - `git fetch`
  - `git pull --rebase` (to keep your local branch up-to-date cleanly)
  - `git merge <branch>`
  - `git rebase <branch>` (use carefully on public branches)

- Conflict / troubleshooting
  - `git diff`
  - `git restore --staged <file>`
  - `git reset --hard <commit>` (destructive)
  - `git stash` / `git stash pop`

- Collaboration
  - `git push -u origin <branch>`
  - Open PR targeting `dev` (or `main` for hotfixes), request reviews, merge when CI and reviews pass.

## Screenshots

Please add these screenshots in the `assets/` folder (I'll reference them here):

- `assets/git-log.png` — Git log showing commit history (suggested command: `git log --oneline --graph --decorate --all`)
- `assets/branch-structure.png` — Branch structure (from `git branch -a` or a GUI view)
- `assets/resolved-conflict.png` — Example resolved conflict (showing conflict markers before and the final resolved file)
- `assets/pull-request.png` — Example PR (discussion and merge UI)

Once you add images, embed them like:
- `![Git Log](assets/git-log.png)`
- `![Branch Structure](assets/branch-structure.png)`
- `![Resolved Conflict](assets/resolved-conflict.png)`
- `![Pull Request](assets/pull-request.png)`

---

If you want, I can:
- Create the demo conflict and resolve it in the repo, then update this file with the merge commit SHA and attach the screenshots.
- Or, if you prefer, you can create those screenshots locally and drop them into `assets/` and I will update the file to embed them.

Which would you prefer?