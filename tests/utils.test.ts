import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import { directoryExists, sanitizeProjectName } from "../src/utils.js";
import { getTestDir, setupTestDir } from "./helpers.js";

describe("Sanitize Project Name", () => {
  test("converts to lowercase", () => {
    expect(sanitizeProjectName("MyExtension")).toBe("myextension");
    expect(sanitizeProjectName("UPPERCASE")).toBe("uppercase");
  });

  test("replaces spaces with hyphens", () => {
    expect(sanitizeProjectName("my extension")).toBe("my-extension");
    expect(sanitizeProjectName("my   extension")).toBe("my-extension");
  });

  test("removes special characters", () => {
    expect(sanitizeProjectName("test@#$name")).toBe("testname");
    expect(sanitizeProjectName("hello_world!")).toBe("helloworld");
  });

  test("collapses multiple hyphens", () => {
    expect(sanitizeProjectName("my--extension")).toBe("my-extension");
    expect(sanitizeProjectName("a---b---c")).toBe("a-b-c");
  });

  test("removes leading and trailing hyphens", () => {
    expect(sanitizeProjectName("-my-extension-")).toBe("my-extension");
    expect(sanitizeProjectName("---test---")).toBe("test");
  });

  test("trims whitespace", () => {
    expect(sanitizeProjectName("  my-extension  ")).toBe("my-extension");
  });

  test("returns default name for empty input", () => {
    expect(sanitizeProjectName("")).toBe("my-webflow-extension");
    expect(sanitizeProjectName("   ")).toBe("my-webflow-extension");
    expect(sanitizeProjectName("@#$%")).toBe("my-webflow-extension");
  });

  test("truncates to 214 characters", () => {
    const longName = "a".repeat(300);
    expect(sanitizeProjectName(longName).length).toBe(214);
  });

  test("handles realistic project names", () => {
    expect(sanitizeProjectName("My Webflow Extension")).toBe(
      "my-webflow-extension"
    );
    expect(sanitizeProjectName("Cool App 2024")).toBe("cool-app-2024");
    expect(sanitizeProjectName("test.extension.name")).toBe(
      "testextensionname"
    );
  });
});

describe("Directory Exists", () => {
  setupTestDir();

  test("returns true for existing directory", async () => {
    expect(await directoryExists(getTestDir())).toBe(true);
  });

  test("returns false for non-existent path", async () => {
    expect(await directoryExists(join(getTestDir(), "does-not-exist"))).toBe(
      false
    );
  });

  test("returns false for file path", async () => {
    const filePath = join(getTestDir(), "test-file.txt");
    writeFileSync(filePath, "test");
    expect(await directoryExists(filePath)).toBe(false);
  });
});
