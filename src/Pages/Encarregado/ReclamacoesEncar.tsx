import {
  Bell,

  Menu,
  
} from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";

import Avatar from "@/components/Avatar/Avatar";
import ReclamacaoGeral from "@/components/Reclamacao/ReclamacaoGeral";
import MenuEncar from "@/components/Menu/MenuEncar";

export default function ReclamacoesEncar() {
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("menu_aberto");
    return saved === "true";
  });

  function OpenMenu() {
    setMenu(true);
    localStorage.setItem("menu_aberto", "true");
  }
  function CloseMenu() {
    setMenu(false);
    localStorage.setItem("menu_aberto", "false");
  }
  

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
    <div className="flex overflow-hidden h-screen bg-white font-sans transition-all duration-500">
     
    <MenuEncar/>
    
      {/* Main Content */}
      <main className="flex-1 p-8 custom_scroll transition-all duration-500">
        {!menu && (
          <button onClick={OpenMenu}>
            <Menu size={22} className="text-[#268cff]" />
          </button>
        )}
        {/* Header Superior */}
        <header className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={22} className="text-[#268cff]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#f0f5fa]"></div>
            </div>
            <Avatar name={user.nome} src={user.foto} size="md" />
          </div>
        </header>
        <ReclamacaoGeral />
      </main>
    </div>
  );
}
