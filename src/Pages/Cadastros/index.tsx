// src/components/Cadastro/TelaCadastro.tsx
// CORRECÇÕES:
// 1. Encarregado: nomeEstudante usava estado errado (relacao) — corrigido
// 2. Campos enviados ao backend alinhados com o que o controller espera
// 3. Campo "Código" removido (é gerado pela secretaria após aprovação)
// 4. idclasse enviado correctamente (minúsculo)

import {
  AlertCircle,
  ArrowRight,
  Building2,
  EyeIcon,
  EyeOff,
  ImagePlus,
  LucideAlertTriangle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PreSelectedInstitution {
  idInstituicao: number;
  nome: string;
}
interface RouterState {
  preSelectedInstitution?: PreSelectedInstitution;
  fromInstitutions?: boolean;
}

// ─── Modal de Aviso ───────────────────────────────────────────────────────────
function InstitutionCheckModal({
  onGoCheck,
  onClose,
}: {
  onGoCheck: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-[#184d8a] to-[#1a6fd4] p-6 pb-8 relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
            <LucideAlertTriangle className="w-8 h-8 text-white" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
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
              className="w-full flex items-center justify-center gap-2 bg-[#184d8a] text-white text-sm font-bold py-3 px-6 rounded-xl hover:bg-blue-600 active:scale-95 transition-all shadow-md"
            >
              Verificar Instituição <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 text-sm rounded-xl bg-blue-100 py-2 hover:bg-[#184d8a]/10 hover:font-bold transition-all"
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
  const [image, setImage] = useState<string | null>(null);
  const [perfil, setPerfil] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [contacto, setContacto] = useState("");
  const [senha, setSenha] = useState("");
  const [idInstituicao, setInstituicao] = useState<number | string>(
    preSelected?.idInstituicao ?? "",
  );
  const [idclasse, setClasse] = useState<number | string>("");
  const [numProcesso, setNumProcesso] = useState("");
  const [nomeEstudante, setNomeEstudante] = useState(""); // educando (encarregado)
  const [grauParentesco, setGrauParentesco] = useState("");

  const [instituicoes, setInstituicoes] = useState<
    { idInstituicao: number; nome: string }[]
  >([]);
  const [classes, setClasses] = useState<{ idclasse: number; nivel: number }[]>(
    [],
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/cadastro-instituicao")
      .then((r) => r.json())
      .then((data: { idInstituicao: number; nome: string }[]) => {
        setInstituicoes(data);
        if (preSelected) {
          const found = data.find(
            (i) => i.idInstituicao === preSelected.idInstituicao,
          );
          if (found) setInstituicao(found.idInstituicao);
        }
      })
      .catch((err) => console.error("Erro ao carregar instituições", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (idInstituicao) {
      fetch(`http://localhost:5000/api/classes/${idInstituicao}`)
        .then((r) => r.json())
        .then((data: { idclasse: number; nivel: number }[]) => setClasses(data))
        .catch((err) => console.error("Erro ao carregar classes", err));
    } else {
      setClasses([]);
      setClasse("");
    }
  }, [idInstituicao]);

  const MudarPerfil = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerfil(e.target.value);
    setNome("");
    setEmail("");
    setContacto("");
    setSenha("");
    setNumProcesso("");
    setClasse("");
    setNomeEstudante("");
    setGrauParentesco("");
    setImage(null);
    setClasses([]);
    if (!preSelected) setInstituicao("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const DadosCadastro = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    // ✅ VALIDAÇÃO
    if (!idInstituicao || isNaN(Number(idInstituicao))) {
      toast.error("Instituição inválida");
      return;
    }

    if (!perfil) {
      toast.error("Selecione um perfil");
      return;
    }

    // Campos exactamente como o controller os espera
    const body =
      perfil === "Estudante"
        ? {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha: senha.trim(),
            numProcesso: numProcesso.trim(),
            idInstituicao,
            idclasse: idclasse || null,
            numTel: contacto || "000000000",
          }
        : {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha: senha.trim(),
            numTel: contacto || "000000000",
            nomeEstudante: nomeEstudante.trim(),
            numProcesso: numProcesso.trim(),
            idInstituicao,
            idclasse: idclasse || null,
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

      if (data.token) localStorage.setItem("Token", data.token);

      toast.success("Cadastro realizado! Aguarde a aprovação da secretaria.");

      setTimeout(() => {
        navigate("/Login");
      }, 3000);
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
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-medium">
                Perfil de Usuário
              </label>
              <select
                value={perfil}
                onChange={MudarPerfil}
                required
                className="border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#1e88e5]"
              >
                <option value="" disabled>
                  Selecione o seu perfil
                </option>
                <option value="Estudante">Estudante</option>
                <option value="Encarregado">Encarregado</option>
              </select>
            </div>

            {perfil && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                {/* Nome */}
                <div>
                  <label className="block text-sm mb-1">
                    {perfil === "Encarregado"
                      ? "Nome do Encarregado"
                      : "Nome Completo"}
                  </label>
                  <input
                    required
                    value={nome}
                    type="text"
                    onChange={(e) =>
                      setNome(e.target.value.replace(/[0-9]/g, ""))
                    }
                    className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]"
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
                          className="w-full border-2 border-blue-300 bg-blue-50 rounded-lg h-10 text-xs px-4 outline-none text-blue-800 font-medium cursor-default"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500" />
                      </div>
                    ) : (
                      <select
                        required
                        value={idInstituicao}
                        onChange={(e) =>
                          setInstituicao(parseInt(e.target.value))
                        }
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]"
                      >
                        <option value="" disabled>
                          Selecione
                        </option>
                        {instituicoes.map((i) => (
                          <option key={i.idInstituicao} value={i.idInstituicao}>
                            {i.nome}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="w-24">
                    <label className="block text-sm mb-1">Classe</label>

                    {classes.length === 0 && idInstituicao ? (
                      // Sem classes — avisa mas não bloqueia
                      <div className="w-full border-2 border-amber-300 bg-amber-50 rounded-lg h-10 text-[10px] px-2 flex items-center text-amber-600 font-medium">
                        Sem classes
                      </div>
                    ) : (
                      <select
                        value={idclasse}
                        onChange={(e) => setClasse(parseInt(e.target.value))}
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#184d8a]"
                      >
                        <option value="" disabled>
                          Grau
                        </option>
                        {classes.map((c) => (
                          <option key={c.idclasse} value={c.idclasse}>
                            {c.nivel}ª
                          </option>
                        ))}
                      </select>
                    )}

                    {classes.length === 0 && idInstituicao && (
                      <p className="text-[10px] text-amber-600 mt-0.5 leading-tight">
                        Esta instituição ainda não tem classes configuradas.
                      </p>
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

                {/* Email e Contacto */}
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

                {/* Campos do Encarregado */}
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
                  className="bg-[#1e88e5] h-10 w-full rounded-lg text-white font-medium hover:bg-blue-500 transition-colors"
                >
                  Cadastrar
                </button>
              </div>
            )}
          </form>

          <div className="text-center">
            <p className="text-xs">
              Já tem uma conta?{" "}
              <Link to="/Login" className="text-[#1e88e5] hover:underline">
                Faça o Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
