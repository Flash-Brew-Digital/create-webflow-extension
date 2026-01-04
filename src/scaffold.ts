import * as p from "@clack/prompts";
import degit from "degit";
import { execa } from "execa";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "./types.js";

import {
  directoryExists,
  updatePackageJSON,
  updateWebflowJSON,
} from "./utils.js";

const TEMPLATE_REPO = "Flash-Brew-Digital/webflow-extension-starter#template";

export async function scaffoldProject(config: ProjectConfig): Promise<void> {
  const targetDir = path.resolve(process.cwd(), config.name);
  const log = config.quiet ? () => {} : console.log;

  if (await directoryExists(targetDir)) {
    if (config.quiet) {
      throw new Error(`Directory "${config.name}" already exists!`);
    }

    const overwrite = await p.confirm({
      message: `Directory "${config.name}" already exists. Overwrite?`,
      initialValue: false,
    });

    if (p.isCancel(overwrite) || !overwrite) {
      throw new Error("USER_CANCELLED");
    }
  }

  const spinner = config.quiet ? null : p.spinner();

  spinner?.start("Cloning the built-in template...");

  try {
    const emitter = degit(TEMPLATE_REPO, {
      cache: false,
      force: true,
    });

    await emitter.clone(targetDir);
    spinner?.stop("Template cloned!");
  } catch (error) {
    spinner?.stop("Sorry, we could not clone the template");
    throw error;
  }

  spinner?.start("Configuring your extension...");

  const hasPM =
    config.pm === "npm"
      ? true
      : await execa(config.pm, ["--version"])
          .then(() => true)
          .catch(() => false);

  if (!hasPM) {
    const installPM = await execa("npm", ["install", "-g", "-s", config.pm]);

    if (installPM.failed) {
      spinner?.stop(
        `Sorry, we could not install ${config.pm}. Please install it manually and try again.`
      );
      throw new Error(`Failed to install ${config.pm}`);
    }
  }

  try {
    await updatePackageJSON(targetDir, config.name, config.pm);
    await updateWebflowJSON(targetDir, config.name);

    spinner?.stop("Extension configured!");
  } catch (error) {
    spinner?.stop("Sorry, we could not configure the extension");
    throw error;
  }

  spinner?.start("Setting up your linter and formatter...");

  try {
    let pmx: string;
    let pmxArgs: string[] = [];

    if (config.pm === "npm") {
      pmx = "npx";
    } else if (config.pm === "bun") {
      pmx = "bunx";
    } else if (config.pm === "yarn") {
      const { stdout } = await execa("yarn", ["--version"]);
      const isYarn1 = stdout.startsWith("1.");
      pmx = isYarn1 ? "npx" : "yarn";
      pmxArgs = isYarn1 ? [] : ["dlx"];
    } else {
      pmx = config.pm;
    }

    await execa(
      pmx,
      [
        ...pmxArgs,
        "ultracite",
        "init",
        "--linter",
        config.linter,
        "--pm",
        config.pm,
        "--editors",
        "vscode",
        "--quiet",
      ],
      { cwd: targetDir }
    );

    spinner?.stop("Linter and formatter set up!");
  } catch (error) {
    spinner?.stop("Sorry, we could not set up the linter and formatter");
    throw error;
  }

  if (!config.skipGit) {
    spinner?.start("Initializing git repository...");

    try {
      const hasGit = await execa("git", ["--version"]);

      if (hasGit.failed) {
        spinner?.stop(
          "Git is not installed, skipping git initialization. Visit https://git-scm.com/install/ to install it."
        );
        return;
      }

      await execa("git", ["init"], { cwd: targetDir });
      spinner?.stop("Git repository initialized!");
    } catch {
      spinner?.stop("Sorry, we could not initialize a git repository");
    }
  }

  if (!config.skipInstall) {
    spinner?.start(`Installing dependencies with ${config.pm}...`);

    try {
      await execa(config.pm, ["install"], { cwd: targetDir });
      spinner?.stop("Dependencies installed!");
    } catch (error) {
      spinner?.stop("Sorry, we could not install the dependencies");
      throw error;
    }
  }

  if (!config.quiet) {
    p.outro(pc.green("Your extension is ready to go!"));

    log("");
    log(pc.bold("  To get started:"));
    log("");
    log(`  ${pc.cyan("cd")} ${config.name}`);
    if (config.skipInstall) {
      log(`  ${pc.cyan(`${config.pm} install`)}`);
    }
    log(`  ${pc.cyan(`${config.pm} dev`)}`);
    log("");
    log(pc.bold("  Then in Webflow:"));
    log("");
    log(pc.dim("  1. Open your Webflow workspace settings"));
    log(pc.dim("  2. Navigate to Apps & Integrations → Develop"));
    log(pc.dim("  3. Click Create an App and configure it accordingly"));
    log(pc.dim("  4. Open a project in the Designer"));
    log(
      pc.dim("  5. Press E to open the apps panel and launch your extension")
    );
    log("");
  }
}
