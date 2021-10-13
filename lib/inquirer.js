import inquirer from "inquirer";
import chalk from "chalk";
import { getCurrentDirectoryBase } from "./files-handler.js";
import { getDefaultProjectInfo } from "./project-info.js";

import minimist from "minimist";
let argv = minimist(process.argv.slice(2));

export const inquireGithubAccessToken = () => {
  const questions = [
    {
      name: "token",
      type: "input",
      message: createMessage("Enter your Github Personal Access Token (PAT):"),
      validate: (value) => {
        if (!value.length) {
          return "Please enter your Github Personal Access Token (PAT)!";
        }
        return true;
      },
    },
  ];
  return inquirer.prompt(questions);
};

export const inquireRepositoryDetails = () => {
  const questions = [
    {
      name: "name",
      type: "input",
      message: createMessage("Please enter the name of the repository"),
      default: argv._[0] || getCurrentDirectoryBase(),
      validate: (value) => {
        if (value.length) {
          return true;
        } else {
          console.log("Please enter a name for the repository!");
          return false;
        }
      },
    },
    {
      name: "description",
      type: "input",
      message: createMessage(
        "Now you can choose to enter a description for the repository (Optional)"
      ),
      default: argv._[1] || null,
    },
    {
      name: "visibility",
      type: "input",
      message: createMessage(
        "Would you like to set the repository as public or private"
      ),
      choices: ["public", "private"],
      default: "public",
    },
  ];
  return inquirer.prompt(questions);
};

export const inquireGitIgnoreFiles = async (ignoredList) => {
  const questions = [
    {
      name: "ignore",
      type: "checkbox",
      message: createMessage(
        "Select the files or directories that you want to ignore:"
      ),
      choices: ignoredList,
      default: ["node_modules"],
    },
  ];
  return inquirer.prompt(questions);
};

export const inquireReadmeDetails = async () => {
  const projectInfo = await getDefaultProjectInfo();
  const questions = [
    {
      name: "projectName",
      type: "input",
      message: createMessage("Project Name: "),
      default: projectInfo.projectName,
      validate: (value) => {
        if (value.length) {
          return true;
        } else {
          console.log("Please enter the name of the project");
          return false;
        }
      },
    },
    {
      name: "projectDescription",
      type: "input",
      message: createMessage("Project description: "),
      default: projectInfo.projectDescription,
      validate: (value) => {
        if (value.length) {
          return true;
        } else {
          console.log("Please enter a description");
          return false;
        }
      },
    },
    {
      name: "projectVersion",
      type: "input",
      message: createMessage("Project version: "),
      default: projectInfo.version,
      validate: (value) => {
        if (value.length) {
          return true;
        } else {
          console.log("Please enter the version of the project!");
          return false;
        }
      },
    },
    {
      name: "install",
      type: "input",
      message: createMessage("Install command: "),
      default: projectInfo.installCommand,
    },
    {
      name: "run",
      type: "input",
      message: createMessage("Run command: "),
      default: projectInfo.startCommand,
    },
    {
      name: "test",
      type: "input",
      message: createMessage("Test command: "),
      default: projectInfo.testCommand,
    },
    {
      name: "author",
      type: "input",
      message: createMessage("Author: "),
      default: projectInfo.author,
    },
    {
      name: "license",
      type: "input",
      message: createMessage("License: "),
      default: projectInfo.license,
    },
  ];
  return inquirer.prompt(questions);
};

const createMessage = (message) => {
  return chalk.hex("#429FFD").bold(message);
};
