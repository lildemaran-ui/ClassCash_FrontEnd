import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Receipt,
  AlertOctagon,
  Menu,
  Settings,
  MessageSquare,
  FileText,

  ArrowDown,
  ArrowUp,
  Plus,
  EyeIcon,
  Pen,

} from "lucide-react";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";
import ItemsDoCabeçalho from "@/Componentes/ItemsDoCabeçalho/ItemsDoCabeçalho";

export default function GestaodeServiços() {
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [dadosAlunos, setDadosAlunos] = useState([
    {
      servico: "Propina Escolar",
      classe: "10ª Classe",
      Valor: "KZ 35.000",
      multa: "KZ 5.000",
     
    },
    {
     servico: "Justificativo",
      classe: "10ª Classe",
      Valor: "KZ 5.000",
      multa: "KZ 500",
    },
    {
    servico: "Propina Escolar",
      classe: "10ª Classe",
      Valor: "KZ 35.000",
      multa: "5.000",
    },
    {
     
      servico: "Propina Escolar",
      classe: "10ª Classe",
      Valor: "KZ 35.000",
      multa: "5.000",
    },
  ]);


  {
    /*Função de ordenação**/
  }
  const handleSort = (chave: "servico" ) => {
    const dadosOrdenados = [...dadosAlunos].sort((a, b) => {
      if (ordemCrescente) {
        return a[chave].localeCompare(b[chave]);
      } else {
        return b[chave].localeCompare(a[chave]);
      }
    });

    setDadosAlunos(dadosOrdenados);
    setOrdemCrescente(!ordemCrescente);
  };
  const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
  }: {
    icon: any;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors ${
        active ? "bg-white/20 w-56  " : "hover:bg-white/10 w-56"
      }`}
    >
      <Icon size={20} className="text-white" />
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }
 
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden overflow-y-auto">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] flex flex-col sticky top-0 h-screen">
          <div className="px-4 pt-4 mb-10 flex items-center gap-2 relative justify-between">
            <div className=" flex items-center">
              <img src={Logo5} alt="Logo" className="w-16 h-16 " />
              <p className="text-white font-semibold">ClassCash</p>
            </div>
            <button>
              <Menu size={28} className="text-white" onClick={CloseMenu} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-1 text-white">
            <Link to="/Secretaria">
              <SidebarItem
                icon={LayoutDashboard }
                label="Painel Geral"
                active={false}
              />
            </Link>

            <Link to = "/GestaoAlunos">
            <SidebarItem
              icon={Users }
              label="Gestão de Alunos"
              active={false}
            />

            </Link>
            <Link to="/GestaodeEncarregados">
            <SidebarItem
              icon={Users }
              label="Gestão de Encarregados"
              active={false}
            />
            </Link>
            <Link to="/GestaoPropinas">
              <SidebarItem
                icon={CreditCard }
                label="Gestão de Propinas"
                active={false}
              />
            </Link>
             <Link to="GestaoPagamentos">
              <SidebarItem
                icon={Receipt }
                label="Gestão de Pagamentos"
                active={false}
              />
         </Link>

           
            <SidebarItem
              icon={Settings }
              label="Gestão de Serviços"
              active={true}
            />
           
            <SidebarItem
              icon={MessageSquare }
              label="Gestão de Reclamações"
              active={false}
            />
            <SidebarItem
              icon={AlertOctagon }
              label="Gestão de Multas"
              active={false}
            />

            <SidebarItem
              icon={FileText }
              label="Relatório"
              active={false}
            />

            <SidebarItem
              icon={Settings }
              label="Configurações"
              active={false}
            />
          </nav>
        </aside>
      )}
      {/* Main Content */}
      {/* Main Content */}
      <main className="flex-1 p-8 ">
        <div className="flex gap-6">
          {!menu && (
            <button>
              <Menu
                className="text-[#268cff] flex items-start"
                size={28}
                onClick={OpenMenu}
              ></Menu>
            </button>
          )}
          <h2 className="text-lg font-bold text-[#268cff]">
            Gestão de Serviços
          </h2>
        </div>
        {/* Header */}
        <header className="flex justify-end items-center mb-8">
         <ItemsDoCabeçalho/>
        </header>

        {/*Filtros*/}
        <section className="mb-8">
          <div className="flex justify-start items-center ">
            <div className="flex gap-4 ">
              {["Mês"].map(
                (filtro) => (
                  <div key={filtro}>
                    <label className="block text-xs text-gray-500 mb-1">
                      {filtro}
                    </label>
                    <select className="bg-white border  rounded-md px-6 py-1 text-sm text-gray-400 outline-none">
                      <option>Sem filtro</option>
                    </select>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex justify-center items-center  mt-3 border hover:border-[#268cff] hover:bg-white py-2 rounded-lg w-56 gap-3 hover:text-[#268cff] text-white font-medium shadow-sm bg-[#268cff] transition-all duration-500 hover:mr-2 ml-auto cursor-default ">
            <div><Plus/></div>
             <div>Adicionar Serviço</div>
          </div>
         
        </section>
        {/* Tabela de Dados */}
        <div className="mt-16">
          <h2 className="mb-2 text-gray-500 text-base font-semibold">
            Tabela de Serviços
          </h2>

          <table className="w-full border-collapse border border-gray-300   ">
            <thead>
              <tr className="bg-[#268cff]/80 text-white">
                
                <th className="border border-gray-300 px-4 py-2 ">
                  <div
                    className="flex items-center justify-center gap-1 cursor-pointer"
                    onClick={() => handleSort("servico")}
                  >
                    Serviço
                    {ordemCrescente ? (
                      <ArrowDown size={18} />
                    ) : (
                      <ArrowUp size={20} />
                    )}
                  </div>
                </th>
                
                <th className="border border-gray-300 px-4 py-2">Classe</th>
                <th className="border border-gray-300 px-4 py-2">Valor</th>
                <th className="border border-gray-300 px-4 py-2">Multa</th>
                <th className="border border-gray-300 px-4 py-2">
                  Ações
                </th>
                
              </tr>
            </thead>
            <tbody>
              {dadosAlunos.map((aluno, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#268cff]/10 even:bg-[#268cff]/20 hover:border hover:border-dashed hover:border-black text-center"
                >
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.servico}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.classe}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.Valor}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.multa}
                  </td>
                 <button className="justify-center items-center flex mr-5 bg-[#268cff]/50 px-3 rounded-lg text-white text-center ">
                  <Pen/>
                 </button>
                 
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
