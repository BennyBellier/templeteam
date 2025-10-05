"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useSeasons } from "@/providers/SeasonProvider";
import { trpc } from "@/trpc/TrpcProvider";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
  paid: {
    label: "Payé",
    color: "var(--chart-3)",
  },
  overdue: {
    label: "Impayé",
    color: "transparent",
  },
} satisfies ChartConfig;

export function OverallContributionChartJauge() {
  const { currentSeason } = useSeasons();
  const fetch =
    trpc.association.dashboard.getOverallContributionStatus.useQuery({
      season: currentSeason ?? undefined,
    });

  return (
    <Card className="flex h-[274px] w-64 flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cotisation réglé</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "relative flex-1 items-center my-auto pb-0",
          fetch.isLoading && "animate-pulse",
        )}
      >
        {!fetch.isLoading && fetch.data && (
          <OverallContributionChartJaugeContent data={fetch.data} />
        )}
      </CardContent>
    </Card>
  );
}

const OverallContributionChartJaugeContent = ({
  data,
}: {
  data: {
    chartData: {
      paid: number;
      overdue: number;
    }[];
    total: number;
  };
}) => {
  return (
    <>
      <div className="flex items-center justify-center gap-4 text-xs absolute bottom-1/4 left-1/2 -translate-x-1/2">
        <div
          className={cn(
            "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
          )}
        >
          <div className="h-2 w-2 shrink-0 rounded-[2px] bg-[--chart-3]" />
          cotisation réglé
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[250px]"
      >
        <RadialBarChart
          data={data.chartData}
          startAngle={180}
          endAngle={0}
          innerRadius={80}
          outerRadius={130}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
            defaultIndex={1}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) - 16}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {data.total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 4}
                        className="fill-muted-foreground"
                      >
                        cotisations
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="paid"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-paid)"
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="overdue"
            stackId="a"
            fill="var(--color-overdue)"
            className="stroke-transparent stroke-2"
            scale="5%"
          />
        </RadialBarChart>
      </ChartContainer>
    </>
  );
};
