import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import ReclamacaoGeral from "@/components/Reclamacao/ReclamacaoGeral";
import { useEffect, useState } from "react";
import { Layout } from "../layout";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";

export default function Reclamacoes() {
    const [user, setUser] = useState<SessaoUsuario | null>(null);
  
    useEffect(() => {
      const sessao = exigirSessao();
      if (sessao) setUser(sessao.usuario);
    }, []);
  
    if (!user) return null;
  return (
   <Layout>
      <div className="flex h-screen bg-gray-50 font-sans custom_sroll ">
        <div className="flex flex-1 flex-col">
          <Header
            titulo="Reclamações"
            usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
          />
          <div className="">
            <ReclamacaoGeral />
          </div>
        </div>
      </div>
    </Layout>
  );
}
