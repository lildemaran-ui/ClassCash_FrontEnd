import React from "react";
import Footer from "../../components/Footer/footer";
import MenuEstatico from "../../components/Menu/MenuEstatico";
import img1 from "../../assets/about_img.png";

const InfoCard = ({
  title,
  content,
  list,
}: {
  title: string;
  content?: string;
  list?: string[];
}) => (
  <div className="group border border-[#268cff] hover:border-none hover:bg-gradient-to-b from-[#054781e4] to-[#107bd8] p-6 rounded-2xl text-center flex flex-col items-center h-full hover:shadow-xl hover:text-white transition-all duration-500">
    <h3 className="text-xl sm:text-2xl font-semibold group-hover:text-white text-[#268cff] mb-6">
      {title}
    </h3>
    {content && (
      <p className="text-sm sm:text-base leading-relaxed opacity-90">{content}</p>
    )}
    {list && (
      <ul className="text-sm sm:text-base space-y-3 text-left w-full px-4">
        {list.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0"></span>
            {item}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default function SobreNos() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      <MenuEstatico />

      {/* Banner */}
      <div className="pt-6 mt-20 sm:mt-28 lg:mt-32 px-4 sm:px-6 lg:px-0">
        <div className="overflow-hidden flex shadow-sm max-w-7xl ml-auto">
          <div className="w-4 bg-[#00f2ff] shrink-0"></div>
          <div className="flex-1 bg-gradient-to-r from-[#1a5fb4] to-[#268cff] py-8 sm:py-12 text-center text-white">
            <h1 className="text-xl sm:text-2xl font-semibold">SOBRE NÓS</h1>
            <p className="text-[10px] opacity-80 uppercase tracking-widest mt-1">
              Conheça a nossa história
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full py-10 sm:py-16 px-4 sm:px-6">

        {/* Introdução */}
        <section className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center mb-16 sm:mb-24">
          <div className="flex-1 w-full">
            <img
              loading="lazy"
              src={img1}
              alt="Equipe ClassCash"
              className="rounded-lg w-full h-56 sm:h-72 md:h-80 object-cover"
            />
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-[#268cff] font-bold text-xl sm:text-2xl underline decoration-2 underline-offset-8 mb-4 sm:mb-6">
              ClassCash
            </h1>
            <p className="text-blue-900 font-bold text-lg sm:text-2xl">
              Somos uma plataforma do futuro!
            </p>
            <p className="text-gray-600 text-sm sm:text-base text-justify leading-relaxed">
              Criada em 2025, a ClassCash surgiu como um pilar estratégico para
              a formação académica dos angolanos, a missão de promover
              facilidade, transparência, segurança e desenvolvimento contínuo da
              tecnologia no setor da educação.
            </p>
            <p className="text-gray-600 text-sm sm:text-base text-justify leading-relaxed">
              A ClassCash oferece uma experiência única através da sua
              plataforma eficiente, exclusiva e inovadora para realização de
              pagamentos escolares, e outros serviços. Com uma oferta vasta e
              especializada, visa ser o ponto de partida para o futuro dos
              jovens, através da melhoria nos sistemas bancários das
              instituições, e fluidez.
            </p>
            <p className="text-gray-600 text-sm sm:text-base text-justify leading-relaxed">
              Aqui, a conexão vai além dos pagamentos, transformando-se numa
              poderosa ferramenta para construir pontes duradouras e explorar
              novas instituições aos arredores da sua localidade.
            </p>
          </div>
        </section>

        {/* Cards Missão/Visão/Valores/Posicionamento */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 sm:mb-24">
          <InfoCard
            title="Missão"
            content="Contribuir para o desenvolvimento académico, fomentando
            a evolução dos métodos e sistemas de pagamento,
            numa transferência contínua do saber."
          />
          <InfoCard
            title="Visão"
            content="Ser uma plataforma de gestão académica líder e de referência 
            nacional pelo rigor académico, excelência nos pagamentos, 
            proporcionando aos usuários e membros uma maior 
            capacidade de resolverem as questões financeiras escolares."
          />
          <InfoCard
            title="Valores"
            list={[
              "Excelência",
              "Rigor académico e técnico",
              "Profissionalismo",
              "Responsabilidade social",
              "Inovação",
            ]}
          />
          <InfoCard
            title="Posicionamento"
            content="A ClassCash é uma plataforma de excelência que presta um 
            serviço de educação de qualidade adaptado às novas
            realidades e tendências que serve simultaneamente as 
            expetativas holísticas das instituições, estudantes, 
            encarregados de educação, com impacto direto na comunidade."
          />
        </section>
      </main>

      {/* Banner de Estatísticas */}
      <section className="bg-gradient-to-r from-[#1a5fb4] to-[#268cff] overflow-hidden flex shadow-sm mx-4 sm:mx-6 lg:mx-0 lg:max-w-7xl mb-16 sm:mb-28 rounded-xl lg:rounded-none">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 py-10 sm:py-12 px-6 text-white">
          <div className="text-center">
            <p className="text-sm sm:text-lg opacity-90 mb-2">Alunos cadastrados</p>
            <p className="text-xl sm:text-2xl font-bold">+100</p>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-lg opacity-90 mb-2">Instituições registradas</p>
            <p className="text-xl sm:text-2xl font-bold">+50</p>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-lg opacity-90 mb-2">Pagamentos efetuados</p>
            <p className="text-xl sm:text-2xl font-bold">+20</p>
          </div>
        </div>
        <div className="w-4 bg-cyan-400 shrink-0"></div>
      </section>

      <Footer />
    </div>
  );
}