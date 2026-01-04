import { existsSync, mkdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { beforeEach, afterEach } from "vitest";

export const CLI_PATH = resolve("./dist/index.js");
export const CLI_TIMEOUT = 120_000;

let testDir: string;

export function getTestDir() {
  return testDir;
}

export function setupTestDir() {
  beforeEach(() => {
    testDir = join(tmpdir(), `cli-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
  });
}
