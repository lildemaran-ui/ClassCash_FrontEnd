import ItemsDoCabeçalho from "@/components/ItemsDoCabeçalho/ItemsDoCabeçalho";
import { ArrowDown, ArrowUp, EyeIcon, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

interface PagamentoRow {
  codigo: number;
  nome_estudante: string;
  classe: number | null;
  data: string | null;
  servico: string;
  valor: string;
  multa_estimada: string;
  status: string;
}

interface Cards {
  total_pagamentos: string;
  confirmados: string;
  pendentes: string;
  atrasados: string;
  cancelados: string;
}

const CardKpi = ({ title, value, subtext, trend }: { title: string; value: string; subtext: string; trend?: "up" | "down" }) => (
  <div className="bg-white px-2 py-4 rounded-xl flex flex-col items-center text-center border">
    <p className="text-gray-400 text-base mb-1">{title}</p>
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-gray-800">{value}</span>
      {trend === "up" && <span className="text-green-500"><TrendingUp /></span>}
      {trend === "down" && <span className="text-red-500"><TrendingDown /></span>}
    </div>
    <p className="text-[14px] text-gray-400 mt-1">{subtext}</p>
  </div>
);

export default function GestaoPagamentos() {
  const [tabela, setTabela] = useState<PagamentoRow[]>([]);
  const [cards, setCards] = useState<Cards>({ total_pagamentos: "0", confirmados: "0", pendentes: "0", atrasados: "0", cancelados: "0" });
  const [loading, setLoading] = useState(true);
  const [ordemCrescente, setOrdemCrescente] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("Token");
        const res = await fetch(`${API}/gestaoPagamentos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao carregar pagamentos");
        const data = await res.json();
        setCards(data.cards ?? cards);
        setTabela(data.tabela ?? []);
      } catch {
        toast.error("Erro ao carregar pagamentos");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const handleSort = (chave: "nome_estudante") => {
    const ordenados = [...tabela].sort((a, b) =>
      ordemCrescente ? a[chave].localeCompare(b[chave]) : b[chave].localeCompare(a[chave])
    );
    setTabela(ordenados);
    setOrdemCrescente(!ordemCrescente);
  };

  const colorsSit = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-green-50 text-green-600 border-green-100";
      case "pendente": return "bg-orange-50 text-orange-600 border-orange-100";
      default: return "bg-red-50 text-red-600 border-red-100";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />
      <main className="flex-1 p-8 custom_scroll">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold text-[#184d8a]">Gestão de Pagamentos</h1>
          <ItemsDoCabeçalho />
        </header>

        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div className="flex gap-4">
              {["Mês", "Estado", "Classe"].map((filtro) => (
                <div key={filtro}>
                  <label className="flex text-sm text-gray-500 mb-1">{filtro}</label>
                  <select className="bg-white border rounded-lg px-10 py-2 text-sm text-gray-400 outline-none cursor-pointer hover:border-[#184d8a]">
                    <option>Todos</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 bg-[#184d8a] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95">
              <Plus size={22} /> Adicionar
            </button>
          </div>

          <div className="grid grid-cols-5 gap-4 cursor-default">
            <CardKpi title="Total recebido" value={cards.total_pagamentos} subtext="este mês" trend="up" />
            <CardKpi title="Confirmados" value={cards.confirmados} subtext="validados" />
            <CardKpi title="Pendentes" value={cards.pendentes} subtext="em análise" trend="down" />
            <CardKpi title="Em Atraso" value={cards.atrasados} subtext="vencidos" trend="down" />
            <CardKpi title="Cancelados" value={cards.cancelados} subtext="estornados" trend="down" />
          </div>
        </section>

        <div className="mb-20 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50">
            <h1 className="text-gray-700 font-bold">Histórico de Transações</h1>
          </div>

          <table className="w-full text-center border-collapse cursor-default">
            <thead>
              <tr className="bg-[#184d8a]/70 text-white text-[14px] font-black tracking-widest border-b border-gray-100">
                <th className="px-4 py-4">Código</th>
                <th className="px-4 py-4 cursor-pointer" onClick={() => handleSort("nome_estudante")}>
                  <div className="flex items-center justify-center gap-1">
                    Nome {ordemCrescente ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                  </div>
                </th>
                <th className="px-4 py-4">Classe</th>
                <th className="px-4 py-4">Serviço</th>
                <th className="px-4 py-4">Valor</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 cursor-default">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">A carregar...</td></tr>
              ) : tabela.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">Nenhum pagamento encontrado</td></tr>
              ) : (
                tabela.map((row, index) => (
                  <tr key={index} className="hover:bg-[#184d8a]/5 hover:border-b hover:border-dashed hover:border-[#184d8a] transition-colors">
                    <td className="px-4 py-4 text-sm font-mono text-gray-500">{row.codigo}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{row.nome_estudante}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{row.classe ? `${row.classe}ª` : "—"}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{row.servico}</td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      {Number(row.valor).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block min-w-[85px] ${colorsSit(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="group relative w-max items-center mx-auto cursor-pointer">
                        <div className="flex">
                          <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-500 shadow-sm">
                            <EyeIcon size={18} />
                          </div>
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500">Visualizar</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
