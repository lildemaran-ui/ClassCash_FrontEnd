import { useState, useEffect, useRef } from "react";
import Card1 from "../../assets/Card1PI.jpeg";
import Card2 from "../../assets/Card2PI.jpeg";
import Card3 from "../../assets/Card3PI.jpeg";

const cards = [
  { src: Card1, alt: "App Screenshot 1", label: "Gerencie suas contas" },
  { src: Card2, alt: "App Screenshot 2", label: "Controle seus gastos" },
  { src: Card3, alt: "App Screenshot 3", label: "Visualize relatórios" },
];

export default function AppsIlustr() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number, dir: "left" | "right") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  const prev = () => {
    const index = (current - 1 + cards.length) % cards.length;
    goTo(index, "left");
  };

  const next = () => {
    const index = (current + 1) % cards.length;
    goTo(index, "right");
  };

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setDirection("right");
        setAnimating(true);
        setTimeout(() => {
          setCurrent((prev) => (prev + 1) % cards.length);
          setAnimating(false);
        }, 400);
      }, 3500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, current]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

        .carousel-root {
          font-family: 'Syne', sans-serif;
        }

        /* Floating glow orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          animation: orb-drift 8s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%);
          top: -80px; left: -60px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%);
          bottom: -60px; right: -40px;
          animation-delay: -3s;
        }
        .orb-3 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%);
          top: 40%; left: 50%;
          transform: translateX(-50%);
          animation-delay: -5s;
        }
        @keyframes orb-drift {
          0%   { transform: translateY(0) scale(1); }
          100% { transform: translateY(30px) scale(1.1); }
        }

        /* Main slide */
        .slide-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
        }
        .slide-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: block;
        }
        .slide-wrap:hover .slide-img {
          transform: scale(1.04);
        }

        /* Slide enter animation */
        .slide-enter-right { animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .slide-enter-left  { animation: slideInLeft  0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .slide-exit-right  { animation: slideOutLeft  0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .slide-exit-left   { animation: slideOutRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }

        @keyframes slideInRight  { from { opacity:0; transform: translateX(60px) scale(0.97); } to { opacity:1; transform: translateX(0) scale(1); } }
        @keyframes slideInLeft   { from { opacity:0; transform: translateX(-60px) scale(0.97); } to { opacity:1; transform: translateX(0) scale(1); } }
        @keyframes slideOutLeft  { from { opacity:1; transform: translateX(0); } to { opacity:0; transform: translateX(-60px); } }
        @keyframes slideOutRight { from { opacity:1; transform: translateX(0); } to { opacity:0; transform: translateX(60px); } }

        /* Thumbnail strip */
        .thumb {
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid transparent;
          opacity: 0.55;
          transform: scale(0.92);
        }
        .thumb.active {
          border-color: #818cf8;
          opacity: 1;
          transform: scale(1);
          box-shadow: 0 0 18px rgba(129,140,248,0.5);
        }
        .thumb:hover:not(.active) {
          opacity: 0.85;
          transform: scale(0.97);
        }

        /* Nav buttons */
        .nav-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          border-radius: 50%;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          color: white;
        }
        .nav-btn:hover {
          background: rgba(129,140,248,0.35);
          border-color: rgba(129,140,248,0.6);
          transform: scale(1.1);
          box-shadow: 0 0 16px rgba(129,140,248,0.4);
        }
        .nav-btn:active { transform: scale(0.95); }

        /* Dot indicators */
        .dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dot.active {
          width: 28px;
          border-radius: 4px;
          background: #818cf8;
          box-shadow: 0 0 10px rgba(129,140,248,0.6);
        }
        .dot:hover:not(.active) {
          background: rgba(255,255,255,0.6);
          transform: scale(1.2);
        }

        /* Label badge */
        .label-badge {
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.9);
          animation: fadeUp 0.4s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(10px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* Progress bar */
        .progress-bar {
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #818cf8, #ec4899);
          border-radius: 2px;
          animation: progress 3.5s linear infinite;
        }
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .progress-fill.paused { animation-play-state: paused; }

        /* Counter */
        .counter {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.45);
        }

        /* Entrance animation for whole section */
        .section-enter {
          animation: sectionIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes sectionIn {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Shimmer on active card */
        .shimmer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
          background-size: 200% 200%;
          animation: shimmer 4s ease infinite;
          pointer-events: none;
          border-radius: 20px;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
      `}
      </style>

      <section
        className="carousel-root section-enter relative px-4 sm:px-6 lg:px-10 mt-10 mb-10"
        style={{ maxWidth: 900, margin: "40px auto" }}
      >
        {/* Background glow orbs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Main carousel */}
          <div
            className="slide-wrap"
            style={{ width: "100%", height: "clamp(220px, 45vw, 420px)", boxShadow: "0 30px 80px rgba(0,0,0,0.4)" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              key={current}
              src={cards[current].src}
              alt={cards[current].alt}
              className={`slide-img ${animating ? (direction === "right" ? "slide-exit-right" : "slide-exit-left") : (direction === "right" ? "slide-enter-right" : "slide-enter-left")}`}
            />

            {/* Shimmer overlay */}
            <div className="shimmer-overlay" />

            {/* Gradient bottom overlay */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
              background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
              pointerEvents: "none"
            }} />

            {/* Label badge */}
            <div style={{ position: "absolute", bottom: 20, left: 20 }}>
              <span key={current} className="label-badge">{cards[current].label}</span>
            </div>

            {/* Counter */}
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <span className="counter">{String(current + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}</span>
            </div>

            {/* Nav buttons */}
            <button className="nav-btn" onClick={prev} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="nav-btn" onClick={next} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" style={{ marginTop: 12 }}>
            <div key={current} className={`progress-fill ${isHovered ? "paused" : ""}`} />
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16 }}>
            {cards.map((_, i) => (
              <div
                key={i}
                className={`dot ${i === current ? "active" : ""}`}
                onClick={() => goTo(i, i > current ? "right" : "left")}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "center" }}>
            {cards.map((card, i) => (
              <div
                key={i}
                className={`thumb ${i === current ? "active" : ""}`}
                style={{ width: "clamp(70px, 20%, 130px)", height: "clamp(44px, 7vw, 80px)" }}
                onClick={() => goTo(i, i > current ? "right" : "left")}
              >
                <img src={card.src} alt={card.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}