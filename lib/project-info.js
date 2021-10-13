import lodash from "lodash";
import ora from "ora";
import { isFileExists } from "./files-handler.js";
import { loadJsonFile } from "load-json-file";
const { get } = lodash;

export const getPackageJson = async () => {
  try {
    return await loadJsonFile("package.json");
  } catch (err) {
    return null;
  }
};

export const getPackageManager = async () => {
  const isNpmPackage = isFileExists("package-lock.json");
  const isYarnPackage = isFileExists("yarn.lock");

  if (isNpmPackage) return "npm";
  if (isYarnPackage) return "yarn";

  return null;
};

export const getDefaultProjectInfo = async () => {
  const spinner = ora("Gathering project information...").start();

  const packageJson = await getPackageJson();
  const isJSRepo = !!packageJson;
  const packageManager = isJSRepo ? getPackageManager() : null;
  const projectName = isJSRepo ? get(packageJson, "name", null) : null;
  const projectDescription = isJSRepo
    ? get(packageJson, "description", null)
    : null;
  const version = isJSRepo ? get(packageJson, "version", null) : null;
  const license = isJSRepo ? get(packageJson, "license", null) : null;
  const author = isJSRepo ? get(packageJson, "author", null) : null;
  const startCommand = isJSRepo
    ? get(packageJson, "scripts.start", null)
    : null;
  const testCommand = isJSRepo ? get(packageJson, "scripts.test", null) : null;
  const engines = isJSRepo ? get(packageJson, "engines", null) : null;

  spinner.succeed("Project infos gathered");

  return {
    isJSRepo,
    packageManager,
    projectName,
    projectDescription,
    version,
    license,
    author,
    startCommand,
    testCommand,
    engines,
  };
};
