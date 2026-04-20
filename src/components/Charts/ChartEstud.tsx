import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { exigirSessao } from "@/types/global/sessao";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const CORES = ["#184d8a", "#393b3b", "#72a7ff", "#22c55e", "#f59e0b"];

interface ServicoData {
  servico: string;
  total: number;
}

export default function ChartEstud() {
  const [dados, setDados] = useState<ServicoData[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const sessao = exigirSessao();
    if (!sessao) return;

    fetch("http://localhost:5000/api/dashboardEstud", {
      headers: { Authorization: `Bearer ${sessao.token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.evolucao_pagamentos) setDados(data.evolucao_pagamentos);
      })
      .catch((err) => console.error("Erro ao carregar gráfico:", err))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-[#184d8a]" />
      </div>
    );
  }

  // ← Se não houver pagamentos, mostra mensagem em vez do gráfico
  if (dados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
        <p className="text-sm font-medium">Sem serviços pagos ainda</p>
        <p className="text-xs">O gráfico aparecerá após o primeiro pagamento</p>
      </div>
    );
  }

  const seriesData = dados.map((d, i) => ({
    value: parseFloat(String(d.total)),
    label: d.servico,
    color: CORES[i % CORES.length],
  }));

  return (
    <PieChart
      series={[{ data: seriesData, innerRadius: 60 }]}
      width={300}
      height={220}
      slotProps={{
        legend: {
          position: { vertical: "middle", horizontal: "end" },
        },
      }}
    />
  );
}