import { EyeIcon, EyeOff, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TelaLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    tipo: "pendente" | "recusado" | "erro";
    texto: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = (await res.json()) as {
        message?: string;
        token?: string;
        perfil?: string;
        usuario?: Record<string, unknown>;
        [key: string]: unknown;
      };

      // ── Status 403 — conta pendente ou recusada ───────────────────────────
      if (res.status === 403) {
        const msg = data.message ?? "";
        if (msg.toLowerCase().includes("pendente")) {
          setStatusMsg({
            tipo: "pendente",
            texto:
              "O seu cadastro ainda está a aguardar aprovação pela secretaria da instituição. Por favor aguarde.",
          });
        } else if (msg.toLowerCase().includes("recusado")) {
          setStatusMsg({
            tipo: "recusado",
            texto:
              "O seu cadastro foi recusado pela secretaria. Por favor contacte a sua instituição para mais informações.",
          });
        } else {
          setStatusMsg({ tipo: "erro", texto: msg });
        }
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setStatusMsg({
          tipo: "erro",
          texto: data.message ?? "Credenciais inválidas.",
        });
        setLoading(false);
        return;
      }
      // Sessão terminada com sucesso
localStorage.removeItem("sessao");

      // ── Login bem sucedido ────────────────────────────────────────────────

      const sessao = {
        token: data.token,
        usuario : {
        id: data.usuario?.idusuario,
        nome: data.usuario?.nome,
        perfil: data.perfil,
        instituicao: data.instituicao,
        idInstituicao: data.idInstituicao,
        numProcesso: data.numProcesso,
        }
      };
    localStorage.setItem("sessao", JSON.stringify(sessao)); 
      // Redirecionar conforme perfil
      const perfil = data.perfil as string;
      if (perfil === "Estudante") navigate("/DashboardEstud");
      else if (perfil === "Encarregado") navigate("/Encarregado");
      else if (perfil === "Secretaria" || perfil === "Instituição")
        navigate("/Secretaria");
      else if (perfil === "Administrador" || perfil === "Super Admin")
        navigate("/Administradores");
      else navigate("/PaginaInicial");
    } catch {
      setStatusMsg({ tipo: "erro", texto: "Erro de ligação ao servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-[#184d8a] font-bold text-lg">Bem-vindo de volta</p>
          <p className="text-xs text-gray-400">
            Insira as suas credenciais para entrar
          </p>
        </div>

        {/* ── Banner de status pendente ── */}
        {statusMsg?.tipo === "pendente" && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800">
                Cadastro em análise
              </p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                {statusMsg.texto}
              </p>
            </div>
          </div>
        )}

        {/* ── Banner de recusa ── */}
        {statusMsg?.tipo === "recusado" && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-800">
                Cadastro não aprovado
              </p>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                {statusMsg.texto}
              </p>
            </div>
          </div>
        )}

        {/* ── Erro genérico ── */}
        {statusMsg?.tipo === "erro" && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-xs text-red-700">{statusMsg.texto}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="oseuemail@exemplo.ao"
              className="w-full border-2 border-gray-200 rounded-xl h-10 text-sm px-4 outline-none focus:border-[#184d8a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Palavra-Passe
            </label>
            <div className="relative">
              <input
                required
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full border-2 border-gray-200 rounded-xl h-10 text-sm px-4 outline-none focus:border-[#184d8a] transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setMostrar(!mostrarSenha)}
              >
                {mostrarSenha ? (
                  <EyeIcon size={20} className="text-[#184d8ab2]" />
                ) : (
                  <EyeOff size={20} className="text-[#184d8ab2]" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#184d8a] text-white font-bold h-10 rounded-xl hover:bg-[#184d8a]/80 transition-colors disabled:opacity-60"
          >
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-400">
            Não tem conta?{" "}
            <Link
              to="/Cadastro"
              className="text-[#184d8a] hover:underline font-medium"
            >
              Cadastre-se
            </Link>
          </p>
          <p className="text-xs text-gray-400">
            Esqueceu a palavra-passe?{" "}
            <Link
              to="/AlterarSenha"
              className="text-[#184d8a] hover:underline font-medium"
            >
              Alterar Senha
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
