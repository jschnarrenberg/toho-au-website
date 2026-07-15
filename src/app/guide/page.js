"use client";

import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { factions, factionData } from "@/app/data/guide";

function FadeSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function GuidePage() {
  return (
    <>
      <style>{`
        .tor-guide-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Stars ── */
        .tor-guide-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .tor-guide-star {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: torGuideTwinkle var(--d, 3s) ease-in-out infinite var(--delay, 0s);
          opacity: var(--op, 0.4);
        }
        @keyframes torGuideTwinkle {
          0%, 100% { opacity: var(--op); }
          50% { opacity: calc(var(--op) * 0.2); }
        }

        /* ── Nebulae ── */
        .tor-guide-nebula { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
        .tor-guide-nb1 { width: 650px; height: 650px; background: rgba(120,70,255,0.1); filter: blur(90px); top: -220px; right: -120px; }
        .tor-guide-nb2 { width: 500px; height: 500px; background: rgba(255,70,150,0.07); filter: blur(80px); bottom: 5%; left: -150px; }
        .tor-guide-nb3 { width: 380px; height: 380px; background: rgba(60,180,255,0.06); filter: blur(70px); top: 45%; left: 55%; }

        /* ── Layout ── */
        .tor-guide-main {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 0 auto;
          padding: 120px 24px 100px;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        /* ── Hero ── */
        .tor-guide-hero { text-align: center; }
        .tor-guide-eyebrow {
          display: inline-block;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a07bff;
          border: 1px solid rgba(160,123,255,0.3);
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 24px;
        }
        .tor-guide-title {
          font-size: clamp(38px, 7vw, 74px);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -0.025em;
          color: #f0eeff;
          margin: 0 0 18px;
        }
        .tor-guide-gradient-text {
          background: linear-gradient(135deg, #a07bff 0%, #ff6eb4 50%, #ffe066 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 200%;
          animation: torGuideGrad 6s ease infinite;
        }
        @keyframes torGuideGrad {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .tor-guide-subtitle {
          margin: 0 auto;
          max-width: 480px;
          font-size: 14px;
          color: rgba(240,238,255,0.45);
          line-height: 1.8;
          font-family: 'Space Mono', monospace;
        }

        /* ── Faction Grid ── */
        .tor-faction-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        /* ── Faction Card ── */
        .tor-faction-card {
          position: relative;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px 24px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow: hidden;
          transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
        }
        .tor-faction-card:hover {
          border-color: var(--fc);
          transform: translateY(-4px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }
        .tor-faction-card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top left, var(--fc-glow, rgba(160,123,255,0.08)), transparent 65%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .tor-faction-card:hover .tor-faction-card-glow { opacity: 1; }

        .tor-faction-index {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: var(--fc);
          letter-spacing: 0.08em;
          margin: 0;
        }
        .tor-faction-dot {
          display: block;
          width: 10px; height: 10px;
          border-radius: 50%;
          background: var(--fc);
          box-shadow: 0 0 10px var(--fc);
        }
        .tor-faction-name {
          font-size: 1.3rem;
          font-weight: 800;
          color: #f0eeff;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .tor-faction-desc {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: rgba(240,238,255,0.4);
          line-height: 1.75;
          margin: 0;
        }
        .tor-faction-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .tor-faction-count {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: var(--fc);
          letter-spacing: 0.05em;
          opacity: 0.8;
        }
        .tor-faction-arrow {
          font-size: 0.9rem;
          color: var(--fc);
          transform: translateX(-4px);
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
          margin-left: auto;
        }
        .tor-faction-card:hover .tor-faction-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 600px) {
          .tor-guide-main { padding: 96px 16px 64px; gap: 40px; }
        }

        .tor-faction-card-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.tor-faction-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tor-faction-icon-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 0 6px var(--fc));
}

.tor-faction-icon-emoji {
  font-size: 1.3rem;
  line-height: 1;
}
      `}</style>

      <div className="tor-guide-page">
        {/* Stars */}
        <div className="tor-guide-stars" id="tor-guide-stars" />

        {/* Nebulae */}
        <div className="tor-guide-nebula tor-guide-nb1" />
        <div className="tor-guide-nebula tor-guide-nb2" />
        <div className="tor-guide-nebula tor-guide-nb3" />

        <Navbar />

        <main className="tor-guide-main">
          <FadeSection delay={0}>
            <section className="tor-guide-hero">
              <div className="tor-guide-eyebrow">TOR-W : L</div>
              <h1 className="tor-guide-title">
                Role <span className="tor-guide-gradient-text">Guide</span>
              </h1>
              <p className="tor-guide-subtitle">
                Select a faction to browse its roles, abilities, and host settings.
              </p>
            </section>
          </FadeSection>

          <FadeSection delay={80}>
            <div className="tor-faction-grid">
              {factions.map((faction, i) => {
                const roleCount = factionData[faction.slug]?.roles?.length ?? 0;
                const index = String(i + 1).padStart(2, "0");
                return (
                  <Link
                    key={faction.slug}
                    href={`/guide/${faction.slug}`}
                    className="tor-faction-card"
                    style={{
                      "--fc": faction.color,
                      "--fc-glow": faction.glow,
                    }}
                  >
                    <div className="tor-faction-card-glow" />
                    <p className="tor-faction-index">/ {index}</p>

                    <div className="tor-faction-card-header">
                      <div className="tor-faction-icon-wrap">
                        {faction.icon?.startsWith("/") ? (
                          <img
                            src={faction.icon}
                            alt={faction.name}
                            className="tor-faction-icon-img"
                          />
                        ) : (
                          <span className="tor-faction-icon-emoji">{faction.icon}</span>
                        )}
                      </div>
                      <div>
                        <h2 className="tor-faction-name">{faction.name}</h2>
                        <p className="tor-faction-desc">{faction.description}</p>
                      </div>
                    </div>

                    <div className="tor-faction-footer">
                      {roleCount > 0 && (
                        <span className="tor-faction-count">{roleCount} roles</span>
                      )}
                      <span className="tor-faction-arrow">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </FadeSection>
        </main>
        <Footer />
      </div>

      {/* Starfield script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var el = document.getElementById('tor-guide-stars');
              if (!el) return;
              for (var i = 0; i < 130; i++) {
                var s = document.createElement('div');
                s.className = 'tor-guide-star';
                var size = Math.random() * 2 + 0.5;
                s.style.cssText = 'left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;width:'+size+'px;height:'+size+'px;--d:'+(2+Math.random()*4)+'s;--delay:-'+(Math.random()*5)+'s;--op:'+(0.15+Math.random()*0.55)+';';
                el.appendChild(s);
              }
            })();
          `,
        }}
      />
    </>
  );
}