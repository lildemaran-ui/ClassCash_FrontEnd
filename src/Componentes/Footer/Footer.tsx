import logo from "../../assets/Logo5.5.png"
export default function Footer() {
  return (
    <div>
      <footer className="bg-[#268CFF] text-white w-full">
        <div className="max-w-7xl mx-auto py-12 px-10 grid grid-cols-1 sm:grid-cols-4 gap-20">
        <div>
          <div className="flex border-b  items-center " >
            <img src={logo} alt="" className="h-28" />
            <p className="text-xl font-medium ">ClassCash</p>
          </div>
        </div>
           <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 cursor-default">
              Navegação
            </h3>
            <ol className="space-y-2 ">
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Início
              </li>
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Sobre nós
              </li>
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Contacto
              </li>
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Instituições
              </li>
              <li className=" text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                FAQ's
              </li>
              <li className=" text-sm sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Funcionalidades
              </li>
            </ol>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 cursor-default">
              Métodos de pagamento
            </h3>
            <ol className="space-y-2 ">
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Multicaixa Express
              </li>
              <li className="hover:text-blue-200 text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
               Unitel Money
              </li>
              <li className=" text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
               PayPay
              </li>
              
            </ol>
          </div>
           <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 cursor-default">
              Contacto
            </h3>
            <ol className="space-y-2 ">
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Tel.: (da instituição)
              </li>
              <li className=" text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
               Email: (da instituição)
              </li>
              <li className=" text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
               Localização: (da instituição)
              </li>
              
            </ol>
          </div>
        </div>
        <p className="text-sm sm:text-base items-center flex justify-center cursor-default pb-10">© 2025 ClassCash. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
