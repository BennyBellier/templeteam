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

export interface LogParams {
  message: string;
  context:
    | "Prisma"
    | "tRPC"
    | "API"
    | "Authentication"
    | "nodemailer"
    | "AssociationRegistration"
    | "FileManipulation"
    | "NextCached";
  requestPath?: string;
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
