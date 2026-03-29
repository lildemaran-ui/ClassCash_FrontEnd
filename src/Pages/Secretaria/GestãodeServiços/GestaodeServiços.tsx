import { ArrowDown, ArrowUp, Pen, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ItemsDoCabeçalho from "@/components/ItemsDoCabeçalho/ItemsDoCabeçalho";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

interface Servico {
  idservico: number;
  servico: string;
  idclasse: number;
  classe: number;
  valorservico: string;
  multa_base: number;
}

export default function GestaodeServiços() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordemCrescente, setOrdemCrescente] = useState(true);

  const carregar = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Token");
      const res = await fetch(`${API}/gestaoServicos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar serviços");
      const data = await res.json();
      setServicos(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleSort = () => {
    const ordenados = [...servicos].sort((a, b) =>
      ordemCrescente ? a.servico.localeCompare(b.servico) : b.servico.localeCompare(a.servico)
    );
    setServicos(ordenados);
    setOrdemCrescente(!ordemCrescente);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tens a certeza que queres remover este serviço?")) return;
    try {
      const token = localStorage.getItem("Token");
      const res = await fetch(`${API}/gestaoServicos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao remover");
      toast.success("Serviço removido com sucesso");
      carregar();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />
      <main className="flex-1 p-8 custom_scroll">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-[#184d8a]">Gestão de Serviços</h1>
          <ItemsDoCabeçalho />
        </div>

        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Filtrar por Mês</label>
              <select className="bg-white border rounded-lg px-4 py-2 text-sm text-gray-400 outline-none cursor-pointer hover:border-[#184d8a]">
                <option>Sem filtro</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-[#184d8a] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95">
              <Plus size={22} /> Adicionar
            </button>
          </div>
        </section>

        <div className="mb-20">
          <h1 className="mb-4 text-gray-700 text-lg font-bold">Tabela de Serviços</h1>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-center border-collapse cursor-default">
              <thead>
                <tr className="bg-[#184d8a]/70 text-white text-[14px] font-black border-b border-gray-200 text-center">
                  <th className="px-6 py-4 cursor-pointer hover:text-[#184d8a]" onClick={handleSort}>
                    <div className="flex items-center justify-center gap-1">
                      Serviço {ordemCrescente ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                    </div>
                  </th>
                  <th className="px-6 py-4">Classe</th>
                  <th className="px-6 py-4">Valor Base</th>
                  <th className="px-6 py-4">Multa Estimada</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">A carregar...</td></tr>
                ) : servicos.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">Nenhum serviço encontrado</td></tr>
                ) : (
                  servicos.map((s) => (
                    <tr key={`${s.idservico}-${s.idclasse}`} className="hover:bg-[#184d8a]/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">{s.servico}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{s.classe}ª</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {Number(s.valorservico).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-500 font-medium">—</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 justify-center cursor-pointer">
                          <div className="group relative w-max">
                            <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-500 shadow-sm">
                              <Pen size={18} />
                            </div>
                            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500">Editar</span>
                          </div>
                          <div className="group relative w-max" onClick={() => handleDelete(s.idservico)}>
                            <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-red-500 hover:text-white transition-all duration-500 shadow-sm">
                              <Trash2 size={18} />
                            </div>
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
        </div>
      </main>
    </div>
  );
}
