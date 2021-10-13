import ejs from "ejs";
import ora from "ora";
import * as fs from "fs/promises";
import {
  validateFilePaths,
  getFullFilePath,
  createFile,
} from "./files-handler.js";

const readmeFilePath = getFullFilePath("README.md");
const readmeTemplatePath = getFullFilePath(
  "/templates/README-BASIC-template.md"
);

export const renderReadmeFile = async (data) => {
  createFile(readmeFilePath);
  validateFilePaths([readmeFilePath, readmeTemplatePath]);
  await copyTemplate();
  const template = await readTemplateFile();
  const content = ejs.render(template, data);
  await writeReadme(content, readmeFilePath);
};

export const copyTemplate = async () => {
  await fs.copyFile(readmeTemplatePath, readmeFilePath);
};

export const readTemplateFile = async () => {
  return fs.readFile(readmeTemplatePath, "utf8");
};

export const writeReadme = async (readmeContent, readmeFilePath) => {
  const spinner = ora("Creating README").start();

  try {
    await fs.writeFile(readmeFilePath, unescape(readmeContent));
    spinner.succeed("README created");
  } catch (err) {
    spinner.fail("README creation fail");
    throw err;
  }
};
