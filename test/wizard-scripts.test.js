import { describe, test } from "node:test";
import { strict as assert } from "assert";
import prompts from "prompts";
import { createAppWizard } from "../src/wizard.js";

describe("wizard script dependencies", () => {
  test("lint script auto-enables eslint feature", async () => {
    prompts.inject([
      "lint-app",
      "Title",
      "",
      "",
      "MIT",
      [],
      ["lint"],
      true,
    ]);
    const answers = await createAppWizard();
    assert.ok(answers.features.includes("eslint"));
  });

  test("format script auto-enables prettier feature", async () => {
    prompts.inject([
      "fmt-app",
      "Title",
      "",
      "",
      "MIT",
      [],
      ["format"],
      true,
    ]);
    const answers = await createAppWizard();
    assert.ok(answers.features.includes("prettier"));
  });
});
