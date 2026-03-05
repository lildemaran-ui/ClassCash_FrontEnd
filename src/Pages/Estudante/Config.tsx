import Avatar from "@/components/Avatar/Avatar";
import ConfiguracaoGeral from "@/components/Configuracoes/ConfiguracaoGeral";
import { Header } from "@/components/Header/header";
import { useEffect, useState } from "react";
import { Layout } from "../layout";
export default function Config() {

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
    <Layout>
      <div className="flex-1 w-full h-full mx-auto ">
        <div className="flex-1 overflow-auto">
          <Header
            titulo="Configurações"
            usuario={<Avatar name={user.nome} src={user.foto} size="md" />}
          />
          <div className="">
            <ConfiguracaoGeral />
          </div>
        </div>
      </div>
    </Layout>
  );
}
