import {
  Bell,
  CircleUser,
  Menu,
  Minus,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useState } from "react";

import MenuAdmin from "@/components/Menu/MenuAdmin";
import { Button } from "@/components/ui/button";
import { colorsSit } from "@/lib/utils";

export default function GestaoDeUsuarios() {
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }
  const [menuOpen, setMenuOpen] = useState(true);

  const mockAdministrators = [
    {
      id: 1,
      name: "Paula Garra",
      email: "paula.garra@email.com",
      institution: "Kibangas",
      status: "Ativo",
      profile: " Administrador ",
      contact: "927863909",
    },
    {
      id: 2,
      name: "João Viana",
      email: "joao.viana@email.com",
      institution: "Colégio Caracol",
      status: "Ativo",
      profile: "Encarregado",
      contact: "923123456",
    },
    {
      id: 3,
      name: "Filomena Silva",
      email: "filomena.silva@email.com",
      institution: "Elizângela Filomena",
      status: "Inativo",
      profile: "Administrador",
      contact: "911987654",
    },
    {
      id: 4,
      name: "Pedro Tomás",
      email: "pedro.tomas@email.com",
      institution: "MAPTESS",
      status: "Ativo",
      profile: "Estudante",
      contact: "922555777",
    },
    {
      id: 5,
      name: "Marta Correia",
      email: "marta.correia@email.com",
      institution: "Kibangas",
      status: "Pendente",
      profile: "Encarregado",
      contact: "933444111",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* SIDEBAR - Largura aumentada para w-80 (320px) ou w-96 (384px) dependendo da sua preferência. Usei w-80. */}
      <MenuAdmin />

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col ">
        {/* HEADER */}
        <div className="flex items-center justify-between z-50 top-0  p-6 sticky h-22 mb-5 bg-translucido">
          <div className="flex items-center gap-6">
            {!menu && (
              <button
                onClick={OpenMenu}
                className="text-[#268cff] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
            )}
            <h1 className="text-xl font-bold  text-[#268cff]">
              Gestão de Usuários
            </h1>
          </div>
          {/* Header (Topo) */}
          <header className=" ">
            <h1 className="text-xl font-bold text-[#268cff]">{}</h1>
            <div className="flex items-center space-x-4">
              {/* Ícones de Notificação e Perfil */}
              <div className="relative cursor-pointer">
                <Bell className="text-[#268cff] group-hover:scale-110 transition-transform " />
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
              </div>
              <CircleUser className="w-8 h-8 text-[#268cff] hover:text-blue-600" />
            </div>
          </header>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-6 md:p-10 custom_scroll">
          {/* Filters & KPI Cards */}
          <section className="mb-8  ">
            <div className="flex justify-between items-end mb-6  ">
              <div className="flex gap-4 cursor-pointer ">
                {["Nome", "Instituição", "Estado", "Perfil"].map((filtro) => (
                  <div key={filtro}>
                    <label className="block text-sm text-gray-500 mb-1">
                      {filtro}
                    </label>
                    <select className="bg-white border  rounded-lg px-6 py-2 text-sm text-gray-400 outline-none hover:border-[#268cff] cursor-pointer">
                      <option>Sem filtro</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className=" p-6 rounded-xl shadow-sm ">
            <div className="flex justify-end space-x-3 mb-6">
              <Button className="flex items-center bg-[#268cff] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-700 shadow-md ">
                <Plus className="w-4 h-4 mr-2 " />
                Adicionar
              </Button>
              <button className="flex items-center bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                <Minus className="w-4 h-4 mr-2 text-red-600" />
                Remover
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-center border-collapse cursor-default ">
                <thead>
                  <tr className="bg-[#268cff]/70  text-base  font-black tracking-widest border-b border-gray-100">
                    {[
                      "Nome",
                      "Email",
                      "Instituição",
                      "Estado",
                      "Perfil",
                      "Contacto",
                      "",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4  text-sm font-bold text-white text-center uppercase tracking-widest"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockAdministrators.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-[#268cff]/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-600">
                        {admin.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                        {admin.institution}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-bold border inline-block min-w-[80px] ${colorsSit(admin.status)}`}
                        >
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                        {admin.profile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                        {admin.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-gray-300 hover:text-gray-600 p-2">
                          <MoreVertical size={24} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
