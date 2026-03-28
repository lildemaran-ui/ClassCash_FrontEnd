import { Link } from "react-router-dom";
import logo from "../../assets/logo5.5.png";

export default function Footer() {
  return (
    <div>
      <footer className="bg-[#184d8a] text-white w-full">
        <div className="max-w-7xl mx-auto py-10 px-6 sm:px-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-20">
          {/* Logo — ocupa as 2 colunas no mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex border-b items-center">
              <img loading="lazy" src={logo} alt="" className="h-20 sm:h-28" />
              <p className="text-lg sm:text-xl font-medium">ClassCash</p>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 cursor-default">
              Navegação
            </h3>
            <ol className="space-y-2">
              <Link to="/PaginaInicial">
                <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                  Início
                </li>
              </Link>
              <Link to="/AboutUs">
                <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                  Sobre nós
                </li>
              </Link>
              <Link to="/Contacts">
                <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                  Contacto
                </li>
              </Link>
              <Link to="/Instituições">
                <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                  Instituições
                </li>
              </Link>
              <Link to="/FAQ's">
                <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                  FAQ's
                </li>
              </Link>
              <Link to="/Funcionalidades">
                <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                  Funcionalidades
                </li>
              </Link>
            </ol>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 cursor-default">
              Métodos de pagamento
            </h3>
            <ol className="space-y-2">
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Multicaixa Express
              </li>
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Unitel Money
              </li>
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                PayPay
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 cursor-default">
              Contacto
            </h3>
            <ol className="space-y-2">
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Tel.: +244 923 456 789
              </li>
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Email: classcash@gmail.com
              </li>
              <li className="text-xs sm:text-base transition-colors duration-500 cursor-pointer hover:font-bold">
                Localização: -----
              </li>
            </ol>
          </div>
        </div>

        <p className="text-sm sm:text-base items-center flex justify-center cursor-default pb-8 px-4 text-center">
          © 2025 ClassCash. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
