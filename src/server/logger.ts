import { env } from "@/env.mjs";
import winstonDevConsole from "@epegzz/winston-dev-console";
import winston from "winston";
import DailyRotationFile from "winston-daily-rotate-file";

const { combine, timestamp, json, colorize, align, printf, errors } =
  winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

let winstonLogger: winston.Logger;

if (env.NODE_ENV !== "production") {
  winstonLogger = winston.createLogger({
    levels: logLevels,
    level: "debug",
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: "YYYY-MM-DD hh:mm:ss.SSS A",
      }),
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
      errors({ stack: true }),
    ),
    transports: [
      winstonDevConsole.transport({
        showTimestamps: false,
        addLineSeparation: true,
      }),
    ],
  });
} else {
  winstonLogger = winston.createLogger({
    levels: logLevels,
    level: env.NODE_ENV === "production" ? env.LOG_LEVEL ?? "info" : "debug",
    format: combine(timestamp(), json()),
    transports: [
      new DailyRotationFile({
        filename: "app-%DATE%.log",
        dirname: env.LOG_FOLDER ?? ".next/logs/",
        datePattern: "DD-MM-YYYY",
        maxSize: "20m",
        maxFiles: "7d",
      }),
    ],
  });
}

const logger = winstonLogger;

export default logger;
