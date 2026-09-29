# Update dashboard

You are updating the Adobe internal dashboard demo app so it shows the latest fixes merged into this fork's main branch. The audience is watching. Before each step, say in one short sentence what you are about to do and why it matters when a design-system fix rolls out to Adobe products.

This is Windows PowerShell. Chain commands with ; and never with &&.

Steps:

1. Run `git branch --show-current`. If it is not `main`, stop and tell me. Do not switch branches yourself.

2. Run `git status --porcelain`. If there are uncommitted changes, stop and tell me.

3. Run `git pull origin main`. Then run `git log --oneline ORIG_HEAD..HEAD` and list the merged changes that came in.

4. Run `yarn install`. Say that it takes seconds when dependencies have not changed.

5. Check whether the dashboard dev server is already running (Vite on port 5173). If it is, say that Vite reloads the pulled changes by itself. If it is not, start `yarn workspace adobe-dashboard dev` as a background command.

6. Open [http://localhost:5173](http://localhost:5173) in the browser. Press Tab until the sidebar ListBox has focus, then use the arrow keys and Enter to try to reach the disabled item "Admin (no access)". If the Settings view has an "Archived workspaces" list, open Settings, Tab into that list and try to select an item with the arrow keys and Enter. Take a screenshot and say whether disabled items are now skipped. If you cannot open a browser, tell me the URL to open instead.

7. Finish with three short lines: what changed, which pull request it came from, and what would happen at Adobe scale (a release workflow publishes the package and opens update pull requests in every product repo that uses it).

Rules: never push, never force anything, never create branches, never stop all node processes, never run a full build, and never touch adobe/react-spectrum.