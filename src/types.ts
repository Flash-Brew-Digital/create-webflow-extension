export type pm = "pnpm" | "npm" | "yarn" | "bun";

export type linter = "oxlint" | "biome" | "eslint";

export interface WebflowJSON {
  name: string;
  apiVersion: "2";
  size: "comfortable" | "default" | "large";
  publicDir: "dist" | "public";
}

export interface ProjectConfig {
  name: string;
  pm: pm;
  linter: linter;
  skipGit: boolean;
  skipInstall: boolean;
  quiet: boolean;
}

export interface PromptResponses {
  name: string;
  pm: pm;
  linter: linter;
  skipGit: boolean;
  skipInstall: boolean;
}

export interface PromptOptions {
  name?: string;
  pm?: pm;
  linter?: linter;
  skipGit?: boolean;
  skipInstall?: boolean;
}
