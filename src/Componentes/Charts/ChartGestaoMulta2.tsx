import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { dataset } from "../DataSet/weather"; // Mantendo seu dataset original

// 1. Criamos um formatador simples para adicionar o símbolo de %
const percentFormatter = (value: number | null) => `${value}%`;

export default function ChartGestaoMulta2() {
  return (
    <div style={{ width: "100%" }}>
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            dataKey: "month",

            label: "Meses",
          },
        ]}
        // 2. Configuramos o eixo Y para escala percentual
        yAxis={[
          {
            dataKey: "seoul",
            valueFormatter: percentFormatter,
            min: 0,
            max: 100, // Força o gráfico a ir até 100%
          },
        ]}
        series={[
          {
            dataKey: "seoul",
            label: "Pagamentos com multas (%)",
            valueFormatter: percentFormatter,
            color: "#268cff",
          },
        ]}
        height={400}
      />
    </div>
  );
}
