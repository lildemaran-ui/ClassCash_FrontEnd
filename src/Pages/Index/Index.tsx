import Nav from "../../components/Menu/Menu";
import Objetivo from "../../Pages/Index/Objetivos";
import fundo from "../../assets/imgFundoPI.jpeg";
import Footer from "../../components/Footer/footer";
import ilustr from "../../assets/Corpo1PI.jpeg";
import ilustr2 from "../../assets/Corpo2PI.jpeg";
import ilustr3 from "../../assets/Corpo3PI.jpeg";
import Cards from "../../Pages/Index/Cards";
import FrasesRotativas from "../../Hooks/FrasesRotativas";
import { Link } from "react-router-dom";
import AppsIlustr from "./AppsIlustr";

export default function PaginaInicial() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden  ">
      
      <Nav />

      {/* Hero */}
      <div className="relative w-full h-screen overflow-hidden ">
        <img
          loading="lazy"
          src={fundo}
          alt="Uma senhora a fazer um pagamento online"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/45 z-[5]" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Pagamentos <FrasesRotativas />
          </h1>
          <p className="drop-shadow-lg text-white font-semibold text-base sm:text-xl mt-4 mb-8 cursor-default">
            Sua escola no controlo, Seus pagamentos sob gestão.
          </p>
          <Link to="/FAQ's">
            <button className="bg-[#268CFF] text-white text-base sm:text-xl px-6 py-2 sm:py-3 rounded-xl drop-shadow-lg hover:bg-blue-600 hover:border hover:border-blue-300 transition-all duration-700">
              Saiba Mais
            </button>
          </Link>
        </div>
      </div>

      {/* Serviços */}
      <section className="px-4 sm:px-8 mt-10">
        <h1 className="text-black font-bold text-xl sm:text-3xl text-center">
          Experiência Intuitiva na ClassCash. Fácil para todos!
        </h1>
        <p className="text-xs sm:text-lg text-gray-500 text-center mt-4 cursor-default">
          Plataforma eficiente, económica, experiente e sem complicações.
        </p>
        <div className="mb-10">
          <Objetivo />
        </div>
      </section>

      {/* Secções com imagens */}
      <section className="text-black px-4 sm:px-8">

        {/* Bloco 1 */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20 mt-16 md:mt-28">
          <div className="w-full md:w-1/2">
            <img
              loading="lazy"
              src={ilustr}
              alt=""
              className="w-full rounded-2xl object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-sm sm:text-lg font-medium leading-relaxed md:leading-loose">
              <span className="text-[#268CFF]">CONECTANDO A EDUCAÇÃO EM TODAS AS ETAPAS </span>
              A nossa plataforma abrange um vasto leque de instituições — desde creches, ATLs,
              colégios, escolas públicas, centros de explicações, centros de formação e até
              universidades. Ao integrar todos esses espaços num único sistema, promovemos inclusão,
              organização e praticidade nos pagamentos escolares.
            </p>
          </div>
        </div>

        {/* Bloco 2 */}
        <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10 md:gap-20 mt-16 md:mt-28">
          <div className="w-full md:w-1/2">
            <p className="text-sm sm:text-lg font-medium leading-relaxed md:leading-loose">
              <span className="text-[#268CFF]">PAGAMENTOS SIMPLIFICADOS, GESTÃO FACILITADA </span>
              Com a nossa plataforma, os pagamentos tornam-se mais rápidos, organizados e seguros.
              Pais, encarregados e instituições ganham mais controlo e transparência nas suas
              transações. Tudo digital, tudo ao alcance de um clique.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <img
              loading="lazy"
              src={ilustr2}
              alt=""
              className="w-full rounded-2xl object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Bloco 3 */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20 mt-16 md:mt-28">
          <div className="w-full md:w-1/2">
            <img
              loading="lazy"
              src={ilustr3}
              alt=""
              className="w-full rounded-2xl object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-sm sm:text-lg font-medium leading-relaxed md:leading-loose">
              <span className="text-[#268CFF]">SEGURANÇA E CONFIANÇA EM CADA TRANSAÇÃO </span>
              Com a nossa plataforma, os pagamentos tornam-se mais rápidos, organizados e seguros.
              Pais, encarregados e instituições ganham mais controlo e transparência nas suas
              transações. Tudo digital, tudo ao alcance de um clique.
            </p>
          </div>
        </div>

        {/* Tudo num só lugar */}
        <div className="mt-20 text-center px-4">
          <h1 className="font-bold text-xl sm:text-3xl cursor-default py-3">
            TUDO O QUE PRECISA, NUM SÓ LUGAR!
          </h1>
          <p className="text-gray-400 text-xs sm:text-lg leading-relaxed max-w-2xl mx-auto cursor-default">
            Tudo está acessível, com apenas alguns cliques, facilitamos o processo para que pais,
            estudantes e instituições poupem tempo e evitem complicações.
          </p>
        </div>
      </section>

      {/* Cards */}
      <Cards />

      {/* Pagamento Online */}
      <section className="px-4 sm:px-8 text-center mt-20">
        <h1 className="text-black font-bold text-xl sm:text-3xl">
          Fazer o pagamento Online nunca foi tão incrível como agora
        </h1>
        <p className="text-xs sm:text-lg text-gray-500 mt-4 mb-12 cursor-default max-w-2xl mx-auto">
          Faça o pagamento usando um dos serviços de pagamento da Emis, como o Multicaixa Express
          ou também pode fazer por meio do PayPal e o PayPay.
        </p>

       <AppsIlustr/>

        <button className="bg-[#268CFF] text-white text-base sm:text-xl px-6 py-2 sm:py-3 rounded-xl drop-shadow-lg hover:bg-[#1675e2] transition-all duration-700 mb-20">
          Fazer pagamentos
        </button>
      </section>

      <Footer />
    </div>
  );
}