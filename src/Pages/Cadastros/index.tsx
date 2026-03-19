// src/components/Cadastro/TelaCadastro.tsx

import { EyeIcon, EyeOff, X, Building2, ArrowRight, AlertCircle, LucideAlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PreSelectedInstitution {
  id: number;
  nome: string;
}

interface RouterState {
  preSelectedInstitution?: PreSelectedInstitution;
  fromInstitutions?: boolean; // flag: já veio da página de instituições
}

// ─── Modal de Aviso ───────────────────────────────────────────────────────────
function InstitutionCheckModal({ onGoCheck, onClose }: {
  onGoCheck: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Topo colorido */}
        <div className="bg-gradient-to-br from-[#268cff] to-[#1a6fd4] p-6 pb-8 relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
            <LucideAlertTriangle className="w-8 h-8 text-white" />
          </div>
          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-all duration-300 hover:bg-blue-50/15 hover:rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-6 pt-5 pb-6 -mt-4 relative">
          {/* Card de destaque */}
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
                  Para se cadastrar, a sua instituição de ensino precisa de estar
                  registada na nossa plataforma.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mb-5 leading-relaxed">
            Clique em <strong className="text-gray-700">"Verificar Instituição"</strong> para
            consultar a lista de instituições parceiras. Após encontrar a sua, clique
            em <strong className="text-gray-700">"Cadastrar‑se"</strong> e será redirecionado
            de volta aqui automaticamente.
          </p>

          {/* Botões */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center">
              <button
              onClick={onGoCheck}
              className="w-full flex items-center justify-center gap-2 bg-[#268cff] text-white text-sm font-bold py-3 px-6 rounded-xl hover:bg-blue-600 active:scale-95 transition-all duration-700 shadow-md shadow-blue-200"
            >
              Verificar Instituição
              <ArrowRight className=" h-5" />
            </button>
            </div>
            <button
              onClick={onClose}
              className="w-full  text-gray-500 text-sm rounded-xl bg-blue-100 py-2 hover:text-gray-600 hover:bg-[#268cff]/10 transition-all duration-500 hover:rounded-xl hover:py-3 hover:font-bold hover:shadow-md hover:text-sm"
            >
              Já verifiquei, continuar mesmo assim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Formulário de Cadastro ───────────────────────────────────────────────────
export function TelaCadastro() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const routerState   = location.state as RouterState | null;
  const preSelected   = routerState?.preSelectedInstitution ?? null;
  const fromInstitutions = routerState?.fromInstitutions ?? false;

  // Mostra o modal se o utilizador NÃO veio da página de instituições
  // e NÃO tem instituição pré-seleccionada
  const [showModal, setShowModal] = useState(
    !fromInstitutions && preSelected === null
  );

  const [mostrarSenha, setMostrar]        = useState<boolean>(false);
  const [image, setImage]                 = useState<string | null>(null);
  const [perfil, setPerfil]               = useState<string>("");
  const [nome, setNome]                   = useState<string>("");
  const [email, setEmail]                 = useState<string>("");
  const [contacto, setContacto]           = useState<string>("");
  const [idInstituicao, setInstituicao]   = useState<number | string>(preSelected?.id ?? "");
  const [proc, setProc]                   = useState<string>("");
  const [idclasse, setClasse]             = useState<number | string>("");
  const [senha, setSenha]                 = useState<string>("");
  const [nomeEstudante, setNomeEstudante] = useState<string>("");
  const [relacao, setRelacao]             = useState<string>("");
  const [instituicoes, setInstituicoes]   = useState<{ idInstituicao: number; nome: string }[]>([]);
  const [classes, setClasses]             = useState<{ idclasse: number; nivel: number }[]>([]);

  // Carregar instituições da API
  useEffect(() => {
    fetch("http://localhost:5000/api/cadastro-instituicao")
      .then((res) => res.json())
      .then((data: { idInstituicao: number; nome: string }[]) => {
        setInstituicoes(data);
        if (preSelected) {
          const found = data.find((i) => i.idInstituicao === preSelected.id);
          if (found) setInstituicao(found.idInstituicao);
        }
      })
      .catch((err) => console.error("Erro ao carregar instituições", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carregar classes quando a instituição muda
  useEffect(() => {
    if (idInstituicao) {
      fetch(`http://localhost:5000/api/classes/${idInstituicao}`)
        .then((res) => res.json())
        .then((data: { idclasse: number; nivel: number }[]) => setClasses(data))
        .catch((err) => console.error("Erro ao carregar classes", err));
    } else {
      setClasses([]);
    }
  }, [idInstituicao]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const MudarPerfil = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPerfil(event.target.value);
    setNome(""); setProc(""); setClasse(""); setEmail("");
    setContacto(""); setSenha(""); setNomeEstudante("");
    setRelacao(""); setImage(null); setClasses([]);
    if (!preSelected) setInstituicao("");
  };

  const DadosCadastro = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();

    const rota = perfil === "Estudante"
      ? "http://localhost:5000/api/cadastroEstudante"
      : "http://localhost:5000/api/cadastroEncarregado";

    const novoUsuario = perfil === "Estudante"
      ? { nome: nome.trim(), email: email.trim().toLowerCase(), senha: senha.trim(), numProcesso: proc.trim(), idInstituicao, numTel: contacto, idclasse }
      : { nome: nome.trim(), email: email.trim().toLowerCase(), senha: senha.trim(), numProcesso: proc.trim(), idInstituicao, numTel: contacto, nomeEducando: nomeEstudante.trim(), grauParentesco: relacao.trim() };

    try {
      const resposta = await fetch(rota, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });
      const data = await resposta.json() as { token?: string; error?: string };
      if (!resposta.ok) throw new Error(data.error ?? "Erro ao cadastrar usuário");
      if (data.token) localStorage.setItem("Token", data.token);
      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => { window.location.href = "/Login"; }, 3000);
    } catch (error) {
      console.error("Erro no Servidor", error);
      toast.error("Erro ao cadastrar usuário.");
    }
  };

  // Navega para a página de instituições passando flag de retorno
  const handleGoToInstitutions = () => {
    navigate("/Instituições");
  };

  return (
    <>
      {/* Modal de aviso — aparece se o utilizador não veio de /Instituições */}
      {showModal && (
        <InstitutionCheckModal
          onGoCheck={handleGoToInstitutions}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Formulário */}
      <div>
        <div className="mx-auto border border-gray-150 rounded-lg flex flex-col w-full justify-center space-y-6 bg-white p-8 shadow-sm sm:w-[390px]">
          <div className="space-y-1 text-center">
            <p className="text-[#268cff] font-bold">Crie a sua Conta</p>
            <p className="text-xs text-gray-400">Insira os seus dados abaixo</p>
          </div>

          {/* Banner de instituição pré-seleccionada */}
          {preSelected && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-[#268cff]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Instituição seleccionada
                </p>
                <p className="text-xs font-semibold text-gray-800 truncate">{preSelected.nome}</p>
              </div>
            </div>
          )}

          <form className="flex flex-col gap-4 w-80" onSubmit={DadosCadastro}>
            {/* Perfil */}
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-medium">Perfil de Usuário</label>
              <select value={perfil} onChange={MudarPerfil}
                className="border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#1e88e5]" required>
                <option value="" disabled>Selecione o seu perfil</option>
                <option value="Estudante">Estudante</option>
                <option value="Encarregado">Encarregado</option>
              </select>
            </div>

            {perfil && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                {/* Nome e Código */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Nome Completo</label>
                    <input required value={nome} type="text"
                      onChange={(e) => setNome(e.target.value.replace(/[0-9]/g, ""))}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]" />
                  </div>
                 {perfil === "Encarregado" && (
                  <div className="w-24">
                    <label className="block text-sm mb-1">Código</label>
                    <input value={proc} type="text" maxLength={6}
                      onChange={(e) => setProc(e.target.value.replace(/\D/g, ""))}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]" />
                  </div>
                 )}
                </div>

                {/* Instituição + Classe */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Instituição</label>
                    {preSelected ? (
                      <div className="relative">
                        <input type="text" readOnly value={preSelected.nome}
                          className="w-full border-2 border-blue-300 bg-blue-50 rounded-lg h-10 text-xs px-4 outline-none text-blue-800 font-medium cursor-default" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500" />
                      </div>
                    ) : (
                      <select required value={idInstituicao}
                        onChange={(e) => setInstituicao(parseInt(e.target.value))}
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]">
                        <option value="" disabled>Selecione</option>
                        {instituicoes.map((i) => (
                          <option key={i.idInstituicao} value={i.idInstituicao}>{i.nome}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  {perfil === "Estudante" && (
                    <div className="w-24">
                      <label className="block text-sm mb-1">Classe</label>
                      <select required value={idclasse}
                        onChange={(e) => setClasse(parseInt(e.target.value))}
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]">
                        <option value="" disabled>Grau</option>
                        <option value="" >Grau</option>
                        
                        {classes.map((c) => (
                          <option key={c.idclasse} value={c.idclasse}>{c.nivel}ª</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Email e Contacto */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Email</label>
                    <input required value={email} type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Contacto</label>
                    <input value={contacto} type="tel" maxLength={9}
                      onChange={(e) => setContacto(e.target.value.replace(/\D/g, ""))}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]" />
                  </div>
                </div>

                {/* Senha */}
                <div className="flex flex-col">
                  <label className="text-sm mb-1">Palavra-Passe</label>
                  <div className="relative">
                    <input required value={senha} type={mostrarSenha ? "text" : "password"}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setMostrar(!mostrarSenha)}>
                      {mostrarSenha
                        ? <EyeIcon size={22} className="text-[#268cffb2]" />
                        : <EyeOff  size={22} className="text-[#268cffb2]" />}
                    </div>
                  </div>
                </div>

                {/* Encarregado */}
                {perfil === "Encarregado" && (
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">Relação Parental</label>
                    <input value={relacao}
                      onChange={(e) => setRelacao(e.target.value.replace(/[0-9]/g, ""))}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]" />
                  </div>
                )}

                {/* Foto */}
                <div className="flex items-center gap-4 py-2 border-t mt-2">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50">
                    {image
                      ? <img loading="lazy" src={image} className="w-full h-full object-cover" alt="foto" />
                      : <span className="text-[10px]">Foto</span>}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange}
                    className="text-[10px] file:bg-blue-50 file:px-3 file:py-2 file:border-none file:rounded-xl file:text-blue-700 file:font-medium" />
                </div>

                <button type="submit"
                  className="bg-[#1e88e5] h-10 w-full rounded-lg text-white font-medium hover:bg-blue-500 transition-colors">
                  Cadastrar
                </button>
              </div>
            )}
          </form>

          <div className="text-center">
            <p className="text-xs">
              Já tem uma conta?{" "}
              <Link to="/Login" className="text-[#1e88e5] hover:underline">Faça o Login</Link>
            </p>
          </div>
        </div>

       
      </div>
    </>
  );
}
