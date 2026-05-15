import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  EyeIcon,
  EyeOff,
  LucideAlertTriangle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface PreSelectedInstitution {
  idinstituicao: number; // FIX: minúsculo — igual ao que a BD retorna
  nome: string;
}
interface RouterState {
  preSelectedInstitution?: PreSelectedInstitution;
  fromInstitutions?: boolean;
}
interface Instituicao {
  idinstituicao: number; // FIX: minúsculo — igual ao que a BD retorna
  nome: string;
}
interface Classe {
  idclasse: number;
  nivel: number;
}

// ─── Modal de Aviso ───────────────────────────────────────────────────────────
function InstitutionCheckModal({
  onGoCheck,
  onClose,
}: {
  onGoCheck: () => void;
  onClose: () => void;
}) {
  /*   useEffect(() => {
    // Trava o scroll
    document.body.style.overflow = "hidden";
    
    // Cleanup: Destrava o scroll quando a modal for desmontada
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []); */
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-[#184d8a] to-[#1a6fd4] p-6 pb-8 relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
            <LucideAlertTriangle className="w-8 h-8 text-white" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors hover:scale-110  hover:bg-primary/20 p-1 rounded-3xl  "
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pt-5 pb-6 -mt-4 relative">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">
                  Antes de criar a sua conta
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Para se cadastrar, a sua instituição precisa estar registada
                  na plataforma.
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mb-5 leading-relaxed">
            Clique em{" "}
            <strong className="text-gray-700">"Verificar Instituição"</strong>{" "}
            para consultar a lista. Após encontrar a sua, clique em{" "}
            <strong className="text-gray-700">"Cadastrar‑se"</strong>.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={onGoCheck}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold py-3 px-6 rounded-xl hover:bg-primary/80 active:scale-95 transition-all shadow-md"
            >
              Verificar Instituição <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 text-sm rounded-xl bg-blue-100 py-2 hover:bg-primary/10 hover:font-bold transition-all"
            >
              Já verifiquei, continuar mesmo assim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Formulário ───────────────────────────────────────────────────────────────
export function TelaCadastro() {
  const location = useLocation();
  const navigate = useNavigate();
  const routerState = location.state as RouterState | null;
  const preSelected = routerState?.preSelectedInstitution ?? null;
  const fromInstitutions = routerState?.fromInstitutions ?? false;

  const [showModal, setShowModal] = useState(
    !fromInstitutions && preSelected === null,
  );
  const [mostrarSenha, setMostrar] = useState(false);
  const [perfil, setPerfil] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [contacto, setContacto] = useState("");
  const [senha, setSenha] = useState("");
  // FIX: idInstituicao começa com o id pré-seleccionado (usando campo correcto da BD)
  const [idInstituicao, setInstituicao] = useState<number | "">(
    preSelected?.idinstituicao ?? "",
  );
  const [idclasse, setClasse] = useState<number | "">("");
  const [numProcesso, setNumProcesso] = useState("");
  const [nomeEstudante, setNomeEstudante] = useState("");
  const [grauParentesco, setGrauParentesco] = useState("");

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Carregar instituições
  useEffect(() => {
    fetch("http://localhost:5000/api/cadastro-instituicao")
      .then((r) => r.json())
      .then((data: Instituicao[]) => {
        setInstituicoes(data);
        // FIX: usa idinstituicao (minúsculo) para encontrar a pré-seleccionada
        if (preSelected) {
          const found = data.find(
            (i) => i.idinstituicao === preSelected.idinstituicao,
          );
          if (found) setInstituicao(found.idinstituicao);
        }
      })
      .catch(() => toast.error("Erro ao carregar instituições"));
  }, []);

  // Carregar classes quando instituição muda
  useEffect(() => {
    if (!idInstituicao) {
      setClasses([]);
      setClasse("");
      return;
    }
    setLoadingClasses(true);
    // FIX: rota correta — agora existe no backend
    fetch(`http://localhost:5000/api/classes/${idInstituicao}`)
  .then((r) => r.json())
  .then((data: Classe[]) => {
    // Remove duplicatas por nivel (segurança extra)
    const unicas = data.filter(
      (c, index, self) => index === self.findIndex(x => x.nivel === c.nivel)
    );
    setClasses(unicas);
    setClasse("");
  })
      .catch(() => toast.error("Erro ao carregar classes"))
  .finally(() => setLoadingClasses(false));
  }, [idInstituicao]);

  const MudarPerfil = (value: string) => {
    setPerfil(value);
    setNome("");
    setEmail("");
    setContacto("");
    setSenha("");
    setNumProcesso("");
    setClasse("");
    setNomeEstudante("");
    setGrauParentesco("");
    if (!preSelected) setInstituicao("");
  };

  const DadosCadastro = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    if (!idInstituicao) {
      toast.error("Selecione uma instituição");
      return;
    }
    if (!perfil) {
      toast.error("Selecione um perfil");
      return;
    }

    // FIX: body alinhado exactamente com o que cada controller espera
    const body =
      perfil === "Estudante"
        ? {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha: senha.trim(),
            numProcesso: numProcesso.trim(),
            idInstituicao,
            idClasse: idclasse || null,
            numTel: contacto || "000000000",
          }
        : {
            nomeEncarregado: nome.trim(),
            emailEncarregado: email.trim().toLowerCase(),
            senhaEncarregado: senha.trim(),
            numTelEncarregado: contacto || "000000000",
            nomeEducando: nomeEstudante.trim(),
            numProcesso: numProcesso.trim(),
            idInstituicao,
            idClasse: idclasse || null,
            grauParentesco: grauParentesco.trim(),
          };

    const rota =
      perfil === "Estudante"
        ? "http://localhost:5000/api/cadastroEstudante"
        : "http://localhost:5000/api/cadastroEncarregado";

    try {
      const res = await fetch(rota, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Erro ao cadastrar");

      toast.success("Cadastro realizado! Aguarde a aprovação da secretaria.");
      setTimeout(() => navigate("/Login"), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar.");
    }
  };

  return (
    <>
      {showModal && (
        <InstitutionCheckModal
          onGoCheck={() => navigate("/Instituições")}
          onClose={() => setShowModal(false)}
        />
      )}

      <div>
        <div className="mx-auto border border-gray-150 rounded-lg flex flex-col w-full justify-center space-y-6 bg-white p-8 shadow-sm sm:w-[390px]">
          <div className="space-y-1 text-center">
            <p className="text-[#184d8a] font-bold">Crie a sua Conta</p>
            <p className="text-xs text-gray-400">Insira os seus dados abaixo</p>
          </div>

          {preSelected && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-[#184d8a]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Instituição seleccionada
                </p>
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {preSelected.nome}
                </p>
              </div>
            </div>
          )}

          <form className="flex flex-col gap-4 w-80" onSubmit={DadosCadastro}>
            {/* Perfil */}
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-medium">
                Perfil de Usuário
              </label>
              <Select value={perfil} onValueChange={MudarPerfil}>
                <SelectTrigger className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]/80">
                  <SelectValue placeholder="Selecione o seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estudante">Estudante</SelectItem>
                  <SelectItem value="Encarregado">Encarregado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {perfil && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                {/* Nome */}
                <div>
                  <label className="block text-sm mb-1">
                    {perfil === "Encarregado"
                      ? "Nome Completo"
                      : "Nome Completo"}
                  </label>
                  <input
                    required
                    value={nome}
                    type="text"
                    onChange={(e) =>
                      setNome(e.target.value.replace(/[0-9]/g, ""))
                    }
                    className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]/80"
                  />
                </div>

                {/* Instituição + Classe */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Instituição</label>
                    {preSelected ? (
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={preSelected.nome}
                          className="w-full border-2 border-blue-300 bg-blue-50 rounded-lg h-10 text-xs px-4 outline-none text-[#184d8a] font-medium cursor-default"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500" />
                      </div>
                    ) : (
                      <Select
                        value={idInstituicao.toString()}
                        onValueChange={(value) =>
                          setInstituicao(parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:outline-none focus:border-[#184d8a]/80">
                          <SelectValue placeholder="Selecione a instituição" />
                        </SelectTrigger>
                        <SelectContent>
                          {instituicoes.map((i) => (
                            <SelectItem
                              key={i.idinstituicao}
                              value={i.idinstituicao.toString()}
                            >
                              {i.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="w-24">
                    <label className="block text-sm mb-1">Classe</label>
                    {loadingClasses ? (
                      <div className="w-full border-2 border-gray-200 rounded-lg h-10 text-[10px] px-2 flex items-center text-gray-400">
                        A carregar...
                      </div>
                    ) : classes.length === 0 && idInstituicao ? (
                      <div className="w-full border-2 border-amber-300 bg-amber-50 rounded-lg h-10 text-[10px] px-2 flex items-center text-amber-600 font-medium">
                        Sem classes
                      </div>
                    ) : (
                      <Select
                        value={idclasse !== "" ? idclasse.toString() : ""}
                        onValueChange={(value) => setClasse(parseInt(value))}
                      >
                        <SelectTrigger className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]/80">
                          <SelectValue placeholder="Classe" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem
                              key={c.idclasse}
                              value={c.idclasse.toString()}
                            >
                              {c.nivel != null ? `${c.nivel}ª` : null}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Número de processo */}
                <div>
                  <label className="block text-sm mb-1">
                    Número de Processo
                  </label>
                  <input
                    required
                    value={numProcesso}
                    type="text"
                    maxLength={6}
                    placeholder="Ex: 123456"
                    onChange={(e) =>
                      setNumProcesso(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]"
                  />
                </div>

                {/* Email + Contacto */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Email</label>
                    <input
                      required
                      value={email}
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Contacto</label>
                    <input
                      value={contacto}
                      type="tel"
                      maxLength={9}
                      onChange={(e) =>
                        setContacto(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-sm mb-1">Palavra-Passe</label>
                  <div className="relative">
                    <input
                      required
                      value={senha}
                      type={mostrarSenha ? "text" : "password"}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setMostrar(!mostrarSenha)}
                    >
                      {mostrarSenha ? (
                        <EyeIcon size={20} className="text-[#184d8ab2]" />
                      ) : (
                        <EyeOff size={20} className="text-[#184d8ab2]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Campos exclusivos do Encarregado */}
                {perfil === "Encarregado" && (
                  <>
                    <div>
                      <label className="block text-sm mb-1">
                        Nome do Educando
                      </label>
                      <input
                        required
                        value={nomeEstudante}
                        type="text"
                        onChange={(e) =>
                          setNomeEstudante(e.target.value.replace(/[0-9]/g, ""))
                        }
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Relação Parental
                      </label>
                      <input
                        required
                        value={grauParentesco}
                        type="text"
                        placeholder="Ex: Pai, Mãe, Tio..."
                        onChange={(e) =>
                          setGrauParentesco(
                            e.target.value.replace(/[0-9]/g, ""),
                          )
                        }
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="bg-primary h-10 w-full rounded-lg text-white font-medium hover:bg-primary/80 transition-colors"
                >
                  Cadastrar
                </button>
              </div>
            )}
          </form>

          <div className="text-center">
            <p className="text-xs">
              Já tem uma conta?{" "}
              <Link
                to="/Login"
                className="text-[#184d8a] font-medium hover:underline"
              >
                Faça o Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
