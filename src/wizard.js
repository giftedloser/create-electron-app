// File: src/wizard.js
import prompts from "prompts";
import { featureChoices } from "./config/featureSets.js";
import { scriptOptions } from "./config/scripts.js";

export async function createAppWizard() {
  const answers = {};

  console.log("\n📦 Project Metadata");
  const meta = await prompts([
    {
      type: "text",
      name: "appName",
      message: "App name (alphanumeric, dashes, underscores, no spaces):",
      validate: val =>
        val && /^[a-zA-Z0-9-_]+$/.test(val)
          ? true
          : "Alphanumeric, dashes, underscores only, no spaces allowed."
    },
    {
      type: "text",
      name: "title",
      message: "Window title:",
      initial: "MyApp"
    },
    {
      type: "text",
      name: "description",
      message: "App description:",
      initial: "A secure Electron app."
    },
    {
      type: "text",
      name: "author",
      message: "Author:"
    },
    {
      type: "text",
      name: "license",
      message: "License:",
      initial: "MIT"
    }
  ]);
  Object.assign(answers, meta);

  console.log("\n🧱 Feature Selection");
  const featurePrompt = await prompts({
    type: "multiselect",
    name: "features",
    message: "Select core features:",
    choices: featureChoices,
    instructions: false,
    min: 1
  });
  Object.assign(answers, featurePrompt);

  console.log("\n🧰 Dev Script Options");
  const scriptPrompt = await prompts({
    type: "multiselect",
    name: "scripts",
    message: "Select dev scripts to include:",
    choices: scriptOptions,
    instructions: false,
    min: 1
  });
  Object.assign(answers, scriptPrompt);

  return answers;
}
