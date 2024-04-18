import { env } from "@/env.mjs";
import winstonDevConsole from "@epegzz/winston-dev-console";
import winston from "winston";

const { combine, timestamp, json } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

let logger = winston.createLogger({
  levels: logLevels,
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: "app.log",
      dirname: env.LOG_FOLDER ?? ".next/logs/",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger = winstonDevConsole.init(logger);
  logger.add(
    winstonDevConsole.transport({
      showTimestamps: false,
      addLineSeparation: true,
    }),
  );
}

export { logger };
