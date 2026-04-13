import * as React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

interface Props {
  dados: { mes: string; ativos: string; inativos: string }[];
}

export default function ChartGestaoEstud2({ dados }: Props) {
  const labels = dados.map((r) => MESES[Number(r.mes) - 1]);
  const ativos = dados.map((r) => Number(r.ativos));
  const inativos = dados.map((r) => Number(r.inativos));

  if (dados.length === 0) {
    return (
      <Box sx={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Sem dados disponíveis</p>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <LineChart
        series={[
          { data: ativos, label: "Aceites", color: "#184d8a" },
          { data: inativos, label: "Outros", color: "#f59e0b" },
        ]}
        xAxis={[{ scaleType: "point", data: labels, height: 28 }]}
        yAxis={[{ width: 50 }]}
        margin={{ right: 24 }}
      />
    </Box>
  );
}