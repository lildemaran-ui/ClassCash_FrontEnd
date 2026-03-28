import { PieChart } from "@mui/x-charts/PieChart";

export default function ChartGestaoMulta() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: "Multa Pendente", color: "orange" },
            { id: 1, value: 15, label: "Multa Paga", color: "#184d8a" },
          ],
        },
      ]}
      width={200}
      height={200}
    />
  );
}
