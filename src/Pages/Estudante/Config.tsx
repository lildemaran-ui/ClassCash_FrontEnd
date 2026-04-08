import Avatar from "@/components/Avatar/Avatar";
import ConfiguracaoGeral from "@/components/Configuracoes/ConfiguracaoGeral";
import { Header } from "@/components/Header/header";
import { useEffect, useState } from "react";
import { Layout } from "../layout";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";

export default function Config() {
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  if (!user) return <span>A verificar autenticação...</span>;

  return (
    <Layout>
      <Header
        titulo="Configurações"
        usuario={<Avatar name={user.nome} src={user.foto}  size="sm" />}
      />
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <ConfiguracaoGeral />
      </div>
    </Layout>
  );
}