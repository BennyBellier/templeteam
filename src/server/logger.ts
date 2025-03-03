import { env } from "@/env.mjs";
import winstonDevConsole from "@epegzz/winston-dev-console";
import winston from "winston";
import DailyRotationFile from "winston-daily-rotate-file";

/* const { combine, timestamp, json, colorize, align, printf, errors } =
  winston.format; */

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const winstonLogger = winston.createLogger({
  levels: logLevels,
  level: env.NODE_ENV === "production" ? (env.LOG_LEVEL ?? "info") : "debug",
  transports: [
    env.NODE_ENV === "production"
      ? new DailyRotationFile({
          filename: "app-%DATE%.log",
          dirname: env.LOG_FOLDER ?? ".next/logs/",
          level: env.LOG_LEVEL ?? "info",
          datePattern: "DD-MM-YYYY",
          maxSize: "20m",
          maxFiles: "7d",
        })
      : new winston.transports.File({
          filename: "app.log",
          dirname: env.LOG_FOLDER ?? "logs/",
          maxsize: 5 * 1024 * 1024,
          maxFiles: 3,
          level: "info"
        }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exception.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
  exitOnError: false,
});

if (env.NODE_ENV !== "production") {
  winstonDevConsole.init(winstonLogger);
  winstonLogger.add(
    winstonDevConsole.transport({
      showTimestamps: false,
      addLineSeparation: true,
    }),
  );
}

export interface LogParams {
  message: string;
  context: "Prisma" | "tRPC" | "API" | "Authentication" | "nodemailer" | "AssociationRegistration" | "FileManipulation" | "NextCached";
  requestPath?: string,
  data?: unknown;
  userId?: string;
  requestId?: string;
}

const formatLog =
  (level: "debug" | "info" | "warn" | "error" | "fatal") =>
  ({ message, context, data, userId, requestId }: LogParams) => {
    winstonLogger.log(level, message, {
      context,
      data,
      userId,
      requestId,
    });
  };

const logger = {
  fatal: formatLog("fatal"),
  warn: formatLog("warn"),
  error: formatLog("error"),
  info: formatLog("info"),
  debug: formatLog("debug"),
};

export default logger;
export { winstonLogger };
