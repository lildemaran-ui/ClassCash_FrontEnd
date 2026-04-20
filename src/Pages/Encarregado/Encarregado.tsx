// src/Pages/Encarregado/Encarregado.tsx
import ChartEstud from "@/components/Charts/ChartEstud";
import MenuEncar from "@/components/Menu/MenuEncar";
import { ProfileEditModal } from "@/components/profile_edit_modal";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import { AlertCircle, CheckCircle, Download, Pen } from "lucide-react";
import { useEffect, useState } from "react";

interface ResumoFinanceiro {
  ultimo_pagamento: string | null;
  proximo_vencimento: string | null;
  total_pago_mes: number | null;
  total_acumulado: number | null;
}

interface Transacao {
  data: string;
  servico: string;
  valor_total: number;
  status: string;
}

function formatarData(data: string | null): string {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-PT");
}

function formatarValor(valor: number | null): string {
  if (valor === null || valor === undefined) return "Kz 0,00";
  return `Kz ${Number(valor).toLocaleString("pt-PT")},00`;
}

export default function Encarregado() {
  const [Modal, setModal] = useState(false);
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [historico, setHistorico] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [contaRegularizada, setContaRegularizada] = useState(false);

  useEffect(() => {
    const sessao = exigirSessao();
    if (!sessao) return;
    setUser(sessao.usuario);

    const token = sessao.token;

    fetch("http://localhost:5000/api/dashboardEncarregado", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((dados) => {
        if (dados.resumo_financeiro) setResumo(dados.resumo_financeiro);
        if (dados.historico_transacoes)
          setHistorico(dados.historico_transacoes);
        if (dados.conta_regularizada !== undefined)
          setContaRegularizada(dados.conta_regularizada);
      })
      .catch((err) =>
        console.error("Erro ao carregar dashboard do encarregado:", err),
      )
      .finally(() => setCarregando(false));
  }, []);

  if (!user) return <span>A verificar autenticação...</span>;

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-bold whitespace-nowrap">{value}</span>
    </div>
  );

  return (
    <div className="flex overflow-hidden h-screen bg-white font-sans">
      <MenuEncar />

      <main className="flex-1 overflow-y-auto min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white transition-transform group-hover:scale-[1.02]">
                {user.foto ? (
                  <img
                    src={user.foto}
                    alt={user.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#184d8a] text-white shadow-inner text-4xl font-black">
                    {user.nome?.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => setModal(true)}
                className="absolute -bottom-0.5 -right-0.5 bg-white p-2 rounded-xl shadow-lg text-[#184d8a] hover:bg-blue-50 transition-colors border border-gray-100"
              >
                <Pen size={16} />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <span className="bg-blue-100 text-[#184d8a] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
                {user.perfil}
              </span>
              <h1 className="text-3xl font-black text-gray-800 mt-2 tracking-tight">
                {user.nome}
              </h1>
              <div className="flex flex-col justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-gray-500 text-sm">
                <p>
                  <strong>Grau parentesco:</strong> {user.relacao}
                </p>
                <p>
                  <strong>Nome do Educando:</strong> {user.nomeEstudante}
                </p>
              </div>
            </div>
          </div>
         
          <div
            className={`bg-gradient-to-br p-4 rounded-2xl border flex items-center gap-4 shadow-sm min-w-[280px] ${
              contaRegularizada
                ? "from-emerald-50 to-white border-emerald-100"
                : "from-amber-50 to-white border-amber-100"
            }`}
          >
            <div
              className={`p-2 rounded-xl text-white ${
                contaRegularizada ? "bg-emerald-500" : "bg-amber-500"
              }`}
            >
              {contaRegularizada ? (
                <CheckCircle size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
            </div>
            <div>
              <h3
                className={`text-sm font-bold ${
                  contaRegularizada ? "text-emerald-900" : "text-amber-900"
                }`}
              >
                Situação Financeira do seu Educando
              </h3>
              <p
                className={`text-xs font-semibold ${
                  contaRegularizada ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {contaRegularizada
                  ? "Conta Regularizada"
                  : "Pagamentos em atraso"}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-8 flex justify-end mb-8">
          <button className="bg-[#184d8a] text-white px-4 py-2.5 rounded-lg flex items-center gap-3 hover:bg-[#184d8a]/80 transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
            <Download size={20} />
            <span className="font-bold">Exportar Relatório</span>
          </button>
        </div>

        <ProfileEditModal
          isOpen={Modal}
          onClose={() => setModal(false)}
          user={user}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#184d8a] rounded-full"></span>
              Resumo Financeiro
            </h3>
            {carregando ? (
              <p className="text-sm text-gray-400">A carregar...</p>
            ) : (
              <div className="space-y-4">
                <SummaryRow
                  label="Último pagamento:"
                  value={formatarData(resumo?.ultimo_pagamento ?? null)}
                />
                <SummaryRow
                  label="Próximo vencimento:"
                  value={formatarData(resumo?.proximo_vencimento ?? null)}
                />
                <SummaryRow
                  label="Total pago no mês:"
                  value={formatarValor(resumo?.total_pago_mes ?? null)}
                />
                <SummaryRow
                  label="Total pago no ano:"
                  value={formatarValor(resumo?.total_acumulado ?? null)}
                />
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border p-4">
             <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#184d8a] rounded-full"></span>
              Serviços pagos
            </h3>
            <ChartEstud />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">
              Histórico de pagamentos referente ao período selecionado
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-[#184d8a] text-white text-sm">
                <tr>
                  <th className="p-4 font-medium">Data</th>
                  <th className="p-4 font-medium">Serviço</th>
                  <th className="p-4 font-medium">Valor</th>
                  <th className="p-4 font-medium">Multas</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {carregando ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-sm text-gray-400 text-center"
                    >
                      A carregar...
                    </td>
                  </tr>
                ) : historico.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-sm text-gray-400 text-center"
                    >
                      Sem transações registadas.
                    </td>
                  </tr>
                ) : (
                  historico.map((t, i) => (
                    <tr key={i} className="text-sm text-gray-600">
                      <td className="p-4">{formatarData(t.data)}</td>
                      <td className="p-4">{t.servico}</td>
                      <td className="p-4 font-medium text-gray-900">
                        {formatarValor(t.valor_total)}
                      </td>
                      <td className="p-4 text-gray-400">Kz 0,00</td>
                      <td
                        className={`p-4 font-medium ${
                          t.status === "pago"
                            ? "text-green-500"
                            : "text-amber-500"
                        }`}
                      >
                        {t.status === "pago" ? "Em dia" : "Pendente"}
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
