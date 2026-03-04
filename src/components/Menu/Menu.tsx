import React, { useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo5 from "../../assets/Logo5.png";
import Logo55 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";
export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  function OpenMenu() {
    setMenuOpen(true);
  }
  function CloseMenu() {
    setMenuOpen(false);
  }
  const [scrolled, setscrolled] = useState(false);
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setscrolled(true);
    } else {
      setscrolled(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarClasses = `fixed top-0 w-full z-50 transition-colors duration-700 ${scrolled ? "menu-translucido" : "transparent-bg "}`;

  const textClasses = `font-semibold cursor-pointer transition-colors duration-700 ${scrolled ? "text-white hover:text-[#268CFF]" : "text-[#268CFF] hover:text-white"}`;
  const borderClasses = `font-semibold cursor-pointer transition-colors duration-700 ${scrolled ? "border-white drop-shadow-md px-3 py-2 rounded-lg border-2 transition-colors duration-700 font-medium text-white" : "border-[#268CFF] hover:border-white px-3 py-2 rounded-lg border-2 transition-colors duration-700 font-medium text-white"}`;

  return (
    <header className=" fixed top-0 w-full scrooll-smooth transparent-bg z-50 antialiased">
      <div className={navbarClasses}>
        <nav className="flex h-16 sm:h-20 items-center justify-between px-6">
          <div className="text-[#268CFF] flex items-center font-semibold text-xl sm:text-3xl">
            <img
              loading="lazy"
              src={scrolled ? Logo55 : Logo5}
              alt="Sosoft Logo"
              className="h-16 sm:h-24 object-contain transition-all drop-shadow-md duration-700"
            />

            <div className={textClasses}>
              <p className="cursor-default drop-shadow-md ">ClassCash</p>
            </div>
          </div>
          <div className="hidden md:items-center md:flex gap-4 text-white font-semibold text-base sm:text-lg ">
            <Link
              to="/PaginaInicial"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#268CFF] drop-shadow-md "
            >
              Início
            </Link>
            <Link
              to="/AboutUs"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#268CFF] drop-shadow-md "
            >
              Sobre Nós
            </Link>
            <Link
              to="/Contacts"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#268CFF] drop-shadow-md "
            >
              Contacto
            </Link>
            <Link
              to="/Instituições"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#268CFF] drop-shadow-md "
            >
              Instituições
            </Link>
            <Link
              to="/FAQ's"
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#268CFF] drop-shadow-md "
            >
              FAQ's
            </Link>
            <Link
              to=""
              className="hover:text-blue-600 transition-colors duration-300 hover:border-b hover:border-[#268CFF] drop-shadow-md "
            >
              Funcionalidades
            </Link>
            <Link to="/Login">
              <button className={borderClasses}>Entrar</button>
            </Link>
          </div>
          {/* Botão de menu mobile */}
          <button className="md:hidden " onClick={OpenMenu}>
            <Menu size={22} className="text-[#268CFF]" />
          </button>
        </nav>
      </div>
      {/* Menu  mobile */}
      <div
        className={` md:hidden fixed flex  flex-col items-start   px-6 bg-[#268CFF]  w-40 justify-start  right-0 top-0 h-screen shadow-lg z-50 ${
          menuOpen
            ? "translate-x-0 opacity-100 font-semibold text-white"
            : "translate-x-full opacity-0"
        } `}
      >
        <div className="flex absolute right-4  top-4 ">
          <X className="text-white " onClick={CloseMenu}></X>
        </div>
        <Link to="/PaginaInicial" className="mb-2 ">
          Início
        </Link>
        <Link to="/AboutUs" className="mb-2 ">
          Sobre Nós
        </Link>
        <Link to="/Contacts" onClick={CloseMenu} className="mb-2 ">
          Contacto
        </Link>
        <Link to="/Instituições" onClick={CloseMenu} className="mb-2 ">
          Instituições
        </Link>
        <Link to="/FAQ's" onClick={CloseMenu} className="mb-2 ">
          FAQ's
        </Link>
        <Link to="" onClick={CloseMenu} className="mb-2 ">
          Funcinalidades
        </Link>
      </div>
    </header>
  );
}
