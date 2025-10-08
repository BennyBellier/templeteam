"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface LogEntry {
  context: string;
  level: "info" | "error" | "warn" | "debug";
  message: string;
  data: unknown;
  timestamp: string;
}

function LogRow({ log }: { log: LogEntry }) {
  const [expanded, setExpanded] = useState(false);

  const levelColors = {
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    warn: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    debug: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  const isDataEmpty = (data: unknown): boolean => {
    if (data == null) return true;

    if (Array.isArray(data)) {
      return data.length === 0;
    }

    if (typeof data === "object") {
      return Object.keys(data).length === 0;
    }

    return false;
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    // Si moins d'une heure, afficher "il y a X min"
    if (diffMins < 60) {
      return diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
    }

    // Sinon afficher l'heure complète
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="border-b border-border/50 transition-colors hover:bg-muted/10">
      {/* Mobile & Tablet: Vertical layout */}
      <div className="flex flex-col gap-2 p-3 sm:p-4 lg:hidden">
        <div className="flex items-center gap-2">
          {!isDataEmpty(log.data) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 sm:h-7 sm:w-7"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {isDataEmpty(log.data) && <div className="w-6 shrink-0 sm:w-7" />}

          <div className="flex flex-wrap gap-1">
            <Badge
              variant="outline"
              className={`${levelColors[log.level]} shrink-0 font-mono text-[10px] uppercase sm:text-xs`}
            >
              {log.level}
            </Badge>

            <Badge
              variant="outline"
              className="shrink-0 text-wrap border-border bg-muted/50 text-[10px] text-muted-foreground sm:text-xs"
            >
              {log.context}
            </Badge>
          </div>

          <Typography
            as="span"
            className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground sm:text-xs"
          >
            {formatTimestamp(log.timestamp)}
          </Typography>
        </div>

        <p className="pl-8 text-xs text-foreground sm:pl-9 sm:text-sm">
          {log.message}
        </p>
      </div>

      <div className="hidden items-start gap-4 p-4 lg:flex">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {!isDataEmpty(log.data) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {isDataEmpty(log.data) && <div className="w-5 shrink-0" />}

          <Typography
            as="span"
            className="shrink-0 font-mono text-xs text-muted-foreground"
          >
            {formatTimestamp(log.timestamp)}
          </Typography>

          <Badge
            variant="outline"
            className={`${levelColors[log.level]} shrink-0 font-mono text-xs uppercase`}
          >
            {log.level}
          </Badge>

          <Badge
            variant="outline"
            className="shrink-0 border-border bg-muted/50 text-muted-foreground"
          >
            {log.context}
          </Badge>

          <p className="min-w-0 flex-1 text-sm text-foreground">
            {log.message}
          </p>
        </div>
      </div>

      {/* Expanded data section */}
      {expanded && !isDataEmpty(log.data) && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 lg:pl-16">
          <pre className="text-wrap rounded-lg border border-border/30 bg-black/10 p-3 font-mono text-[10px] text-muted-foreground sm:p-4 sm:text-xs">
            {JSON.stringify(log.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function LogsPage({ sampleLogs }: { sampleLogs: LogEntry[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [contextFilter, setContextFilter] = useState<string>("all");

  // Extract unique contexts
  const contexts = useMemo(() => {
    const uniqueContexts = new Set(sampleLogs.map((log) => log.context));
    return Array.from(uniqueContexts).sort();
  }, [sampleLogs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return sampleLogs.filter((log) => {
      const matchesSearch =
        searchQuery === "" ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.context.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel = levelFilter === "all" || log.level === levelFilter;

      const matchesContext =
        contextFilter === "all" || log.context === contextFilter;

      return matchesSearch && matchesLevel && matchesContext;
    });
  }, [sampleLogs, searchQuery, levelFilter, contextFilter]);

  // Count by context
  const contextCounts = useMemo(() => {
    return sampleLogs.reduce(
      (acc, log) => {
        acc[log.context] = (acc[log.context] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [sampleLogs]);

  return (
    <Card className="border-border bg-card">
      {/* Filters section - Responsive layout */}
      <div className="border-b border-border/50 p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search bar - Full width on mobile */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border bg-background pl-10 text-sm"
            />
          </div>

          {/* Filters - Stacked on mobile, side by side on tablet+ */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full border-border bg-background sm:w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warn</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select value={contextFilter} onValueChange={setContextFilter}>
              <SelectTrigger className="w-full border-border bg-background sm:w-[200px]">
                <SelectValue placeholder="Filter by context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contexts</SelectItem>
                {contexts.map((context) => (
                  <SelectItem key={context} value={context}>
                    {context} ({contextCounts[context]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Logs list - Responsive height */}
      <ScrollArea className="h-[400px] w-auto sm:h-[500px] md:h-[550px] lg:h-[644px]">
        <div className="divide-y divide-border/50">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center sm:p-12">
              <p className="text-sm text-muted-foreground sm:text-base">
                No logs found
              </p>
            </div>
          ) : (
            filteredLogs.map((log, index) => <LogRow key={index} log={log} />)
          )}
        </div>
      </ScrollArea>

      {/* Footer - Responsive padding and text */}
      <div className="border-t border-border/50 bg-muted/20 p-3 sm:p-4">
        <p className="text-center text-xs text-muted-foreground">
          Showing {filteredLogs.length} of {sampleLogs.length} logs
        </p>
      </div>
    </Card>
  );
}
