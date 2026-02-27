---
description: Audit project dependencies for vulnerabilities and fix them
---

## Task

1. Run `npm audit` to find vulnerable installed packages
2. Run `npm audit fix` to apply safe updates
3. Run the project's test suite to verify the updates didn't break anything
4. Report a summary of what was found and fixed