import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

interface ChartDatum {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const CORES: Record<string, string> = {
  Aceite: "#184d8a",
  Pendente: "#f59e0b",
  Recusado: "#ef4444",
};

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

interface Props {
  dados: { status: string; total: string; percentual: string }[];
}

export default function ChartGestaoEstud({ dados }: Props) {
  // ✅ Converte PieRow[] → ChartDatum[]
  const chartData: ChartDatum[] = dados.map((r) => ({
    id: r.status,
    label: `${r.status}:`,
    value: Number(r.total),
    percentage: Number(r.percentual),
    color: CORES[r.status] ?? "#94a3b8",
  }));

  return (
    <Box sx={{ width: "auto", textAlign: "center", py: 4 }}>
      {/* ✅ Legenda usa chartData */}
      <div className="flex flex-col items-start justify-start gap-2">
        {chartData.map((d) => (
          <div key={d.id} className="flex items-center gap-3">
            <div
              style={{ backgroundColor: d.color }}
              className="w-3 h-3 rounded-sm shadow-sm"
            />
            <div className="text-sm font-medium text-gray-700">
              <span>{d.label}</span>
              <span className="ml-1 font-bold">
                {d.value} Estudantes ({d.percentage.toFixed(0)}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      <Box sx={{ display: "flex", justifyContent: "center", height: 450 }}>
        {chartData.length > 0 && (
          // ✅ PieChart recebe chartData
          <PieChart
            series={[
              {
                innerRadius: 60,
                outerRadius: 130,
                data: chartData,
                arcLabel: (item) => {
                  const d = chartData.find((c) => c.id === item.id);
                  return d ? `${d.id} (${d.percentage.toFixed(0)}%)` : "";
                },
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
        )}
      </Box>
    </Box>
  );
}
