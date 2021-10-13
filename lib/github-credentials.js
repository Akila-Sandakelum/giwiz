import chalk from "chalk";
import { Octokit } from "octokit";
import { readFile } from "fs/promises";
import Configstore from "configstore";
import { inquireGithubAccessToken } from "./inquirer.js";
import { successLogger, errorLogger } from "./utils.js";

const pkg = JSON.parse(await readFile("package.json", "utf8"));
const conf = new Configstore(pkg.name);

let octoKitInstance;

export const getInstance = (token) => {
  if (!token) {
    token = getGithubTokenFromStore();
    token = token["token"];
  }
  if (octoKitInstance == null) {
    octoKitInstance = new Octokit({
      auth: token,
    });
    return octoKitInstance;
  }
  return octoKitInstance;
};

export const getGithubTokenFromStore = () => {
  return conf.get("github_credentials.token");
};

export const saveGithubTokenInStore = (token) => {
  try {
    conf.set("github_credentials.token", token);
    successLogger(`Token successfully saved 📌`);
  } catch (error) {
    console.log(
      errorLogger(`Error occurred while saving token 🧐 : ${error}`, 1)
    );
  }
};

export const authenticateWithGithub = async (token) => {
  const okt = getInstance(token["token"]);
  try {
    const res = await okt.request("GET /user");
    successLogger(
      `Successfully authenticated with Github as ${chalk.yellowBright.bold(
        JSON.stringify(res.data.login)
      )} 🔥`
    );
  } catch (error) {
    errorLogger(
      `Error occurred in authenticating with Github. Please insert a valid token 👈 : ${error}`,
      1
    );
  }
};

export const setGithubTokenInStore = async () => {
  const token = await inquireGithubAccessToken();
  await authenticateWithGithub(token);
  saveGithubTokenInStore(token);
};
