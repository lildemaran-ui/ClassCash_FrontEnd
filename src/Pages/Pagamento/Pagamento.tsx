import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import PagamentoGeral from "@/components/Pagamento/PagamentoGeral";
import { useEffect, useState } from "react";
import { Layout } from "../layout";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";

export default function Pagamentos() {
 const [user, setUser] = useState<SessaoUsuario | null>(null);
 
   useEffect(() => {
     const sessao = exigirSessao();
     if (sessao) setUser(sessao.usuario);
   }, []);
 
   if (!user) return null;

  return (
    <Layout>
          <Header
            titulo="Pagamento"
            usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
          />
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            <PagamentoGeral />
          </div>
    </Layout>
  );
}