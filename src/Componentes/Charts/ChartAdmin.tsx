"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A simple area chart"

const chartData = [
  { month: "Janeiro", Estudantes: 86 },
  { month: "Fevereiro", Estudantes: 15 },
  { month: "Março", Estudantes: 37 },
  { month: "Abril", Estudantes: 73 },
  { month: "Maio", Estudantes: 100 },
  { month: "Junho", Estudantes: 14 },
  { month: "Julho", Estudantes: 0 },
  { month: "Agosto", Estudantes: 29 },
  { month: "Setembro", Estudantes: 84 },
  { month: "Outubro", Estudantes: 114 },
  { month: "Novembro", Estudantes: 14 },
  { month: "Dezembro", Estudantes: 14 },
 
]

const chartConfig = {
  Estudantes: {
    label: "Estudantes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartAreaDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[9/4] w-full max-h-[350px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="Estudantes"
              type="natural"
              fill="#268cff"
              fillOpacity={0.4}
              stroke="#268cffd5"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
