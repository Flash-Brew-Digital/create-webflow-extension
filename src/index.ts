import { program } from "commander";
import pc from "picocolors";

declare const __VERSION__: string | undefined;
const version = typeof __VERSION__ !== "undefined" ? __VERSION__ : "dev";

import type { ProjectConfig } from "./types.js";

import { getPromptResponses } from "./prompts.js";
import { scaffoldProject } from "./scaffold.js";
import { sanitizeProjectName } from "./utils.js";

const title = `
${pc.bold(pc.cyan("Create Webflow Extension"))}
${pc.dim("Scaffold a new Webflow Designer Extension project with a built-in template.")}
`;

program
  .name("create-webflow-extension")
  .description(
    "Scaffold a new Webflow Designer Extension project with a built-in template."
  )
  .version(version)
  .argument("[name]", "Project name")
  .option("-n, --name <name>", "Project name")
  .option("--pm <manager>", "Package manager")
  .option("-l, --linter <linter>", "Linter and formatter")
  .option("--sg, --skip-git", "Skip initializing a git repository")
  .option("--si, --skip-install", "Skip installing dependencies")
  .option("-q, --quiet", "Suppress interactive prompts and visual output")
  .action(async (argName: string | undefined, options: ProjectConfig) => {
    try {
      console.log(title);

      const projectName = argName ?? options.name;

      const config = options.quiet
        ? {
            name: sanitizeProjectName(projectName ?? "my-webflow-extension"),
            pm: options.pm ?? "pnpm",
            linter: options.linter ?? "oxlint",
            skipGit: options.skipGit ?? false,
            skipInstall: options.skipInstall ?? false,
            quiet: true,
          }
        : await getPromptResponses({
            name: projectName,
            pm: options.pm,
            linter: options.linter,
            skipGit: options.skipGit,
            skipInstall: options.skipInstall,
          });

      await scaffoldProject(config);
    } catch (error) {
      if (error instanceof Error && error.message === "USER_CANCELLED") {
        console.log(pc.dim("\nCancelled."));
        process.exit(0);
      }

      console.error(pc.red("\nError:"), error);
      process.exit(1);
    }
  });

program.parseAsync().catch((error) => {
  console.error(error);
  process.exit(1);
});
