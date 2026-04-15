---
name: dead-code-fixer
description: Skill to identify and remove dead or unused code from the repository. Use this to fix pre-commit failures caused by the dead-code-check.
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

### 3. Dependency Cleanup
- If a dependency is reported as "Unused dependencies" or "Unused devDependencies", remove it:
```bash
pnpm remove [dependency-name]
```

### 4. Verification
Run the check again to ensure all reported issues are resolved:
```bash
pnpm run dead-code-check
```

## Success Criteria
- [ ] `pnpm run dead-code-check` passes with no issues.
- [ ] No essential code was accidentally removed.
- [ ] Application still builds and tests pass.
