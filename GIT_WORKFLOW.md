# Git Workflow Documentation

## Branching Strategy

This repository follows a lightweight three-branch approach:

- `main`  
  - Production-ready code. Only tested, reviewed, and approved changes are merged here.
  - Releases should originate from `main`.

- `dev`  
  - Integration branch where completed features are merged and tested together.
  - Stabilizes before being merged into `main`.

- Feature branches (`feat/<short-description>`, `fix/<short-description>`, `hotfix/<short-description>`)  
  - Short-lived branches created from `dev` (or `main` for urgent hotfixes).
  - Naming convention examples: `feat/export-import-notes`, `fix/auth-redirect`.
  - Work is done on a feature branch, pushed, and a Pull Request (PR) is opened targeting `dev` (or `main` for hotfix).
  - After review and CI passing, merge into `dev` (or `main`) following the project merge policy.

Notes:
- Use `hotfix/*` for immediate production fixes from `main` and merge them back into both `main` and `dev`.
- Prefer `--no-ff` merges for PRs to preserve the branch topology or use squash merges if the team prefers a linear history.

## Commit Conventions

We follow the Conventional Commits pattern. Format:

`<type>(<scope>): <subject>`

- `type` examples: `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`, `hotfix`, `ci`, `build`
- `scope` is optional, e.g., `(auth)`, `(README)`
- `subject` is a short imperative description (prefer <= 50 chars)

Examples from this repo:
- `feat: add note export feature`
- `fix(auth): fix client-side infinite redirect error`
- `docs(README): add README.md file`

Best practices:
- Start the subject in lowercase and use imperative mood ("add", not "added").
- Leave a blank line before the body.
- The body can include explanation, reasoning, and referencing issues (e.g., `Refs #123`).

## Merge Conflicts Encountered

At the time of creating this document (initial version), there were no recorded merge conflicts in `main`'s history that required a manual resolution (no commits explicitly documenting a conflict resolution). 

Planned next step (choose one):
- I can create a small, intentional conflict on `GIT_WORKFLOW.md` (or another small file), resolve it, and update this section with a real-world conflict example and commit references. If you want that, tell me and I will:
  - Create two short-lived branches with different edits to the same file.
  - Merge and resolve the conflict manually.
  - Commit the resolution and include exact commands and the merge commit SHA below and as a screenshot.

If you'd prefer to handle it, here's a typical conflict resolution workflow you can follow:
1. Attempt merge: `git merge <branch>`
2. If conflict occurs, `git status` will show conflicted files.
3. Open the conflicted file(s): you'll see conflict markers `<<<<<<<`, `=======`, `>>>>>>>`.
4. Edit to combine/choose the correct changes.
5. `git add <file>` to mark as resolved.
6. `git commit` to complete the merge (Git will include a merge message).
7. Optionally run tests and push the resolved merge.

## Git Commands Used

Common commands used and recommended:

- Branching and switching:
  - `git branch -a` — list all branches
  - `git checkout -b <branch>` or `git switch -c <branch>` — create and switch to a branch
  - `git switch <branch>` — switch branch

- Working with commits:
  - `git status` — see current changes and conflicts
  - `git add <file>` — stage changes
  - `git commit -m "type(scope): message"` — commit staged changes
  - `git commit --amend` — modify the previous commit (local only)
  - `git log --oneline --graph --decorate --all` — visual history graph
  - `git show <commit>` — details for a commit

- Syncing & merging:
  - `git fetch`
  - `git pull --rebase` — keep history linear when pulling
  - `git merge <branch>` — merge branch into current
  - `git rebase <branch>` — rebase work onto another branch (use with care on shared branches)

- Undo and stash:
  - `git reset --soft <commit>` / `git reset --hard <commit>`
  - `git restore --staged <file>`
  - `git stash` / `git stash pop`

- Troubleshooting:
  - `git diff` — see changes
  - `git bisect` — find regression commits
  - `git blame <file>` — find who changed lines

## Screenshots

Please place screenshots under the `assets/` folder with the following names (I will reference them here):

- `assets/git-log.png` — Git log showing commit history (suggested command: `git log --oneline --graph --decorate --all`)
- `assets/branch-structure.png` — Branch structure (from `git branch -a` or a graphical view)
- `assets/resolved-conflict.png` — Example resolved conflict (before and after or the `git status` showing resolution)
- `assets/pull-request.png` — Example PR showing discussion and merge

How to capture them:
- Run the correlated git command (examples above) in a terminal.
- Take a screenshot of the terminal output (or redirect to a text file and snapshot that).
- Save the screenshot as the filenames above in `assets/` at the repository root.

Sample image markdown to embed once you add images:
- `![Git Log](assets/git-log.png)`
- `![Branch Structure](assets/branch-structure.png)`
- `![Resolved Conflict](assets/resolved-conflict.png)`
- `![Pull Request](assets/pull-request.png)`

## Example Pull Request Process (short checklist)

1. Create a branch: `git checkout -b feat/short-desc`
2. Make changes and commit using conventional commit messages.
3. Push: `git push -u origin feat/short-desc`
4. Open PR against `dev` (or `main` if hotfix).
5. Request review, address feedback.
6. Merge once CI passes and reviewers approve (follow repo merge preference: merge commit or squash).
7. Delete remote branch after merge.

---

If you'd like, I can:
- Create a small conflict demo in a branch and update this file with a real merge-conflict example and commit references;
- Or proceed to add this `GIT_WORKFLOW.md` directly to `main` for you to review.

Which would you prefer?