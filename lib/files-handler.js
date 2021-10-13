import * as fs from "fs";
import * as path from "path";
import touch from "touch";
import { errorLogger } from "./utils.js";

export const getCurrentDirectoryBase = () => {
  return path.basename(process.cwd());
};

export const isFileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    errorLogger(`Error occured: ${error}`, 1);
  }
};

export const isDirectoryExists = (filePath) => {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (err) {
    errorLogger(`Error occured: ${error}`, 1);
  }
};

export const isGitRepository = () => {
  if (this.isDirectoryExists(".git")) {
    errorLogger("Sorry the directory is already a git repository!", 1);
  }
};

export const validateFilePaths = (filePaths) => {
  try {
    filePaths.forEach((filePath) => {
      if (!fs.existsSync(filePath)) {
        errorLogger(`File not found: ${filePath}`, 1);
      }
    });
  } catch (error) {
    errorLogger(`Error occured: ${error}`, 1);
  }
};

export const getFullFilePath = (filePath) => {
  return path.join(process.cwd(), filePath);
};

export const createFile = (filePath) => {
  touch(filePath);
};
