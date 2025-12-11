import logo from "../../assets/Logo5.5.png"
export default function Footer() {
  return (
    <div>
      <footer className="bg-[#268CFF] text-white w-full">
        <div className="max-w-7xl mx-auto py-12 px-10 grid grid-cols-1 sm:grid-cols-4 gap-15">
        <div>
          <div className="flex items-center " >
            <img src={logo} alt="" className="h-28" />
            <p className="text-xl ">ClassCash</p>
          </div>
        </div>
           <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 cursor-default">
              Navegação
            </h3>
            <ol className="space-y-2 ">
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
                Início
              </li>
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
                Sobre nós
              </li>
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
                Contacto
              </li>
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
                Instituições
              </li>
              <li className="hover:text-blue-200 text-xs sm:text-basetransition-colors duration-700 cursor-pointer">
                FAQ's
              </li>
              <li className="hover:text-blue-200 text-sm sm:text-basetransition-colors duration-700 cursor-pointer">
                Funcionalidades
              </li>
            </ol>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 cursor-default">
              Métodos de pagamento
            </h3>
            <ol className="space-y-2 ">
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
                Multicaixa Express
              </li>
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
               Unitel Money
              </li>
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
               Afrimoney
              </li>
              
            </ol>
          </div>
           <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 cursor-default">
              Contacto
            </h3>
            <ol className="space-y-2 ">
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
                Tel.: +244 9-- --- --- (do adm)
              </li>
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
               Email: instituto@gmail.com (do adm)
              </li>
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-700 cursor-pointer">
               Localização: ENdereço da escola
              </li>
              
            </ol>
          </div>
        </div>
        <p className="text-sm sm:text-base items-center flex justify-center cursor-default pb-10">© 2025 ClassCash. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
