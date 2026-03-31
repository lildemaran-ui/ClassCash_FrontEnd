import { Link } from "react-router-dom";
import { useState } from "react";
import { X, Menu } from "lucide-react";
import logo5555 from "../../assets/logo5.5.png";
export default function MenuEstatico() {
  const [menuOpen, setMenuOpen] = useState(false);
  function OpenMenu() {
    setMenuOpen(true);
  }
  function CloseMenu() {
    setMenuOpen(false);
  }

  return (
    <header className=" fixed top-0 w-full scrooll-smooth transparent-bg z-50 antialiased">
      <div>
        <nav className="flex h-16 sm:h-20 items-center justify-between  menu-translucido px-4 sm:px-6 lg:px-10">
          <div className="text-[#184d8a] flex items-center font-semibold text-xl sm:text-3xl">
            <img
              loading="lazy"
              src={logo5555}
              alt="Sosoft Logo"
              className="h-14 sm:h-20 lg:h-24 object-contain transition-all drop-shadow-md duration-700 cursor-pointer"
            />

            <div>
              <p className="cursor-pointer text-white drop-shadow-md ">
                ClassCash
              </p>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:gap-4 gap-3 text-white font-semibold text-sm sm:text-base ">
            <Link
              to="/PaginaInicial"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#184d8a] drop-shadow-md "
            >
              Início
            </Link>
            <Link
              to="/AboutUs"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#184d8a] drop-shadow-md "
            >
              Sobre Nós
            </Link>
            <Link
              to="/Contacts"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#184d8a] drop-shadow-md "
            >
              Contacto
            </Link>
            <Link
              to="/Instituições"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#184d8a] drop-shadow-md "
            >
              Instituições
            </Link>
            <Link
              to="/FAQ's"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#184d8a] drop-shadow-md "
            >
              FAQ's
            </Link>
            <Link
              to=""
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#184d8a] drop-shadow-md "
            >
              Funcionalidades
            </Link>
            <Link to="/Login">
              <button className="border-white drop-shadow-md px-3 py-2 rounded-lg border-2 transition-colors duration-700 font-medium text-white ">
                Entrar
              </button>
            </Link>
          </div>
          {/* Botão de menu  */}
          <button className="lg:hidden p-1 " onClick={OpenMenu}>
            <Menu size={24} className="text-white" />
          </button>
        </nav>
      </div>
      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={CloseMenu}
        />
      )}

      {/* Drawer melhorado */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-screen z-50 w-72 sm:w-80
          bg-[#184d8a] flex flex-col
          transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header do drawer */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <img loading="lazy" src={logo5555} alt="Logo" className="h-10" />
            <span className="text-white font-bold text-lg">ClassCash</span>
          </div>
          <button
            onClick={CloseMenu}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col flex-1 px-4 py-6 gap-1 overflow-y-auto">
          {[
            { to: "/PaginaInicial", label: "Início" },
            { to: "/AboutUs", label: "Sobre Nós" },
            { to: "/Contacts", label: "Contacto" },
            { to: "/Instituições", label: "Instituições" },
            { to: "/FAQ's", label: "FAQ's" },
            { to: "", label: "Funcionalidades" },
          ].map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              onClick={CloseMenu}
              className="text-white font-medium text-base px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Botão entrar no fundo */}
        <div className="px-6 py-6 border-t border-white/20">
          <Link to="/Login" onClick={CloseMenu}>
            <button className="w-full py-3 rounded-lg border-2 border-white text-white font-semibold text-base hover:bg-white hover:text-[#184d8a] transition-colors duration-300">
              Entrar
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
