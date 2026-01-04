# AGENTS.md - Create Webflow Extension

This document provides guidance for AI coding agents working in this repository.

## Project Overview

This is a **CLI tool** that scaffolds new Webflow Designer Extension projects using a [built-in template](https://github.com/Flash-Brew-Digital/webflow-extension-starter). It provides interactive prompts or quiet mode for non-interactive usage.

- **Package Manager**: pnpm (v10+)
- **Build Tool**: tsup (esbuild-based bundler)
- **Linting**: Oxlint via Ultracite
- **Formatting**: Oxfmt via Ultracite
- **Testing**: Vitest
- **Runtime**: Node.js 20+

## Build/Dev/Test Commands

```bash
# Development
pnpm dev              # Run tsup in watch mode

# Build
pnpm build            # Production build via tsup

# Type Checking
pnpm type-check       # TypeScript type checking (tsc --noEmit)

# Linting & Formatting
pnpm check            # Lint check via Ultracite (type-aware)
pnpm fix              # Auto-fix lint issues via Ultracite

# Testing
pnpm test             # Run tests via Vitest
```

## Testing

Tests are located in the `tests/` directory and use Vitest. The test structure:

- `helpers.ts` - Shared test utilities (temp directory setup, CLI path)
- `cli.test.ts` - CLI flag tests (--help, --version)
- `git.test.ts` - Git initialization tests
- `utils.test.ts` - Unit tests for utility functions
- `package-manager.test.ts` - Package manager option tests
- `output.test.ts` - Project output verification tests

Run a single test file:

```bash
pnpm test tests/utils.test.ts
```

## Code Style Guidelines

### Formatting (Oxfmt)

Configuration in `.oxfmtrc.jsonc`:

- **Print width**: 80 characters
- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: Required
- **Quotes**: Double quotes only
- **Trailing commas**: ES5 style
- **Bracket spacing**: Enabled
- **Arrow function parens**: Always required
- **Line endings**: LF
- **Import sorting**: Enabled (ascending, case-insensitive, newlines between groups)

### Import Organization

Imports are automatically sorted by Oxfmt. Follow this pattern:

```typescript
// 1. External packages
import { program } from "commander";
import pc from "picocolors";

// 2. Node.js built-ins
import fs from "node:fs/promises";
import path from "node:path";

// 3. Internal modules (with .js extension for ESM)
import type { ProjectConfig } from "./types.js";
import { scaffoldProject } from "./scaffold.js";
```

Use `import type { ... }` for type-only imports.

### TypeScript

- **Strict mode**: Enabled
- **Target**: ES2022
- **Module**: ESNext (ESM)
- **File extensions**: Use `.js` in imports (ESM requirement)

#### Types & Interfaces

- Use `interface` for data structures
- Define types in `src/types.ts`
- Export types that are used across modules

```typescript
// Good - interface for data structures
export interface ProjectConfig {
  name: string;
  pm: pm;
  linter: linter;
  skipGit: boolean;
  skipInstall: boolean;
  quiet: boolean;
}

// Type aliases for unions
export type pm = "pnpm" | "npm" | "yarn" | "bun";
export type linter = "oxlint" | "biome" | "eslint";
```

### Naming Conventions

| Entity              | Convention           | Example                     |
| ------------------- | -------------------- | --------------------------- |
| Files               | kebab-case           | `scaffold.ts`               |
| Interfaces          | PascalCase           | `interface ProjectConfig`   |
| Type aliases        | lowercase            | `type pm = "pnpm" \| "npm"` |
| Constants           | SCREAMING_SNAKE_CASE | `const TEMPLATE_REPO = ...` |
| Variables/Functions | camelCase            | `const projectName`         |

### CLI Patterns

#### Using Commander

```typescript
program
  .name("create-webflow-extension")
  .argument("[name]", "Project name")
  .option("-n, --name <name>", "Project name")
  .option("-q, --quiet", "Suppress interactive prompts")
  .action(async (argName, options) => {
    // Handle CLI logic
  });
```

#### Using @clack/prompts

```typescript
import * as p from "@clack/prompts";

const result = await p.text({
  message: "What is your project name?",
  placeholder: "my-extension",
  validate: (value) => {
    if (!value) return "Required";
  },
});

if (p.isCancel(result)) throw new Error("USER_CANCELLED");
```

#### Using execa

```typescript
import { execa } from "execa";

// Run commands
await execa("git", ["init"], { cwd: targetDir });

// Check if command exists
const hasGit = await execa("git", ["--version"])
  .then(() => true)
  .catch(() => false);
```

### Error Handling

- Throw `Error("USER_CANCELLED")` for user cancellation
- Use spinner for long-running operations
- Provide clear error messages

```typescript
try {
  spinner?.start("Cloning template...");
  await cloneTemplate();
  spinner?.stop("Template cloned!");
} catch (error) {
  spinner?.stop("Failed to clone template");
  throw error;
}
```

## File Structure

```
src/
  index.ts       # CLI entry point with Commander setup
  prompts.ts     # Interactive prompts via @clack/prompts
  scaffold.ts    # Project scaffolding logic
  types.ts       # TypeScript type definitions
  utils.ts       # Utility functions

tests/
  helpers.ts     # Shared test utilities
  *.test.ts      # Test files
```

## Key Dependencies

- `commander` - CLI argument parsing
- `@clack/prompts` - Interactive prompts
- `degit` - Template cloning
- `execa` - Command execution
- `picocolors` - Terminal colors

## Linting Rules

Oxlint extends `ultracite/oxlint/core`. Run `pnpm check` to verify code quality and `pnpm fix` to auto-fix issues.
