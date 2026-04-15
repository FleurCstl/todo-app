---
name: dead-code-fixer
description: Skill to identify and remove dead or unused code (files/exports) from the repository, and warn about unused dependencies. Use this to fix pre-commit failures.
---

## Context
Dead code increases maintenance overhead and can lead to confusion. This skill automates the process of cleaning up unused exports, files, and dependencies identified by `knip`.

## Core Workflow

### 1. Run Dead Code Analysis
Execute the check to get the list of issues:
```bash
pnpm run dead-code-check
```

### 2. File Cleanup
- If a file is reported as "Unused files", delete it after verifying it's really not needed (check for non-standard imports or dynamic loading).
- If an export is "Unused exports", remove the `export` keyword or delete the code if it's not used internally either.

### 3. Dependency Warnings (DO NOT REMOVE)
- If a dependency is reported as "Unused dependencies" or "Unused devDependencies", **DO NOT remove it**.
- Instead, display a clear warning message to the user:
  > [!WARNING]
  > The following dependencies are installed but not directly referenced in the code: `[dependency-names]`.

### 4. Verification
Run the check again to ensure all reported files and exports are resolved:
```bash
pnpm run dead-code-check
```

## Success Criteria
- [ ] `pnpm run dead-code-check` reports no unused files or exports.
- [ ] Any reported unused dependencies are mentioned to the user as a warning.
- [ ] No essential code was accidentally removed.
- [ ] Application still builds and tests pass.
