import { useEffect, useState } from "react";

import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import ReclamacaoGeral from "@/components/Reclamacao/ReclamacaoGeral";
import { Layout } from "../layout";
import ContentLoader from "@/components/contentLoader";

export default function Reclamacoes() {
  const [user, setUser] = useState<User | null>(null);
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
    <Layout>
      <div className="flex-1 w-full h-full mx-auto ">
        <div className="flex-1 overflow-auto">
          <Header
            titulo="Reclamações"
            usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
          />
          <div className="">
            <ContentLoader>
            <ReclamacaoGeral />
            </ContentLoader>
          </div>
        </div>
      </div>
    </Layout>
  );
}
