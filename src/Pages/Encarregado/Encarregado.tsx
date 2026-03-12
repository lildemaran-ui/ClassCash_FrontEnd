import ChartEstud from "@/components/Charts/ChartEstud";
import MenuEncar from "@/components/Menu/MenuEncar";
import { ProfileEditModal } from "@/components/profile_edit_modal";
import {
  CheckCircle,
  Download,
  Menu,
  Pen,
  type LucideIcon
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Encarregado() {
  const [Modal, setModal] = useState(false);

  function ShowModal() {
    setModal(true);
  }

  function CloseModal() {
    setModal(false);
  }
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-bold">{value}</span>
    </div>
  );

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");

    if (dadosDoLogin && dadosDoLogin !== "undefined") {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);
  if (!user) {
    return <span>Carregado...</span>;
  }


  return (
    <div className="flex overflow-hidden h-screen bg-white font-sans transition-all duration-500">
      {/* Sidebar */}
      <MenuEncar />
      <main className="flex-1 p-8 custom_scroll transition-all duration-500">
        <div>
          {!menu && (
            <button onClick={OpenMenu}>
              <Menu size={22} className="text-[#268cff]" />
            </button>
          )}
          <button
            onClick={ShowModal}
            className="text-[#268cff] text-[16px] font-medium flex items-center gap-2 mb-4 ml-auto transition-all duration-500"
          >
            <Pen size={18} /> EDITAR PERFIL
          </button>
        </div>
        {/* Main Content */}
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
                <strong>Nome do seu Educando:</strong> {user.nomeEstudante}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Relação Parental:</strong> {user.relacao}
              </p>
              {user.perfil === "Estudante" && (
                <p className="text-sm text-gray-600">
                  <strong>Classe:</strong> {user.classe}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="bg-white p-8 rounded-xl border  min-w-[250px] flex items-center gap-4">
              <div>
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <div className="flex flex-col ">
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  Situação Financeira do seu Educando
                </h3>
                <p className="text-green-600 text-sm font-medium">
                  Financeiramente está estável
                </p>
                <p className="text-xs text-gray-400">
                  Sem pagamentos em atraso
                </p>
              </div>
            </div>
          </div>
        </header>

        <hr className="mb-8 border-gray-200" />
        {/*Modal de Edição do Perfil*/}
        <ProfileEditModal isOpen={Modal} onClose={CloseModal} user={user} />

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
            <ChartEstud />
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
                  <td className="p-4 font-medium text-gray-900">
                    Kz 31.300,00
                  </td>
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
      </main>
    </div>
  );
}
