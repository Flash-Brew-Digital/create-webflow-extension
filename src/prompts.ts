import * as p from "@clack/prompts";
import pc from "picocolors";

import type { pm, linter, ProjectConfig, PromptOptions } from "./types.js";

import { sanitizeProjectName } from "./utils.js";

export async function getPromptResponses(
  options: PromptOptions
): Promise<ProjectConfig> {
  p.intro(pc.cyan("Set up your project by answering a few questions:"));

  const responses = await p.group(
    {
      name: async () => {
        if (options.name) return sanitizeProjectName(options.name);

        const input = await p.text({
          message: "What is the name of your Webflow Designer Extension?",
          placeholder: "My Webflow Extension",
          defaultValue: "My Webflow Extension",
          validate: (value) => {
            if (!value) return "You must provide a name for your extension";
          },
        });

        if (p.isCancel(input)) throw new Error("USER_CANCELLED");

        return sanitizeProjectName(input);
      },

      pm: (): Promise<pm> => {
        if (options.pm) return Promise.resolve(options.pm as pm);

        return p.select({
          message: "Package Manager",
          options: [
            { value: "pnpm", label: "pnpm", hint: "recommended" },
            { value: "npm", label: "npm" },
            { value: "yarn", label: "yarn" },
            { value: "bun", label: "bun" },
          ],
          initialValue: "pnpm",
        }) as Promise<pm>;
      },

      linter: (): Promise<linter> => {
        if (options.linter) return Promise.resolve(options.linter);

        return p.select({
          message: "Linter and Formatter",
          options: [
            { value: "oxlint", label: "Oxlint and Oxfmt", hint: "recommended" },
            { value: "biome", label: "Biome" },
            { value: "eslint", label: "ESLint, Prettier, Stylelint" },
          ],
          initialValue: "oxlint",
        }) as Promise<linter>;
      },
      skipGit: () => {
        if (options.skipGit !== undefined) {
          return Promise.resolve(options.skipGit as boolean);
        }

        return p.confirm({
          message: "Skip initializing a git repository?",
          initialValue: false,
        });
      },
    },
    {
      onCancel: () => {
        throw new Error("USER_CANCELLED");
      },
    }
  );

  return {
    name: responses.name as string,
    pm: responses.pm as pm,
    linter: responses.linter as linter,
    skipGit: responses.skipGit as boolean,
    skipInstall: options.skipInstall ?? false,
    quiet: false,
  };
}
