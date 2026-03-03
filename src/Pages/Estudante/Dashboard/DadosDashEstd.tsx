
import ChartEstud from "@/Componentes/Charts/ChartEstud";
import {
  Settings,
  Download,
  CreditCard,
  Shirt,
  Coins,
  CheckCircle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
export default function DadosDashEstd() {
  const [opcoes, setOpcoes] = useState(false);
  function OpenOpcoes() {
    setOpcoes(true);
  }
  function CloseOpcoes() {
    setOpcoes(false);
  }
  const [Modal, setModal] = useState(false);

  function ShowModal() {
    setModal(true);
  }

  function CloseModal() {
    setModal(false);
  }
  const StatusCard = ({
    icon,
    title,
    progress,
  }: {
    icon: React.ReactNode;
    title: string;
    progress: number;
  }) => (
    <div className="bg-white p-6 rounded-2xl  border flex flex-col items-center">
      <div className="mb-4">{icon}</div>
      <h4 className="font-bold text-gray-800 mb-4">{title}</h4>
      <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
        <div
          className="bg-[#268cff] h-full rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs font-bold text-gray-500">Pago</span>
    </div>
  );
  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-bold">{value}</span>
    </div>
  );
  const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-sm ${color}`}></div>
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");

    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);
  if (!user) {
    return <span>Carregado...</span>;
  }

  return (
    <div>
      <header className="flex justify-between items-start mb-8 transition-all duration-500">
        <div className="flex items-center gap-6">
          <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-sm flex items-center justify-center bg-gray-100">
            {user.foto ? (
              <img
                loading="lazy"
                src={user.foto}
                alt={user.nome}
                className="w-full h-full object-cover"
                // Caso a URL exista mas a imagem falhe ao carregar (erro 404),
                // você pode opcionalmente adicionar um onError aqui.
              />
            ) : (
              // Fallback: Iniciais do nome
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#268cff] text-white text-6xl font-bold">
                {(user.nome || "User")
                  .trim()
                  .split(" ")

                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-lg font-bold">{user.nome}</p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Nº de processo:</strong> {user.processo}
            </p>
            {user.perfil === "Estudante" && (
              <p className="text-sm text-gray-600">
                <strong>Classe:</strong> {user.classe}
              </p>
            )}
          </div>
        </div>

        {Modal && (
          <div className="  bg-translucido2 fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <div className="flex justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold ">Editar Perfil</h1>
                  <p className="text-xs text-gray-400">
                    Edite suas informações a baixo
                  </p>
                </div>
                <div>
                  <button onClick={CloseModal} className="text-[#268cff]">
                    <X size={22} />
                  </button>
                </div>
              </div>
              <form className="space-y-4">
                <div className="w-48 h-48 rounded-full flex justify-center items-center mx-auto overflow-hidden border border-gray-400 shadow-sm group  ">
                  {user.foto ? (
                    <img
                      loading="lazy"
                      src={user.foto}
                      alt={user.nome}
                      className="w-full h-full object-cover"
                      // Caso a URL exista mas a imagem falhe ao carregar (erro 404),
                      // você pode opcionalmente adicionar um onError aqui.
                    />
                  ) : (
                    // Fallback: Iniciais do nome
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#268cff] text-white text-6xl font-bold">
                      {(user.nome || "User")
                        .trim()
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                    value={user.nome || ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                    value={user?.email || ""}
                  />
                </div>
                <div className="flex justify-between gap-3">
                  <div className="w-24">
                    <label className="block text-sm mb-1">Classe</label>
                    <select
                      required
                      value={user?.classe || ""}
                      className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                    >
                      <option value="" disabled>
                        Grau
                      </option>
                      <option value="7ª">7ª</option>
                      <option value="8ª">8ª</option>
                      <option value="9ª">9ª</option>
                      <option value="10ª">10ª</option>
                      <option value="11ª">11ª</option>
                      <option value="12ª">12ª</option>
                    </select>
                  </div>
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-1">
                      {" "}
                      Nº de Processo
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                      value={user?.processo || ""}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="flex justify-end gap-2
                  mt-20"
                  >
                    <div className="">
                      <button
                        type="button"
                        className="bg-white text-[#268cff] px-4 py-2 rounded-md border border-[#268cff] hover:bg-gray-100/50 transition-colors duration-500"
                        onClick={CloseModal}
                      >
                        Cancelar
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-500"
                        onClick={CloseModal}
                      >
                        Concluído
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="text-right">
          <button
            onClick={OpenOpcoes}
            className="text-[#268cff] text-[16px] font-medium flex items-center gap-2 mb-4 ml-auto transition-all duration-500"
          >
            <Settings size={22} /> EDITAR PERFIL
          </button>
          {opcoes && (
            <div className="border fixed ml-auto bg-black w-64 h-64 flex justify-end items-end transition-all duration-500 "></div>
          )}

          <div className="bg-white p-8 rounded-xl border  min-w-[250px] flex items-center gap-4">
            <div>
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-gray-800 mb-1">
                Situação Financeira
              </h3>
              <p className="text-green-600 text-sm font-medium">
                Financeiramente está estável
              </p>
              <p className="text-xs text-gray-400">Sem pagamentos em atraso</p>
            </div>
          </div>
        </div>
      </header>

      <hr className="mb-8 border-gray-200" />

      {/* Status Cards */}
      <div className="grid grid-cols-3  gap-6 mb-8">
        <div>
          <StatusCard
            icon={<CreditCard className="text-gray-600" />}
            title="Cartão Escolar"
            progress={60}
          />
        </div>
        <StatusCard
          icon={<Shirt className="text-gray-600" />}
          title="Uniformes"
          progress={85}
        />
        <StatusCard
          icon={<Coins className="text-gray-600" />}
          title="Propinas"
          progress={100}
        />
      </div>

      {/* Financial Summary & Charts */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl  border ">
          <h3 className="font-bold mb-6 text-gray-800">Resumo Financeiro:</h3>
          <div className="space-y-4">
            <SummaryRow label="Último pagamento:" value="09/11/2025" />
            <SummaryRow label="Próximo vencimento:" value="09/12/2025" />
            <SummaryRow label="Total pago no mês:" value="Kz 55.300,00" />
            <SummaryRow label="Total pago no ano:" value="Kz 313.000,00" />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <ChartEstud/>
        </div>
      </div>

      {/* Tabela de Histórico de Pagamentos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">
            Histórico de pagamentos referente ao período selecionado
          </h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#268cff] text-white text-sm">
            <tr>
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium">Serviço</th>
              <th className="p-4 font-medium">Valor</th>
              <th className="p-4 font-medium">Multas</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} className="text-sm text-gray-600">
                <td className="p-4">09/11/2025</td>
                <td className="p-4">Propina</td>
                <td className="p-4 font-medium text-gray-900">Kz 31.300,00</td>
                <td className="p-4 text-gray-400">Kz 0,00</td>
                <td className="p-4 text-green-500 font-medium ">Em dia</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-[#268cff] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all duration-500">
          <Download size={18} /> Gerar PDF
        </button>
      </div>
    </div>
  );
}
