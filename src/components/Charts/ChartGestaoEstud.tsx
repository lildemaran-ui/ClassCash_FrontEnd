import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

// --- Interfaces e Tipagens ---
interface TitanicDatum {
  Survived: "Ativos" | "Inativos";
  Count: number;
}

interface ChartDatum {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const titanicData: TitanicDatum[] = [
  { Survived: "Inativos", Count: 123 },
  { Survived: "Ativos", Count: 202 },
  { Survived: "Inativos", Count: 167 },
  { Survived: "Ativos", Count: 118 },
  { Survived: "Inativos", Count: 528 },
  { Survived: "Ativos", Count: 178 },
  { Survived: "Inativos", Count: 696 },
  { Survived: "Ativos", Count: 212 },
];

const totalCount = titanicData.reduce((acc, item) => acc + item.Count, 0);

// 1. Dados do Anel Interno (Sobreviveu vs Não Sobreviveu)
const survivalData: ChartDatum[] = [
  {
    id: "Ativos",
    label: "Ativos:",
    value: titanicData
      .filter((d) => d.Survived === "Ativos")
      .reduce((sum, d) => sum + d.Count, 0),
    percentage:
      (titanicData
        .filter((d) => d.Survived === "Ativos")
        .reduce((sum, d) => sum + d.Count, 0) /
        totalCount) *
      100,
    color: "#184d8ac5", // Cor para Sobreviventes
  },
  {
    id: "Inativos",
    label: "Inativos:",
    value: titanicData
      .filter((d) => d.Survived === "Inativos")
      .reduce((sum, d) => sum + d.Count, 0),
    percentage:
      (titanicData
        .filter((d) => d.Survived === "Inativos")
        .reduce((sum, d) => sum + d.Count, 0) /
        totalCount) *
      100,
    color: "#184d8a", // Cor para Não Sobreviventes
  },
];

// --- Componentes de Estilo ---
const StyledText = styled("text")(({ theme }: { theme: Theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 16,
  fontWeight: "medium",
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

// --- Componente Principal ---
export default function ChartGestaoEstud() {
  const innerRadius = 60;
  const middleRadius = 130;

  return (
    <Box
      sx={{
        width: "auto",
        textAlign: "center",
        py: 4,
        transition: "all 50s ease-in-out",
      }}
    >
      <div className="flex flex-col items-start justify-start gap-2">
        {survivalData.map((datum) => (
          <div key={datum.id} className="flex items-center gap-3">
            {/* O Quadrinho de Cor */}
            <div
              style={{ backgroundColor: datum.color }}
              className="w-3 h-3 rounded-sm shadow-sm"
            />

            {/* O Texto */}
            <div className="text-sm font-medium text-gray-700">
              <span>{datum.label}</span>
              <span className="ml-1 font-bold">
                {datum.value} Estudantes ({datum.percentage.toFixed(0)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
      <Box sx={{ display: "flex", justifyContent: "center", height: 450 }}>
        <PieChart
          series={[
            {
              // Anel Interno: Sobrevivência Geral
              innerRadius,
              outerRadius: middleRadius,
              data: survivalData,
              arcLabel: (item) =>
                `${item.id} (${(item as any).percentage.toFixed(0)}%)`,
              valueFormatter: ({ value }) => `${value} Estudantes`,
              highlightScope: { fade: "global", highlight: "item" },
              cornerRadius: 4,
              paddingAngle: 2,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontSize: "11px",
              fontWeight: "medium",
              fill: "white",
            },
          }}
          hideLegend
        >
          <PieCenterLabel>Estudantes</PieCenterLabel>
        </PieChart>
      </Box>
    </Box>
  );
}
