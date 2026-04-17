import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuAdmin from "@/components/Menu/MenuAdmin";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import { useEffect, useState } from "react";
import DashboardAdmin from "./DashboardAdmin";
export default function Administaradores() {
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  if (!user) return null;
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuAdmin />
      <main className="flex-1 overflow-y-auto min-w-0 top-0">
        <Header
          titulo="Painel Geral"
          usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
        />
        <DashboardAdmin />
      </main>
    </div>
  );
}
