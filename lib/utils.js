import chalk from "chalk";
import logSymbols from "log-symbols";
import {
  ERROR_COLOR_CODE,
  SUCCESS_COLOR_CODE,
  INFO_COLOR_CODE,
  HAPPY_COLOR_CODE,
} from "./constants.js";

export const errorLogger = (error, exitCode) => {
  console.log(logSymbols.error, chalk.hex(ERROR_COLOR_CODE).bold(error));

  if (exitCode !== 0 || exitCode == null) {
    process.exit(exitCode);
  }
};

export const successLogger = (message) => {
  console.log(logSymbols.success, chalk.hex(SUCCESS_COLOR_CODE).bold(message));
};

export const infoLogger = (message) => {
  console.log(logSymbols.info, chalk.hex(INFO_COLOR_CODE).bold(message));
};

export const boxLogger = (bannerText) => {
  console.log(
    boxen(
      chalk
        .hex(HAPPY_COLOR_CODE)
        .bold(figlet.textSync(bannerText, { horizontalLayout: "full" })),
      { padding: 1, margin: 1, borderStyle: "classic" }
    )
  );
};

export const successSpinner = (message) => {
  return `${chalk.hex(SUCCESS_COLOR_CODE).bold(message)}`;
};
