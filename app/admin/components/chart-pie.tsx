"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";

export const description = "A donut chart with text";

/* const chartConfig = {
  members: {
    label: "Adhérents",
  },
  "Temple Run": {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  "Temple Gym Junior": {
    label: "Safari",
    color: "var(--chart-2)",
  },
  Temple Gym: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig; */

export function MemberChartPie() {
  const fetch = trpc.association.dashboard.getSeasonPieInformation.useQuery({});

  return (
    <Card className="flex flex-col w-64 h-[274px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Adhérents</CardTitle>
        <CardDescription>Saison 2025/2026</CardDescription>
      </CardHeader>
      <CardContent
        className={cn("flex-1 pb-0", fetch.isLoading && "animate-pulse")}
      >
        {(!fetch.isLoading && fetch.data) && <MemberChartPieContent data={fetch.data} />}
      </CardContent>
    </Card>
  );
}

const MemberChartPieContent = ({
  data,
}: {
  data: {
    chartData: { course: string; members: number; fill: string }[];
    chartConfig: { members: { label: string } };
    totalMembers: number;
  };
}) => {
  console.log(data);
  return (
    <ChartContainer
      config={data.chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data.chartData}
          dataKey="members"
          nameKey="course"
          innerRadius={45}
          outerRadius={60}
          paddingAngle={10}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {data.totalMembers.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Adhérents
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="course" />}
          className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
};
