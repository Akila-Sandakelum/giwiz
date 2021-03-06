import { readdir, writeFile } from "fs/promises";

import without from "lodash/without.js";
import ora from "ora";
import simpleGit from "simple-git";
const git = simpleGit();

import { getInstance } from "./github-credentials.js";
import { errorLogger, successSpinner, errorSpinner } from "./utils.js";
import { createFile } from "./files-handler.js";
import { inquireRepositoryDetails, inquireGitIgnoreFiles } from "./inquirer.js";

export const createRemoteRepository = async () => {
  const answers = await inquireRepositoryDetails();
  const data = {
    name: answers.name,
    description: answers.description,
    private: answers.visibility === "private",
  };

  const octokit = getInstance();
  try {
    const result = await octokit.request("POST /user/repos", data);
    return result.data.ssh_url;
  } catch (error) {
    errorLogger("Error occurred in creating the repo!", null);
    throw error;
  }
};

export const createGitIgnoreFile = async () => {
  /* const filesList = without((await fs).readdirSync("."), ".git", ".gitignore");
  if (filesList.length) {
    const answers = await inquireGitIgnoreFiles(filesList);
    const spinner = ora("Creating .gitignore...").start();
    if (answers.ignore.length) {
      (await fs).writeFileSync(".gitignore", answers.ignore.join("\n"));
      spinner.succeed(successSpinner(".gitignore file created!"));
    } else {
      createFile(".gitignore");
      spinner.succeed(successSpinner(".gitignore file created!"));
    }
  } else {
    createFile(".gitignore");
    spinner.succeed(successSpinner(".gitignore file created!"));
  } */
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

export const setUpRepository = async (url, remote, branch) => {
  const spinner = ora("Setting up repo...").start();
  try {
    await git
      .init()
      .add("./*")
      .add(".gitignore")
      .commit("Yey, this repositoty was created with Gitwiz ????")
      .addRemote(remote, url)
      .push(remote, branch);
    spinner.succeed(successSpinner("repo created!"));
  } catch (error) {
    // errorLogger(`Error setting up repository: ${error}`);
    spinner.fail(errorSpinner("Error setting up repository"));
  }
};

export const commitRepository = async () => {
  try {
    await git
      // .checkoutBranch("test", "master")
      .add("./*")
      .commit("Refactored index")
      .push("origin", "test");
  } catch (error) {
    // errorLogger(`Error in commiting: ${error}`);
    throw error;
  }
};
