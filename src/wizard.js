// File: src/wizard.js
import prompts from "prompts";
import chalk from "chalk";
import boxen from "boxen";
import { featureChoices } from "./config/featureSets.js";
import { scriptOptions } from "./config/scripts.js";
import { info } from "./utils/logger.js";

function printStepHeader(stepNum, totalSteps, title) {
  info(
    chalk.bgBlue.black(` Step ${stepNum}/${totalSteps} `) + " " + chalk.bold.underline(title) + "\n"
  );
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
    instructions: false,
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
    instructions: false,
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
