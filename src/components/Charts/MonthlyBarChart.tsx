"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  faturou: {
    label: "Faturou",
    color: "#184d8a",
  },
} satisfies ChartConfig;

interface Props {
  dados: { mes: string; valor: number }[];
}

export function MonthlyBarChart({ dados }: Props) {
  const chartData = dados.map((d) => ({
    month: d.mes,
    faturou: Number(d.valor),
  }));

  return (
    <Card className="border-none shadow-none w-full h-full">
      <CardContent className="p-0 h-full">
        <ChartContainer
          config={chartConfig}
          style={{ width: "100%", height: "100%", minHeight: 250 }}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="faturou" fill="var(--color-faturou)" radius={8} maxBarSize={70}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}