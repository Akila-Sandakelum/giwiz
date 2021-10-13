import { readdir, writeFile } from "fs/promises";
import without from "lodash/without.js";
import ora from "ora";
import simpleGit from "simple-git";
const git = simpleGit();

import { errorLogger, successSpinner } from "./utils.js";
import { createFile } from "./files-handler.js";
import { inquireGitIgnoreFiles } from "./inquirer.js";

export const createGitIgnoreFile = async () => {
  //   const filesList = without((await fs).readdirSync("."), ".git", ".gitignore");
  //   const spinner = ora("Creating .gitignore...").start();
  const filesList = without(await readdir("."), ".git", ".gitignore");

  if (filesList.length) {
    const answers = await inquireGitIgnoreFiles(filesList);
    const spinner = ora("Creating .gitignore...").start();
    if (answers.ignore.length) {
      await writeFile(".gitignore", answers.ignore.join("\n"));
      spinner.succeed(successSpinner(".gitignore file created!"));
    } else {
      createFile(".gitignore");
      spinner.succeed(successSpinner(".gitignore file created!"));
    }
  } else {
    const spinner = ora("Creating .gitignore...").start();
    createFile(".gitignore");
    spinner.succeed(successSpinner(".gitignore file created!"));
  }
};
