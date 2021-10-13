import { Command } from "commander/esm.mjs";
import clear from "clear";
import ora from "ora";
import {
  getGithubTokenFromStore,
  setGithubTokenInStore,
} from "./lib/github-credentials.js";
import * as repo from "./lib/create-repo.js";
import { renderReadmeFile } from "./lib/create-readme.js";
import { inquireReadmeDetails } from "./lib/inquirer.js";
import { createGitIgnoreFile } from "./lib/create-gitignore.js";
import {
  successLogger,
  errorLogger,
  boxLogger,
  successSpinner,
} from "./lib/utils.js";
import { BANNER_TEXT } from "./lib/constants.js";

export const gitwizCli = (args) => {
  const gitwiz = new Command();
  gitwiz
    .command("init")
    .description("Draw app banner")
    .action(() => {
      clear();
      boxLogger(BANNER_TEXT);
    });

  gitwiz
    .command("authenticate")
    .alias("-auth")
    .description("Set up Github authentication")
    .action(async () => {
      let token = getGithubTokenFromStore();
      if (!token) {
        await setGithubTokenInStore();
      } else {
        successLogger(`You are already authenticated with Github 👌`);
      }
    });

  gitwiz
    .command("create-readme")
    .alias("readme")
    .description("Add README.md file")
    .action(async () => {
      const answers = await inquireReadmeDetails();
      await renderReadmeFile(answers);
    });

  gitwiz
    .command("create-gitignore")
    .alias("ignore")
    .description("Add .gitignore file")
    .action(async () => {
      await createGitIgnoreFile();
    });

  gitwiz
    .command("create-repo")
    .alias("repo")
    .description("Setup repository")
    .action(async () => {
      try {
        const url = await repo.createRemoteRepository();
        await repo.createGitIgnoreFile();
        const complete = await repo.setUpRepository(url, "origin", "master");
        if (complete) {
          successLogger(`All done 🔥`);
        }
        successLogger(`All done 🔥`);
      } catch (error) {
        if (error) {
          switch (error.status) {
            case 401:
              errorLogger(
                "Could not log you in. Please authenticate with Github first 🔐"
              );
              break;
            case 422:
              errorLogger(
                "Already exists a remote repository with the same name"
              );
              break;
            default:
              errorLogger(`Error occured: ${error}`);
              break;
          }
        }
      }
    });

  gitwiz
    .command("commit")
    .alias("co")
    .description("Commit changes")
    .action(async () => {
      const spinner = ora("Making commit").start();
      await repo
        .commitRepository()
        .then((result) => {
          spinner.succeed(successSpinner("Commit succes!"));
          console.log(result);
        })
        .catch((err) => {
          spinner.fail(`Commit failed! : ${err}`);
        });
      /* try {
        const complete = await repo.commitRepository();

        spinner.succeed("Commit succes!");
        console.log(complete);
      } catch (err) {
        spinner.fail(`Commit failed! : ${err}`);
      } */
    });

  gitwiz.parse(args);
  if (!gitwiz.args.length) {
    gitwiz.help();
  }
};
