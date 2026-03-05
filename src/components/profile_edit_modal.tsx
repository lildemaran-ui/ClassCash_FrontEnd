import { X } from "lucide-react";

export function ProfileEditModal({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: User }) {
  if (!isOpen) return null;

  return (
    <div className="  bg-translucido2 fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <div className="flex justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold ">Editar Perfil</h1>
                  <p className="text-xs text-gray-400">
                    Edite suas informações a baixo
                  </p>
                </div>
                <div>
                  <button onClick={onClose} className="text-[#268cff]">
                    <X size={22} />
                  </button>
                </div>
              </div>
              <form className="space-y-4">
                <div className="w-48 h-48 rounded-full flex justify-center items-center mx-auto overflow-hidden border border-gray-400 shadow-sm group  ">
                  {user.foto ? (
                    <img
                      loading="lazy"
                      src={user.foto}
                      alt={user.nome}
                      className="w-full h-full object-cover"
                      // Caso a URL exista mas a imagem falhe ao carregar (erro 404),
                      // você pode opcionalmente adicionar um onError aqui.
                    />
                  ) : (
                    // Fallback: Iniciais do nome
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#268cff] text-white text-6xl font-bold">
                      {(user.nome || "User")
                        .trim()
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                    value={user.nome || ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                    value={user?.email || ""}
                  />
                </div>
                <div className="flex justify-between gap-3">
                  <div className="w-24">
                    <label className="block text-sm mb-1">Classe</label>
                    <select
                      required
                      value={user?.classe || ""}
                      className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
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
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-1">
                      {" "}
                      Nº de Processo
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                      value={user?.processo || ""}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="flex justify-end gap-2
                  mt-20"
                  >
                    <div className="">
                      <button
                        type="button"
                        className="bg-white text-[#268cff] px-4 py-2 rounded-md border border-[#268cff] hover:bg-gray-100/50 transition-colors duration-500"
                        onClick={onClose}
                      >
                        Cancelar
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-500"
                        onClick={onClose}
                      >
                        Concluído
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
  )
}
