import { X } from "lucide-react";

export function ProfileEditModal({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}) {
  if (!isOpen) return null;

  return (
    <div className="bg-translucido2 fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Editar Perfil</h1>
            <p className="text-xs text-gray-400">
              Edite suas informações abaixo
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#184d8a] p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={22} />
          </button>
        </div>

        <form className="space-y-4">
          {/* Avatar */}
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full flex justify-center items-center mx-auto overflow-hidden border border-gray-400 shadow-sm">
            {user.foto ? (
              <img
                loading="lazy"
                src={user.foto}
                alt={user.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#184d8a] text-white text-4xl sm:text-6xl font-bold">
                {(user.nome || "User")
                  .trim()
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              className="w-full border-2 rounded-lg h-10 text-sm sm:text-base px-4 outline-none focus:border-[#184d8a]"
              value={user.nome || ""}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border-2 rounded-lg h-10 text-sm sm:text-base px-4 outline-none focus:border-[#184d8a]"
              value={user?.email || ""}
            />
          </div>

          {/* Classe + Processo */}
          <div className="flex gap-3">
            <div className="w-28 shrink-0">
              <label className="block text-sm mb-1">Classe</label>
              <select
                required
                value={user?.classe || ""}
                className="w-full border-2 rounded-lg h-10 text-sm px-2 outline-none focus:border-[#184d8a]"
              >
                <option value="" disabled>
                  Grau
                </option>
                <option value="7ª">7ª</option>
                <option value="8ª">8ª</option>
                <option value="9ª">9ª</option>
                <option value="10ª">10ª</option>
                <option value="11ª">11ª</option>
                <option value="12ª">12ª</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nº de Processo
              </label>
              <input
                type="text"
                className="w-full border-2 rounded-lg h-10 text-sm sm:text-base px-4 outline-none focus:border-[#184d8a]"
                value={user?.processo || ""}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="bg-white text-[#184d8a] px-4 py-2 rounded-md border border-[#184d8a] hover:bg-gray-100/50 transition-colors duration-500 text-sm sm:text-base"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-500 text-sm sm:text-base"
              onClick={onClose}
            >
              Concluído
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
