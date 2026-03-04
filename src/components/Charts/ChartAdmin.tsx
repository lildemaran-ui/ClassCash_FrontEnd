"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartData = [
  { month: "Janeiro", Estudantes: 86 },
  { month: "Feveiro", Estudantes: 30 },
  { month: "Março", Estudantes : 37 },
  { month: "Abril", Estudantes: 73 },
  { month: "Maio", Estudantes: 9 },
  { month: "Junho", Estudantes: 14 },
  { month: "Julho", Estudantes: 4 },
  { month: "Agosto", Estudantes: 21 },
  { month: "Setembro", Estudantes: 14 },
  { month: "Outubro", Estudantes: 24 },
  { month: "Novembro", Estudantes: 2 },
  { month: "Dezembro", Estudantes: 0 },
]

const chartConfig = {
  Estudantes: {
    label: "Estudantes",
    color: "#268cff",
  },
} satisfies ChartConfig

export function ChartAdmin() {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-96">
          <CardTitle>Faturamento Mensal</CardTitle>
        <CardTitle>Mês</CardTitle>
        <CardTitle>Faturamento Mensal</CardTitle>
        </div>
        <CardDescription>Alunos que se cadastram mensalmente</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[9/4] w-full max-h-[350px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="Estudantes" fill="var(--color-Estudantes)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}
