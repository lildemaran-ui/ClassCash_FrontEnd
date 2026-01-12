import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  MessageSquare,
  Settings,
  LifeBuoy,
  Menu,
} from "lucide-react";
import Logo5 from "../../assets/Logo5.5.png";

export default function Pagamentos() {
  const [menu, setMenu] = useState(false);

  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }
  const [pagamento, setPagamento] = useState({
    metodo: "",
    servico: "Propina",
    meses: 1,
    plataforma: "PayPay",
    comprovativo: null,
  });
  // Sub-componentes auxiliares
  const NavItem = ({
    icon,
    label,
    active = false,
  }: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setPagamento({ ...pagamento, [name]: value });
  };

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPagamento({ ...pagamento, comprovativo: e.target.files[0] });
  };

  const enviarPagamento = () => {
    console.log(pagamento);
    alert("Pagamento enviado!");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] text-white flex flex-col">
          <div className="mb-16 pt-4 flex relative justify-between items-center px-4">
            <div className="flex items-center font-semibold">
              <img src={Logo5} alt="Logo" className="w-16 h-16" />
              <span>ClassCash</span>
            </div>
            <button onClick={CloseMenu}>
              <Menu size={28} />
            </button>
          </div>
          <nav className="flex-1 px-4 space-y-2  ">
            <Link to="/DashboardEstud">
              <NavItem
                icon={<LayoutDashboard size={20} />}
                label="Página Inicial"
                active
              />
            </Link>
            <NavItem icon={<Wallet size={20} />} label="Pagamentos" />

            <NavItem icon={<MessageSquare size={20} />} label="Reclamações" />
            <NavItem icon={<Settings size={20} />} label="Configurações" />
            <NavItem icon={<LifeBuoy size={20} />} label="Suporte" />
          </nav>
        </aside>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 p-4">
        {!menu && (
          <button onClick={OpenMenu}>
            <Menu size={28} className="text-[#268cff]" />
          </button>
        )}
        <div className=" px-20 py-24 border rounded  max-w-7xl mx-auto h-auto grid grid-cols-2 gap-20">
          {/* Coluna esquerda */}
          <div className="flex flex-col gap-4">
            <div className="mb-5">
              <label className="block mb-1">Código</label>
              <input
                type="text"
                value="DVP-2025-SV"
                readOnly
                className="w-32  border rounded px-3 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block mb-3">Como será feito o pagamento?</label>
              <div className="flex flex-col gap-2">
                {["De forma digital", "No banco", "Dinheiro Físico"].map(
                  (m) => (
                    <label key={m} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="metodo"
                        value={m}
                        onChange={handleChange}
                        className="accent-blue-500"
                      />
                      {m}
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block mb-3 mt-3">
                Quais dos serviços fará o pagamento?
              </label>
              <select
                name="servico"
                value={pagamento.servico}
                onChange={handleChange}
                className="w-64 border rounded px-3 py-2"
              >
                <option>Propina</option>
                <option>Uniforme</option>
              </select>
            </div>

            <div>
              <label className="block mb-3 mt-3">
                Vai pagar para quantos meses?
              </label>
              <input
                type="number"
                name="meses"
                min={1}
                value={pagamento.meses}
                onChange={handleChange}
                className="w-20 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-3 mt-3">
                Quais dos serviços utilizará?
              </label>
              <select
                name="plataforma"
                value={pagamento.plataforma}
                onChange={handleChange}
                className="w-64 border rounded px-3 py-2"
              >
                <option>Multicaixa Express</option>
                <option>PayPay</option>
                <option>Unitel Money</option>
              </select>
            </div>
          </div>

          {/* Coluna direita */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-3 ">Valor do serviço:</label>
              <input
                type="text"
                value="Kz 15.000,00"
                readOnly
                className="w-40 border rounded px-5 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block mb-3 mt-3">IBAN:</label>
              <input
                type="text"
                value="AO006 0000 0000 0000 0000 0000 0"
                readOnly
                className="w-full border rounded px-5 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block mb-1">Comprovativo</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full h-64 items-center flex justify-center  border rounded p-4 text-gray-400"
              />
            </div>

            <button
              onClick={enviarPagamento}
              className="mt-auto bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
            >
              Enviar pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
