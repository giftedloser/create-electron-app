// File: src/wizard.js
import prompts from "prompts";
import chalk from "chalk";
import boxen from "boxen";
import { featureChoices } from "./config/featureSets.js";
import { scriptOptions } from "./config/scripts.js";
import { info } from "./utils/logger.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"));
const CLI_NAME = Object.keys(pkg.bin)[0] || "create-electron-app";

function printWelcome() {
  const msg = `${chalk.bold(CLI_NAME)}\nA friendly wizard to scaffold your Electron project.`;
  info(boxen(msg, { padding: 1, borderColor: "cyan", margin: 1 }));
  info(chalk.gray("Use arrow keys to navigate, space to select, enter to confirm.\n"));
}

function printStepHeader(stepNum, totalSteps, title) {
  const header = chalk.bgBlue.black(` Step ${stepNum}/${totalSteps} `) + " " + chalk.bold(title);
  info(boxen(header, { padding: 0, borderColor: "blue", margin: 1 }));
}

function printDivider() {
  info(chalk.gray("─".repeat(60)) + "\n");
}

function renderSummary(answers) {
  const featureList = answers.features.map(f => `✅ ${f}`).join("\n");
  const scriptList = answers.scripts.map(s => `⚙️  ${s}`).join("\n");

  const summary = `
${chalk.bold("Project Summary")}

${chalk.underline("Metadata")}
Name: ${answers.appName}
Title: ${answers.title}
Author: ${answers.author}
License: ${answers.license}

${chalk.underline("Features")}
${featureList}

${chalk.underline("Scripts")}
${scriptList}
`;

  info(boxen(summary, { padding: 1, borderColor: "green", margin: 1 }));
}

export async function createAppWizard() {
  const answers = {};
  const totalSteps = 4;

  const onCancel = () => {
    console.log("Aborted.");
    process.exit(1);
  };

  printWelcome();

  printStepHeader(1, totalSteps, "Project Metadata");
  const meta = await prompts([
    {
      type: "text",
      name: "appName",
      message: chalk.cyan("App name (alphanumeric, dashes, underscores, no spaces):"),
      validate: val =>
        val && /^[a-zA-Z0-9-_]+$/.test(val)
          ? true
          : chalk.red("Alphanumeric, dashes, underscores only, no spaces allowed."),
    },
    {
      type: "text",
      name: "title",
      message: chalk.cyan("Window title:"),
      initial: "MyApp",
    },
    {
      type: "text",
      name: "description",
      message: chalk.cyan("App description:"),
      initial: "A secure Electron app.",
    },
    {
      type: "text",
      name: "author",
      message: chalk.cyan("Author:"),
    },
    {
      type: "text",
      name: "license",
      message: chalk.cyan("License:"),
      initial: "MIT",
    },
  ], { onCancel });
  Object.assign(answers, meta);
  printDivider();

  printStepHeader(2, totalSteps, "Feature Selection");
  const featurePrompt = await prompts({
    type: "multiselect",
    name: "features",
    message: chalk.cyan("Select core features:"),
    choices: featureChoices,
    instructions: "Use space to select and enter to continue",
    min: 1,
  }, { onCancel });
  Object.assign(answers, featurePrompt);
  printDivider();

  printStepHeader(3, totalSteps, "Dev Script Options");
  const scriptPrompt = await prompts({
    type: "multiselect",
    name: "scripts",
    message: chalk.cyan("Select dev scripts to include:"),
    choices: scriptOptions,
    instructions: "Toggle scripts with space. Enter to confirm",
    min: 1,
  }, { onCancel });
  Object.assign(answers, scriptPrompt);
  printDivider();

  printStepHeader(4, totalSteps, "Summary & Confirm");
  renderSummary(answers);

  const confirm = await prompts({
    type: "confirm",
    name: "proceed",
    message: chalk.yellow("Proceed with project creation?"),
    initial: true,
  }, { onCancel });
  if (!confirm.proceed) {
    info(chalk.red("Project creation aborted."));
    process.exit(1);
  }
  printDivider();

  info(chalk.green.bold("✅ Configuration confirmed. Starting scaffolding...\n"));

  return answers;
}
