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
  const [image, setImage] = useState<string | null>(null);
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("menu_aberto");
    return saved === "true";
  });
  {
    /** Fazendo a input de selecão de imagens */
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Cria uma URL temporária para exibir a imagem no navegador
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function OpenMenu() {
    setMenu(true);
    localStorage.setItem("menu_aberto", "true");
  }
  function CloseMenu() {
    setMenu(false);
    localStorage.setItem("menu_aberto", "false");
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
                active={false}
              />
            </Link>
            <NavItem icon={<Wallet size={20} />} label="Pagamentos" active={true} />

            <NavItem icon={<MessageSquare size={20} />} label="Reclamações" active={false} />
            <NavItem icon={<Settings size={20} />} label="Configurações" active={false} />
            <NavItem icon={<LifeBuoy size={20}  />} label="Suporte" active={false} />
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
        <div className=" px-20 py-24  rounded-lg mt-10 max-w-7xl mx-auto h-auto grid grid-cols-2 gap-20">
          {/* Coluna esquerda */}
          <div className="flex flex-col gap-4">
            <div className="mb-5">
              <label className="block mb-1">Código</label>
              <input
                type="text"
                value="DVS-2025-KS"
                readOnly
                className="w-32  outline-none border rounded-lg px-3 py-2 text-gray-700"
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
                className="w-64 border focus:outline-none focus:border-[#268cff] rounded-lg px-3 py-2"
              >
                <option>Propina</option>
                <option>Justificativo</option>
                <option>Transferência</option>
                <option>Certificado</option>
                <option>Cartão de Estudante</option>
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
                className="w-20 border rounded-lg px-3 py-2"
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
                className="w-64 border rounded-lg px-3 py-2 focus:outline-none focus:border-[#268cff] pr-28"
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
                className="w-40 border rounded-lg px-5 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block mb-3 mt-3">IBAN:</label>
              <input
                type="text"
                value="AO006 0000 0000 0000 0000 0000 0"
                readOnly
                className="w-full border rounded-lg px-5 py-2 text-gray-700"
              />
            </div>

            <div className="">
            
              <div className="w-full h-60 border-2 border-dashed flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0 mb-5">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-69 object-cover object-center"
                  />
                ) : (
                  <span className="text-lg text-gray-400">Comprovativo</span>
                )}
              </div>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full  items-center flex justify-center file:px-4 file:py-2 text-gray-400 file:text-base file:bg-blue-50 file:border-none file:p-4 file:rounded-full  file:text-blue-700 "
              />
            </div>
            <button
              onClick={enviarPagamento}
              className="mt-auto bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
            >
              Enviar pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
