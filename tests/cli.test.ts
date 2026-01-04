import { execa } from "execa";
import { describe, test, expect } from "vitest";

import { CLI_PATH } from "./helpers";

describe("--help and --version", () => {
  test("displays help with --help flag", async () => {
    const { stdout } = await execa("node", [CLI_PATH, "--help"]);
    expect(stdout).toContain("create-webflow-extension");
    expect(stdout).toContain("Scaffold a new Webflow Designer Extension");
    expect(stdout).toContain("--pm");
    expect(stdout).toContain("--linter");
    expect(stdout).toContain("--quiet");
  });

  test("displays version with --version flag", async () => {
    const { stdout } = await execa("node", [CLI_PATH, "--version"]);
    expect(stdout).toMatch(/^\d+\.\d+\.\d+/);
  });
});
