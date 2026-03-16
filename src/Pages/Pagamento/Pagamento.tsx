import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import PagamentoGeral from "@/components/Pagamento/PagamentoGeral";
import { useEffect, useState } from "react";
import { Layout } from "../layout";

export default function Pagamentos() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin && dadosDoLogin !== "undefined") {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  if (!user) return null;

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen">
        <div className="flex flex-col flex-1 overflow-auto">
          <Header
            titulo="Pagamento"
            usuario={<Avatar name={user.nome} src={user.foto} size="md" />}
          />
          <div className="flex-1 p-4 sm:p-6">
            <PagamentoGeral />
          </div>
        </div>
      </div>
    </Layout>
  );
}