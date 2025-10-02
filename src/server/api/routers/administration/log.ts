import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import fs from "fs";
import path from "path";
import readline from "readline";

interface LogEntry {
  context: string;
  level: "info" | "error" | "warn" | "debug";
  message: string;
  [key: string]: unknown;
  timestamp?: string;
}

export const LogsRouter = createTRPCRouter({
  getAllLogs: protectedProcedure.query(async () => {
    const logsDir = path.join(process.cwd(), env.LOG_FOLDER);

    // Récupérer uniquement les fichiers .jsonl
    const files = (await fs.promises.readdir(logsDir)).filter((f) =>
      f.startsWith("app"),
    );

    const allLogs: LogEntry[] = [];

    for (const file of files) {
      const filePath = path.join(logsDir, file);

      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (line.trim().length === 0) continue;
        try {
          const parsed = JSON.parse(line) as LogEntry;
          allLogs.push(parsed);
        } catch {
          allLogs.push({
            error: "Invalid JSON",
            raw: line,
            context: "",
            level: "warn",
            message: "",
          });
        }
      }
    }

    // Tri par date (si timestamp présent)
    allLogs.sort((a, b) => {
      const ta = a.timestamp
        ? new Date(a.timestamp).getTime()
        : Number.MAX_SAFE_INTEGER;
      const tb = b.timestamp
        ? new Date(b.timestamp).getTime()
        : Number.MAX_SAFE_INTEGER;
      return ta - tb;
    });

    const lastLogs = allLogs.slice(-1000);

    // Normaliser : regrouper les clés "non connues" dans data
    const normalized = lastLogs.map((log) => {
      const { context, level, message, timestamp, ...rest } = log;

      // Fusionner les clés "rest" → dans un objet data
      return {
        context,
        level,
        message,
        timestamp,
        data: rest,
      };
    });

    return normalized;
  }),
});
