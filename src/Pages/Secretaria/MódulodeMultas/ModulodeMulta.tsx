import ChartGestaoMulta from "@/components/Charts/ChartGestaoMulta";
import ChartGestaoMulta2 from "@/components/Charts/ChartGestaoMulta2";
import ItemsDoCabeçalho from "@/components/ItemsDoCabeçalho/ItemsDoCabeçalho";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { CheckCircle, DollarSign, Download, EyeIcon, Plus, TrendingUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

interface MultaRow {
  nome: string;
  motivo: string;
  valor_original: string;
  multa: string;
  dias_atraso: number;
  status: string;
}

interface Cards {
  multas_pendentes: string;
  percentual_pendentes: string;
  multas_pagas: string;
  transacoes_liquidadas: string;
  percentual_multas: string;
}

export default function ModulodeMulta() {
  const [tabela, setTabela] = useState<MultaRow[]>([]);
  const [cards, setCards] = useState<Cards | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("Token");
        const res = await fetch(`${API}/gestaoMultas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao carregar multas");
        const data = await res.json();
        setCards(data.cards ?? null);
        setTabela(data.tabela ?? []);
      } catch {
        toast.error("Erro ao carregar dados de multas");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const colorsSit = (estado: string) => {
    switch (estado) {
      case "Paga": return "text-green-500";
      case "Pendente": return "text-orange-400";
      default: return "text-black";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 p-8 bg-gray-50 custom_scroll">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-xl font-bold text-[#184d8a]">Gestão de Multas</h1>
            <p className="text-gray-400 text-sm">Controle de multas aplicadas aos estudantes.</p>
          </div>
          <ItemsDoCabeçalho />
        </div>

        <div className="flex justify-between items-end mb-6">
          <div className="flex gap-4 cursor-pointer">
            {["Ano", "Semestre", "Mês"].map((filtro) => (
              <div key={filtro}>
                <label className="block text-sm text-gray-500 mb-1">{filtro}</label>
                <select className="bg-white border rounded-lg px-6 py-2 text-sm text-gray-400 outline-none hover:border-[#184d8a] cursor-pointer">
                  <option>Sem filtro</option>
                </select>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#184d8a] text-white rounded-md text-base font-semibold hover:bg-blue-500 transition-all duration-500 cursor-pointer">
            Gerar PDF <Download />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 cursor-default">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <p className="text-xs font-black text-gray-400 tracking-widest">Total de multas pendentes</p>
              <span className="p-2 bg-red-50 text-red-600 rounded-lg"><DollarSign size={22} /></span>
            </div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">
              {loading ? "..." : cards?.multas_pendentes ?? "0"}
            </h3>
            <div className="mt-2 flex items-center gap-1 text-red-500 text-xs font-bold">
              <TrendingUp size={14} /> {cards?.percentual_pendentes ?? "0"}% em relação ao mês anterior
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 tracking-widest">Multas pagas (Mês)</p>
            <h3 className="text-3xl font-black text-gray-800 mt-2">
              {loading ? "..." : cards?.multas_pagas ?? "0"}
            </h3>
            <div className="mt-2 flex items-center gap-1 text-green-500 text-xs font-bold">
              <CheckCircle size={14} /> {cards?.transacoes_liquidadas ?? "0"} transações liquidadas
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 tracking-widest">Pagamentos com multas</p>
            <h3 className="text-3xl font-black text-gray-800 mt-2">
              {loading ? "..." : `${cards?.percentual_multas ?? "0"}%`}
            </h3>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-3">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${cards?.percentual_multas ?? 0}%` }} />
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="flex flex-col md:flex-row gap-6 w-full mb-12">
          <div className="flex-1 bg-white border p-6 rounded-3xl shadow-sm flex flex-col">
            <h3 className="font-semibold text-gray-800 text-lg mb-6">Multas Pendentes e Pagas</h3>
            <div className="flex-grow flex items-center justify-center min-h-[300px]"><ChartGestaoMulta /></div>
          </div>
          <div className="flex-1 bg-white border p-6 rounded-3xl shadow-sm flex flex-col">
            <h3 className="font-semibold text-gray-800 text-lg mb-6">Quantidade de Multas Pagas</h3>
            <div className="flex-grow flex items-center justify-center min-h-[300px]"><ChartGestaoMulta2 /></div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex gap-4">
              <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 outline-none">
                <option disabled>Filtrar por dias de atraso</option>
                <option>5 dias</option><option>10 dias</option><option>15 dias</option><option>20 dias</option>
              </select>
            </div>
            <button className="bg-[#184d8a] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 shadow-sm transition-all duration-500 flex items-center gap-2">
              <Plus size={22} /> Aplicar Multa
            </button>
          </div>

          <table className="w-full text-center border-collapse cursor-default">
            <thead>
              <tr className="bg-[#184d8a]/70 text-white text-[14px] font-black border-b border-gray-200">
                <th className="px-6 py-4">Estudante</th>
                <th className="px-6 py-4">Motivo</th>
                <th className="px-6 py-4">Valor Original</th>
                <th className="px-6 py-4">Valor Multa</th>
                <th className="px-6 py-4">Dias em Atraso</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">A carregar...</td></tr>
              ) : tabela.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">Nenhuma multa registada</td></tr>
              ) : (
                tabela.map((row, index) => (
                  <tr key={index} className="hover:bg-[#184d8a]/5 transition-colors text-center">
                    <td className="px-4 py-4 text-sm font-bold text-gray-700">{row.nome}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{row.motivo}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {Number(row.valor_original).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                    </td>
                    <td className="px-4 py-4 text-sm text-red-500">
                      {Number(row.multa).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{row.dias_atraso} dias</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block min-w-[85px] ${colorsSit(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-3 justify-center cursor-pointer">
                        <div className="group relative w-max">
                          <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-500 shadow-sm"><EyeIcon size={18} /></div>
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500">Visualizar</span>
                        </div>
                        <div className="group relative w-max">
                          <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-500 shadow-sm"><Trash2 size={18} /></div>
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500">Deletar</span>
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
