import React, { useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo5 from "../../assets/Logo5.png"
import Logo55 from "../../assets/Logo5.5.png"
import { Link } from "react-router-dom";
export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  function OpenMenu() {
    setMenuOpen(true);
  }
  function CloseMenu() {
    setMenuOpen(false);
  }
  const [scrolled, setscrolled]=useState(false)
  const handleScroll = () => {
 const offset = window.scrollY
 if(offset > 50){
  setscrolled(true)
 }
    else {
      setscrolled(false)
    }
  }
useEffect(()=>{
  window.addEventListener('scroll', handleScroll)

  return() => {
    window.removeEventListener('scroll', handleScroll)
  }
},[])

const navbarClasses = `fixed top-0 w-full z-50 transition-colors duration-700 ${scrolled ? 'transparent-bg-nav-scroll' : 'transparent-bg'}`

const textClasses = `font-semibold cursor-pointer transition-colors duration-700 ${scrolled ? 'text-white hover:text-[#268CFF]' : 'text-[#268CFF] hover:text-white'}`

  return (
    <header className=" fixed top-0 w-full scrooll-smooth transparent-bg z-50 antialiased" >
     <div className={navbarClasses}>
       <nav className="flex h-16 sm:h-20 items-center justify-between px-6">
        <div className="text-[#268CFF] flex items-center font-semibold text-xl sm:text-3xl">
          
            <img
            src={scrolled ? Logo55 : Logo5}
            alt="Sosoft Logo"
            className="h-16 sm:h-24 object-contain transition-all duration-700" 
          />
         
         <div className={textClasses}>
           <p className="cursor-default ">ClassCash</p>
         </div>
        </div>
        <div className="hidden md:items-center md:flex gap-4 text-white font-semibold text-base sm:text-lg ">
          
          <a href="" className="hover:text-[#268CFF] transition-colors duration-300 hover:border-b hover:border-[#268CFF] ">Sobre Nós</a>
          <a href="" className="hover:text-[#268CFF] transition-colors duration-300 hover:border-b hover:border-[#268CFF]  ">Contacto</a>
          <a href="" className="hover:text-[#268CFF] transition-colors duration-300 hover:border-b hover:border-[#268CFF]  ">Instituições</a>
          <a href="" className="hover:text-[#268CFF] transition-colors duration-300 hover:border-b hover:border-[#268CFF]  ">FAQ's</a>
          <a href="" className="hover:text-[#268CFF] transition-colors duration-300 hover:border-b hover:border-[#268CFF]  ">Funcionalidades</a>
          <Link to="/Login">
           <button className="  px-3 py-2 rounded-lg border-2 border-[#268CFF] hover:bg-[#268CFF] transition-colors duration-700 font-medium text-white" >
              Entrar
            </button> 
          </Link>
        </div>
        {/* Botão de menu mobile */}
        <button className="md:hidden " onClick={OpenMenu}>
          <Menu size={28} className="text-[#268CFF]" />
        </button>
      </nav>
     </div>
      {/* Menu  mobile */}
      <div
        className={` md:hidden fixed flex  flex-col items-start   px-6 bg-[#268CFF] w-40 justify-start  right-0 top-0 h-screen shadow-lg z-50 ${
          menuOpen
            ? "translate-x-0 opacity-100 font-semibold text-white"
            : "translate-x-full opacity-0"
        } `}
      >
        <div className="flex absolute right-4  top-4 ">
          <X className="text-white " onClick={CloseMenu}></X>
        </div>
        
        <a href="" className="mb-2 ">
          Sobre Nós
        </a>
        <a href="" onClick={CloseMenu} className="mb-2 ">
          Contacto
        </a>
        <a href="" onClick={CloseMenu} className="mb-2 ">
          Instituições
        </a>
        <a href="" onClick={CloseMenu} className="mb-2 ">
          FAQ's
        </a>
        <a href="" onClick={CloseMenu} className="mb-2 ">
          Funcinalidades
        </a>
      </div>
    </header>
  );
}



