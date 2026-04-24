import { Camera, Pen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface User {
  idusuario?: number;
  nome?: string;
  email?: string;
  foto?: string;
  perfil?: string;
  processo?: number | string;
  classe?: string;
  contacto?: string;
  relacao?: string;
  nomeEstudante?: string;
  instituicao?: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave?: (updated: Partial<User>) => void;
}

export function ProfileEditModal({ isOpen, onClose, user, onSave }: ProfileEditModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [contacto, setContacto] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sincroniza campos quando o utilizador muda ou modal abre
  useEffect(() => {
    if (isOpen) {
      setNome(user.nome || "");
      setEmail(user.email || "");
      setContacto(user.contacto || "");
      setFotoPreview(user.foto || null);
      setFotoFile(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      toast.error("O nome não pode estar vazio.");
      return;
    }

    setLoading(true);
    try {
      const sessao = JSON.parse(localStorage.getItem("sessao") || "{}");
      const token = sessao.token;

      const formData = new FormData();
      formData.append("nome", nome.trim());
      formData.append("email", email.trim());
      formData.append("contacto", contacto.trim());
      if (fotoFile) formData.append("foto", fotoFile);

      const res = await fetch(
        `http://localhost:5000/api/usuario/${user.idusuario}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao guardar alterações");
      }

      toast.success("Perfil atualizado com sucesso!");

      // Atualiza sessão no localStorage
      const sessaoAtual = localStorage.getItem("sessao");
  if (sessaoAtual) {
    try {
      const parsed = JSON.parse(sessaoAtual);
      if (parsed.usuario) {
        parsed.usuario.nome = nome.trim();
        parsed.usuario.email = email.trim();
        parsed.usuario.numtel = contacto.trim();
        if (fotoPreview) parsed.usuario.foto = fotoPreview;
      }
      localStorage.setItem("sessao", JSON.stringify(parsed));
        } catch (_) {
          // Silently ignore JSON parsing errors
        }
      }

      onSave?.({ nome: nome.trim(), email: email.trim(), contacto: contacto.trim(), foto: fotoPreview || user.foto });
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setLoading(false);
    }
  };

  const iniciais = (nome || user.nome || "U")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Editar Perfil</h1>
            <p className="text-xs text-gray-400">Atualize as suas informações abaixo</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Avatar com botão de upload */}
          <div className="flex justify-center mb-2">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-primary">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-white text-3xl font-black">
                    {iniciais}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-white border  text-primary  p-2 rounded-xl shadow-lg hover:bg-[#184d8a]/80 transition group border-white"
              >
                <Camera size={14} className="group-hover:text-white" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFotoChange}
              />
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl h-11 text-sm px-4 outline-none focus:border-[#184d8a] transition"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Insira o nome completo"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border-2 border-gray-200 rounded-xl h-11 text-sm px-4 outline-none focus:border-[#184d8a] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Insira o email"
            />
          </div>

          {/* Contacto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contacto
            </label>
            <input
              type="tel"
              className="w-full border-2 border-gray-200 rounded-xl h-11 text-sm px-4 outline-none focus:border-[#184d8a] transition"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              placeholder="Ex: +244 9XX XXX XXX"
            />
          </div>

          {/* Campos somente leitura */}
          {(user.classe || user.processo) && (
            <div className="flex gap-3">
              {user.classe && (
                <div className="w-28 shrink-0">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Classe</label>
                  <input
                    type="text"
                    readOnly
                    value={user.classe}
                    className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl h-11 text-sm px-3 text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}
              {user.processo && (
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nº Processo</label>
                  <input
                    type="text"
                    readOnly
                    value={user.processo}
                    className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl h-11 text-sm px-4 text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-semibold"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl text-white text-sm font-bold transition flex items-center gap-2 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#184d8a] hover:bg-[#184d8a]/85 shadow-md"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  A guardar...
                </>
              ) : (
                "Guardar Alterações"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}