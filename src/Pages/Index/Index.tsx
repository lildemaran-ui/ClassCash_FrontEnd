import Nav from "../../Componentes/Menu/Menu";
import Objetivo from "../../Pages/Index/Objetivos";
import fundo from "../../assets/fundo1.jpg";
import Footer from "../../Componentes/Footer/Footer";
import ilustr from "../../assets/ilstr1.jpg";
import ilustr2 from "../../assets/ilstr2.jpg";
import ilustr3 from "../../assets/ilstr3.jpg";
import Cards from "../../Pages/Index/Cards";
import FrasesRotativas from "../../Hooks/FrasesRotativas";
import appacounts from "../../assets/appcounts.png";
import { Link } from "react-router-dom";

export default function PaginaInicial() {
  return (
    <div className=" flex-1 flex-col">
      <Nav></Nav>
      <div className="relative w-full h-screen overflow-hidden  ">
        <img
          loading="lazy"
          src={fundo}
          alt="Uma senhora a fazer um pagamento online"
          className="absolute top-0 left-0 w-full h-full object-cover z-0 "
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/45  z-5 "></div>
        <div className="relative z-10 flex flex-col  items-center justify-center h-full text-center text-xl  sm:text-4xl font-bold cursor-default  text-white  px-4">
          <h1 className="drop-shadow-lg">
            Pagamentos <FrasesRotativas />{" "}
          </h1>
          <div className="drop-shadow-lg mb-10 font-roboto shadow-sm text-white font-semibold text-lg sm:text-xl mt-6 cursor-default">
            <p>Sua escola no controlo, Seus pagamentos sob gestão.</p>
          </div>

          <Link to="/FAQ's">
            <button className="bg-[#268CFF] hover:border hover:border-blue-300 hover:text-white text-base p-2 sm:text-xl  hover:text-lg rounded-xl drop-shadow-lg text-white hover:bg-blue-600  transition-all duration-700 sm:p-3 ">
              Saiba Mais
            </button>
          </Link>
        </div>
      </div>
      {/* /**Nossos Serviços */}
      <h1 className="text-black font-bold font-roboto items-center justify-center text-xl sm:text-3xl flex mt-10 ml-6  ">
        Experiência Intuitiva na ClassCash. Fácil para todos!
      </h1>
      <p className=" text-xs sm:text-lg font-roboto text-gray-500 text-center  mt-5 cursor-default">
        Plataforma eficiente, económica, experiente e sem complicações.
      </p>
      <div className="mb-10">
        <Objetivo></Objetivo>
      </div>
      <section className="min-h-screen text-black ">
        <div className="max-w-5xl justify-between text-start flex-col md:flex-row items-center gap-10 md:gap-20 flex mx-auto px-4 mt-28">
          <div className="w-full md:w-1/2">
            <img
              loading="lazy"
              src={ilustr}
              alt=""
              className=" w-full rounded-2xl bg-cover bg-center hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-sm sm:text-lg font-medium leading-relaxed md:leading-loose ">
              <span className="text-[#268CFF]">
                {" "}
                CONECTANDO A EDUCAÇÃO EM TODAS AS ETAPAS
              </span>{" "}
              A nossa plataforma abrange um vasto leque de instituições — desde
              creches, ATLs, colégios, escolas públicas, centros de explicações,
              centros de formação e até universidades. Ao integrar todos esses
              espaços num único sistema, promovemos inclusão, organização e
              praticidade nos pagamentos escolares. Porque investir na educação,
              em todas as fases da vida, é investir num futuro mais promissor.
            </p>
          </div>
        </div>
        <div className="max-w-5xl justify-between text-start flex-col md:flex-row items-center gap-10 md:gap-20 flex mx-auto px-4 mt-28">
          <div className="w-full md:w-1/2 ">
            <p className="text-sm sm:text-lg font-medium leading-relaxed md:leading-loose ">
              <span className="text-[#268CFF]">
                {" "}
                PAGAMENTOS SIMPLIFICADOS, GESTÃO FACILITADA
              </span>{" "}
              Com a nossa plataforma, os pagamentos tornam-se mais rápidos,
              organizados e seguros. Pais, encarregados e instituições ganham
              mais controlo e transparência nas suas transações. Tudo digital,
              tudo ao alcance de um clique.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <img
              loading="lazy"
              src={ilustr2}
              alt=""
              className="h-auto w-full rounded-2xl bg-cover bg-center hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
        <div className="max-w-5xl justify-between text-start flex-col md:flex-row items-center gap-10 md:gap-20 flex mx-auto px-4 mt-28">
          <div className="w-full md:w-1/2">
            <img
              loading="lazy"
              src={ilustr3}
              alt=""
              className=" w-full rounded-2xl bg-cover bg-center hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-sm sm:text-lg font-medium leading-relaxed md:leading-loose ">
              <span className="text-[#268CFF]">
                {" "}
                PAGAMENTOS SIMPLIFICADOS, GESTÃO FACILITADA
              </span>{" "}
              Com a nossa plataforma, os pagamentos tornam-se mais rápidos,
              organizados e seguros. Pais, encarregados e instituições ganham
              mais controlo e transparência nas suas transações. Tudo digital,
              tudo ao alcance de um clique.
            </p>
          </div>
        </div>
        <h1 className="mt-20 flex items-center justify-center font-bold sm:ml-0 text-xl sm:text-3xl  cursor-default py-3">
          TUDO O QUE PRECISA, NUM SÓ LUGAR!
        </h1>
        <div>
          <p className="  items-center flex justify-center gap-3 text-gray-400 leading-relaxed text-xs px-3 sm:px-0 cursor-default sm:text-lg">
            Tudo está acessível, com apenas alguns cliques, facilitamos o
            processo para que pais, estudantes e instituições poupem tempo e
            evitem complicações.
          </p>
        </div>
      </section>
      <Cards></Cards>
      <h1 className="text-black font-bold font-roboto items-center justify-center text-xl sm:text-3xl flex mt-20 ml-6 break-words ">
        Fazer o pagamento Online nunca foi tão incrível como agora
      </h1>
      <p className=" text-xs sm:text-lg font-roboto text-gray-500 text-center mb-16  mt-5 cursor-default">
        Faça o pagamento usando um dos serviços de pagamento da Emis, como o
        Multicaixa Express ou também pode fazer por meio do PayPal e o PayPay.
      </p>
      <div className="mx-auto items-center flex gap-8 justify-center">
        <div className="w-68  mb-20 flex rounded-full">
          <img
            loading="lazy"
            src={appacounts}
            alt=""
            className="bg-cover bg-center "
          />
        </div>
      </div>

      <button className="bg-[#268CFF]  hover:text-white text-base p-2 sm:text-xl  hover:text-lg rounded-xl drop-shadow-lg text-white hover:bg-[#1675e2]  transition-all duration-700 sm:p-3 mx-auto flex mb-20 ">
        Fazer pagamentos
      </button>

      <Footer></Footer>
    </div>
  );
}
