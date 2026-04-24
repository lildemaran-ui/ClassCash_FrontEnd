// src/Pages/Index/ConteudoIndex.tsx
// Design: Luxo refinado com toques angolanos — azul profundo, dourado, branco
// Tipografia: Playfair Display (display) + DM Sans (corpo)
// Animações: CSS puro com staggered reveals

import { BarChart, LockIcon, Smartphone, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import FrasesRotativas from "../../../Hooks/FrasesRotativas";
import ilustr from "../../../assets/Corpo1PI.jpeg";
import ilustr2 from "../../../assets/Corpo2PI.jpeg";
import ilustr3 from "../../../assets/Corpo3PI.jpeg";
import fundo from "../../../assets/imgFundoPI.jpeg";
import AppsIlustr from "../AppsIlustr";
import Cards from "../Cards";
import Objetivo from "../Objetivos";

export default function     ConteudoIndex() {
  return (
    <>

      <div className="font-poppins">

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="relative w-full min-h-screen flex items-center overflow-hidden">
          {/* Imagem de fundo */}
          <img loading="lazy" src={fundo} alt=""
            className="absolute inset-0 w-full h-full object-cover z-0" />

          {/* Overlay gradiente */}
          <div className="absolute inset-0 z-10"
            style={{ background: "linear-gradient(135deg, rgba(10,37,64,0.92) 0%, rgba(10,37,64,0.75) 50%, rgba(38,140,255,0.4) 100%)" }} />

          {/* Padrão decorativo */}
          <div className="absolute inset-0 z-10 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          {/* Conteúdo */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-32">
            <div className="max-w-3xl">
              <div className="badge mb-6 mx-auto"
              style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", color: "white", borderColor: "rgba(255,255,255,0.15)" }}>
                 <span className="w-2 h-2 rounded-full bg-[#268cff] animate-pulse inline-block" />
              Plataforma de Gestão Escolar Angolana
            </div>

              <h1 className="font-display reveal delay-1 text-white mb-6"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.1}}>
                Pagamentos <br />
                <span style={{ color: "var(--dourado)" }}>
                  <FrasesRotativas />
                </span>
              </h1>

              <p className="reveal delay-2 text-white/75 mb-10 max-w-xl"
                style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.8 }}>
                Sua escola no controlo, seus pagamentos sob gestão.
                A plataforma mais eficiente, económica e intuitiva de Angola.
              </p>

              <div className="reveal delay-3 flex flex-wrap gap-4 mb-16">
                <Link to="/Cadastro">
                  <button className="btn-primary">
                    Começar Agora
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </Link>
                <Link to="/FAQ's">
                  <button className="btn-outline">Saiba Mais</button>
                </Link>
              </div>

              {/* Stats */}
              <div className="reveal delay-4 grid grid-cols-3 gap-4 max-w-lg">
                {[
                  { num: "500+", label: "Estudantes" },
                  { num: "20+",  label: "Instituições" },
                  { num: "99%",  label: "Satisfação" },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <p className="font-display text-white font-bold"
                      style={{ fontSize: "1.75rem", fontFamily: "'Playfair Display', serif" }}>{s.num}</p>
                    <p className="text-white/60 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-white/20 relative overflow-hidden">
              <div className="w-full h-1/2 bg-white/60 animate-bounce absolute top-0" />
            </div>
          </div>
        </section>

      

        {/* ══════════════════════════════════════════
            OBJECTIVOS / DIFERENCIAIS
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6 sm:px-10" style={{ background: "var(--cinza)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="badge mb-4 mx-auto" style={{ display: "inline-flex" }}>O que nos diferencia</div>
              <h2 className="font-display text-gray-900 mb-4"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontFamily: "'Playfair Display', serif" }}>
                Experiência Intuitiva na ClassCash.
                <br /><span style={{ color: "var(--azul)" }}>Fácil para todos!</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto" style={{ lineHeight: 1.8 }}>
                Plataforma eficiente, económica, experiente e sem complicações.
              </p>
            </div>
            <Objetivo />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            COMO FUNCIONA — 3 PASSOS
        ══════════════════════════════════════════ */}
        <section className="section-dark py-24 px-6 sm:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="badge mb-4 mx-auto" style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", color: "white", borderColor: "rgba(255,255,255,0.15)" }}>
                Simples assim
              </div>
              <h2 className="font-display text-white"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontFamily: "'Playfair Display', serif" }}>
                Em 3 passos, <span style={{ color: "var(--dourado)" }}>está pronto</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { n: "01", title: "Registe-se", desc: "Crie a sua conta em minutos. Escolha o seu perfil — estudante, encarregado ou secretaria — e associe-se à sua instituição." },
                { n: "02", title: "Aguarde Aprovação", desc: "A secretaria da sua instituição valida o cadastro e atribui-lhe um código único de identificação na plataforma." },
                { n: "03", title: "Pague com Facilidade", desc: "E fectue os seus pagamentos online com Multicaixa Express, PayPay ou Unitel Money. Rápido, seguro e sem filas." },
              ].map(step => (
                <div key={step.n} className="relative p-8 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="step-number">{step.n}</span>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 font-bold text-white text-sm"
                      style={{ background: "var(--azul)" }}>{step.n}</div>
                    <h3 className="font-display text-white text-xl mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}>{step.title}</h3>
                    <p className="text-white/60 leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BLOCO 1 — Conectando a Educação
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6 sm:px-10 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 img-frame">
              <img loading="lazy" src={ilustr} alt="" className="w-full rounded-3xl object-cover" style={{ maxHeight: "480px" }} />
              
             
            </div>
            <div className="w-full md:w-1/2">
              <div className="badge mb-4">Abrangência Nacional</div>
              <h2 className="font-display text-gray-900 mb-6 gold-line"
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontFamily: "'Playfair Display', serif" }}>
                Conectando a Educação em Todas as Etapas
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                A nossa plataforma abrange um vasto leque de instituições — desde
                <strong className="text-gray-800"> creches, ATLs, colégios, escolas</strong>, centros de explicações,
                centros de formação e até universidades.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Ao integrar todos esses espaços num único sistema, promovemos
                <strong className="text-gray-800"> inclusão, organização e praticidade</strong> nos pagamentos escolares.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BLOCO 2 — Pagamentos Simplificados
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6 sm:px-10" style={{ background: "var(--cinza)" }}>
          <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="badge mb-4">Digitalização Total</div>
              <h2 className="font-display text-gray-900 mb-6 gold-line"
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontFamily: "'Playfair Display', serif" }}>
                Pagamentos Simplificados, Gestão Facilitada
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Com a ClassCash, os pagamentos tornam-se mais rápidos, organizados e seguros.
                Pais, encarregados e instituições ganham mais
                <strong className="text-gray-800"> controlo e transparência</strong> nas suas transações.
                Tudo digital, tudo ao alcance de um clique.
              </p>
              {/* Mini features */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <LockIcon className="text-[#268cff]"/>, text: "Pagamentos seguros" },
                  { icon: <Zap className="text-[#268cff]"/>, text: "Processamento rápido" },
                  { icon: <BarChart className="text-[#268cff]"/>, text: "Relatórios detalhados" },
                  { icon: <Smartphone className="text-[#268cff]"/>, text: "Acesso em qualquer lugar" },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-300">
                    <span className="text-xl">{f.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 img-frame">
              <img loading="lazy" src={ilustr2} alt="" className="w-full rounded-3xl object-cover" style={{ maxHeight: "480px" }} />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BLOCO 3 — Segurança
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6 sm:px-10 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 img-frame">
              <img loading="lazy" src={ilustr3} alt="" className="w-full rounded-3xl object-cover" style={{ maxHeight: "480px" }} />
             
            </div>
            <div className="w-full md:w-1/2">
              <div className="badge mb-4">Confiança Total</div>
              <h2 className="font-display text-gray-900 mb-6 gold-line"
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontFamily: "'Playfair Display', serif" }}>
                Segurança e Confiança em Cada Transação
              </h2>
              <p className="text-gray-600 leading-relaxed">
                A sua segurança é a nossa prioridade. Todas as transações na ClassCash
                são protegidas com encriptação de ponta, garantindo que os seus dados
                e pagamentos estejam sempre <strong className="text-gray-800">seguros e protegidos</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CARDS
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6 sm:px-10" style={{ background: "var(--cinza)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="badge mb-4 mx-auto" style={{ display: "inline-flex" }}>Tudo num só lugar</div>
              <h2 className="font-display text-gray-900"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontFamily: "'Playfair Display', serif" }}>
                TUDO O QUE PRECISA, <span style={{ color: "var(--azul)" }}>NUM SÓ LUGAR!</span>
              </h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                Tudo acessível com apenas alguns cliques. Facilitamos o processo para que
                pais, estudantes e instituições poupem tempo e evitem complicações.
              </p>
            </div>
            <Cards />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TESTEMUNHOS
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6 sm:px-10 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="badge mb-4 mx-auto" style={{ display: "inline-flex" }}>O que dizem sobre nós</div>
              <h2 className="font-display text-gray-900"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontFamily: "'Playfair Display', serif" }}>
                Vozes que <span style={{ color: "var(--azul)" }}>nos inspiram</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { nome: "Ana Paula Mendes", cargo: "Encarregada de Educação", texto: "Finalmente consigo pagar a propina do meu filho sem sair de casa. A ClassCash mudou completamente a nossa rotina." },
                { nome: "Dr. Carlos Baptista", cargo: "Director do Colégio Kibangas", texto: "A gestão financeira da nossa instituição ficou muito mais organizada. Recomendo a todas as escolas de Angola." },
                { nome: "Mariana Costa", cargo: "Estudante universitária", texto: "Prático, rápido e seguro. Pago as propinas directamente pelo telemóvel em menos de 2 minutos." },
              ].map(t => (
                <div key={t.nome} className="testimonial">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f0a500">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.texto}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: "var(--azul)" }}>
                      {t.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.nome}</p>
                      <p className="text-gray-400 text-xs">{t.cargo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PAGAMENTO ONLINE — Apps
        ══════════════════════════════════════════ */}
        <section className="section-dark py-24 px-6 sm:px-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="badge mb-6 mx-auto"
              style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", color: "white", borderColor: "rgba(255,255,255,0.15)" }}>
              Métodos de Pagamento
            </div>
            <h2 className="font-display text-white mb-4"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontFamily: "'Playfair Display', serif" }}>
              Fazer pagamentos Online nunca foi
              <br /><span style={{ color: "var(--dourado)" }}>tão incrível como agora</span>
            </h2>
            <p className="text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Pague usando Multicaixa Express, Unitel Money, PayPay ou directamente no banco.
              Escolha o método que mais lhe convém.
            </p>
            <div className="mb-12">
              <AppsIlustr />
            </div>
            <Link to="/Pagamentos">
              <button className="btn-primary" style={{ fontSize: "1.05rem", padding: "16px 40px" }}>
                Fazer um Pagamento
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6 sm:px-10 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-3xl p-12 sm:p-16 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--azul-escuro) 0%, #1a4080 100%)" }}>
              {/* Decoração */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                style={{ background: "var(--dourado)", filter: "blur(60px)", transform: "translate(30%, -30%)" }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
                style={{ background: "var(--azul)", filter: "blur(40px)", transform: "translate(-30%, 30%)" }} />

              <div className="relative z-10">
                <h2 className="font-display text-white mb-4"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontFamily: "'Playfair Display', serif" }}>
                  Pronto para transformar
                  <br />a sua gestão escolar?
                </h2>
                <p className="text-white/70 mb-8 max-w-lg mx-auto leading-relaxed">
                  Junte-se a centenas de estudantes e instituições que já confiam na ClassCash
                  para os seus pagamentos escolares.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/Cadastro">
                    <button style={{
                      background: "var(--dourado)", color: "var(--azul-escuro)",
                      padding: "14px 36px", borderRadius: "12px",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                      fontSize: "1rem", transition: "all 0.3s ease",
                      boxShadow: "0 8px 24px rgba(240,165,0,0.35)"
                    }}
                      onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                      onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}>
                      Criar Conta Gratuitamente
                    </button>
                  </Link>
                  <Link to="/Instituições">
                    <button className="btn-outline">Ver Instituições</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
