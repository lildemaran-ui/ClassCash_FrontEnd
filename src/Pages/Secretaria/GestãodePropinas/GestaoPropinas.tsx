import { ArrowDown, ArrowUp, Bell, EyeIcon, Menu, Search, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

interface PropinaRow {
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
  total_pagas: string;
  total_pendentes: string;
  total_atrasadas: string;
}

const CardKpi = ({ title, value, subtext, trend }: { title: string; value: string; subtext: string; trend?: "up" | "down" }) => (
  <div className="bg-white p-4 rounded-xl flex flex-col items-center text-center border">
    <p className="text-gray-400 text-base mb-1">{title}</p>
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-gray-800">{value}</span>
      {trend === "up" && <span className="text-green-500"><TrendingUp /></span>}
      {trend === "down" && <span className="text-red-500"><TrendingDown /></span>}
    </div>
    <p className="text-[14px] text-gray-400 mt-1">{subtext}</p>
  </div>
);

export default function GestaoPropinas() {
  const [tabela, setTabela] = useState<PropinaRow[]>([]);
  const [cards, setCards] = useState<Cards>({ total_pagas: "0", total_pendentes: "0", total_atrasadas: "0" });
  const [loading, setLoading] = useState(true);
  const [ordemCrescente, setOrdemCrescente] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("Token");
        const res = await fetch(`${API}/gestaoPropinas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao carregar propinas");
        const data = await res.json();
        setCards(data.cards ?? cards);
        setTabela(data.tabela ?? []);
      } catch {
        toast.error("Erro ao carregar propinas");
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
      case "Paga": return "text-green-500";
      case "Pendente": return "text-orange-400";
      case "Atrasada": return "text-red-500";
      default: return "text-black";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />
      <main className="flex-1 p-8 custom_scroll">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold text-[#184d8a]">Gestão de Propinas</h1>
          <header className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="search" placeholder="Procurar por um código..."
                className="w-80 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#184d8a]/20 outline-none transition-all" />
            </div>
            <div className="relative cursor-pointer group">
              <Bell className="text-[#184d8a] group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white" />
            </div>
          </header>
        </div>

        <section className="mb-12">
          <div className="flex gap-4 mb-8">
            {["Mês", "Classe", "Estado"].map((filtro) => (
              <div key={filtro} className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 ml-1">{filtro}</label>
                <select className="bg-white border rounded-lg px-4 py-2 text-sm text-gray-400 outline-none focus:border-[#184d8a] min-w-[140px] cursor-pointer">
                  <option>Sem filtro</option>
                </select>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-default">
            <CardKpi title="Propinas Pagas" value={loading ? "..." : cards.total_pagas} subtext="no último mês" trend="up" />
            <CardKpi title="Propinas Pendentes" value={loading ? "..." : cards.total_pendentes} subtext="no último mês" />
            <CardKpi title="Propinas em Atraso" value={loading ? "..." : cards.total_atrasadas} subtext="no último mês" trend="down" />
          </div>
        </section>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-gray-700">Tabela de Propinas</h3>
            <span className="text-xs text-gray-400 font-medium">{tabela.length} registos encontrados</span>
          </div>

          <table className="w-full border-collapse cursor-default">
            <thead>
              <tr className="bg-[#184d8a]/70 text-white text-[14px] font-black border-b border-gray-200">
                <th className="px-4 py-4">Código</th>
                <th className="px-4 py-4 cursor-pointer" onClick={() => handleSort("nome_estudante")}>
                  <div className="flex items-center justify-center gap-1">
                    Nome {ordemCrescente ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                  </div>
                </th>
                <th className="px-4 py-4">Classe</th>
                <th className="px-4 py-4">Data</th>
                <th className="px-4 py-4">Serviço</th>
                <th className="px-4 py-4">Valor</th>
                <th className="px-4 py-4">Multa</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={9} className="py-12 text-center text-sm text-gray-400">A carregar...</td></tr>
              ) : tabela.length === 0 ? (
                <tr><td colSpan={9} className="py-12 text-center text-sm text-gray-400">Nenhuma propina encontrada</td></tr>
              ) : (
                tabela.map((row, index) => (
                  <tr key={index} className="hover:bg-[#184d8a]/5 transition-colors text-center hover:border-b hover:border-dashed hover:border-[#184d8a]">
                    <td className="px-4 py-4 text-sm text-gray-500">{row.codigo}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{row.nome_estudante}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{row.classe ? `${row.classe}ª` : "—"}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{row.data ?? "—"}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{row.servico}</td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      {Number(row.valor).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                    </td>
                    <td className="px-4 py-4 text-sm text-red-500">
                      {Number(row.multa_estimada) > 0
                        ? Number(row.multa_estimada).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })
                        : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block min-w-[85px] ${colorsSit(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="group w-max relative flex items-center mx-auto cursor-pointer">
                        <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-500 shadow-sm">
                          <EyeIcon size={18} />
                        </div>
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500">Visualizar</span>
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
