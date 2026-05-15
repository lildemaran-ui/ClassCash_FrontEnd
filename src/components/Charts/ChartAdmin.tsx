// src/components/Charts/ChartAdmin.tsx
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

interface Props {
  data?: { mes: string; total: number }[];
  isLoading?: boolean;
}

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2 text-sm">
        <p className="text-gray-500 text-xs mb-0.5">{label}</p>
        <p className="font-medium text-gray-900">
          {payload[0].value}{" "}
          <span className="text-xs font-normal text-gray-400">estudantes</span>
        </p>
      </div>
    );
  }
  return null;
};

export function ChartAdmin({ data, isLoading }: Props) {
  // Converte "2024-03" → { month: "Mar", Estudantes: 15 }
  const chartData = (data ?? []).map((item) => {
    const [, month] = item.mes.split("-");
    return {
      month: MESES[parseInt(month, 10) - 1] ?? item.mes,
      Estudantes: item.total,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 h-full">
      <div className="border-b border-gray-100 pb-3 mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-800">Cadastros mensais</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Estudantes nos últimos meses
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-[#184d8a] inline-block" />
          Estudantes
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-[#184d8a]" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex justify-center items-center py-10 text-sm text-gray-400">
          Sem dados disponíveis
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={32} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickMargin={4}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
            <Bar dataKey="Estudantes" fill="#184d8a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}