import { createTRPCRouter } from "@/server/api/trpc";
import { LogsRouter } from "./log";

export const AdministrationRouter = createTRPCRouter({
  logs: LogsRouter,
});