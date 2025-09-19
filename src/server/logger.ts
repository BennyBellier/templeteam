/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/env.mjs";
import winstonDevConsole from "@epegzz/winston-dev-console";
import winston from "winston";

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
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      filename: "app.log", // fichier principal
      dirname: env.LOG_FOLDER ?? "logs/", // dossier
      maxsize: 1 * 1024 * 1024 * 1024, // 1 Go
      maxFiles: 10, // conserve 10 fichiers max
      tailable: true, // conserve toujours le dernier en "app.log"
      level: env.LOG_LEVEL ?? "info",
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

type LogInput = {
  message: string;
  [key: string]: unknown;
};

const logger = {
  fatal: (input: LogInput) => winstonLogger.log("fatal", input.message, input),
  error: (input: LogInput) => winstonLogger.log("error", input.message, input),
  warn: (input: LogInput) => winstonLogger.log("warn", input.message, input),
  info: (input: LogInput) => winstonLogger.log("info", input.message, input),
  debug: (input: LogInput) => winstonLogger.log("debug", input.message, input),
  trace: (input: LogInput) => winstonLogger.log("trace", input.message, input),
};

export default logger;
export { winstonLogger };
