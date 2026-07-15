"use client";

import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function FadeSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

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

export default function FactionClient({ faction }) {
  return (
    <>
      <style>{`
        .tor-fp-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Stars ── */
        .tor-fp-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .tor-fp-star {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: torFpTwinkle var(--d, 3s) ease-in-out infinite var(--delay, 0s);
          opacity: var(--op, 0.4);
        }
        @keyframes torFpTwinkle {
          0%, 100% { opacity: var(--op); }
          50% { opacity: calc(var(--op) * 0.2); }
        }

        /* ── Nebulae ── */
        .tor-fp-nebula { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
        .tor-fp-nb1 { width: 650px; height: 650px; background: rgba(120,70,255,0.1); filter: blur(90px); top: -220px; right: -120px; }
        .tor-fp-nb2 { width: 500px; height: 500px; background: rgba(255,70,150,0.07); filter: blur(80px); bottom: 5%; left: -150px; }
        .tor-fp-nb3 { width: 380px; height: 380px; background: rgba(60,180,255,0.06); filter: blur(70px); top: 45%; left: 55%; }

        /* ── Layout ── */
        .tor-fp-main {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
          padding: 80px 24px 120px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* ── Breadcrumb ── */
        .tor-fp-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: #8891aa;
        }
        .tor-fp-breadcrumb a {
          color: #8891aa;
          text-decoration: none;
          transition: color 0.15s;
        }
        .tor-fp-breadcrumb a:hover { color: #f0eeff; }

        /* ── Header ── */
        .tor-fp-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .tor-fp-faction-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tor-fp-faction-icon-img {
          width: 32px;
          height: 32px;
          object-fit: contain;
          filter: drop-shadow(0 0 6px var(--fc));
        }
        .tor-fp-faction-icon-emoji {
          font-size: 1.5rem;
          line-height: 1;
        }
        .tor-fp-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
          line-height: 1.04;
        }
        .tor-fp-count {
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          color: #8891aa;
          margin-left: 4px;
        }

        /* ── Role List ── */
        .tor-fp-role-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tor-fp-role-row {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px 20px;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .tor-fp-role-row:hover {
          border-color: var(--fc);
          background: var(--fc-glow);
          transform: translateX(4px);
        }

        /* ── Role Icon ── */
        .tor-fp-role-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }
        .tor-fp-role-row:hover .tor-fp-role-icon-wrap {
          border-color: var(--fc);
        }
        .tor-fp-role-icon-img {
          width: 26px;
          height: 26px;
          object-fit: contain;
          filter: drop-shadow(0 0 4px var(--fc));
        }
        .tor-fp-role-icon-fallback {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--fc);
          box-shadow: 0 0 8px var(--fc);
        }

        .tor-fp-role-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .tor-fp-role-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: #f0eeff;
        }
        .tor-fp-role-alignment {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: var(--fc);
          letter-spacing: 0.05em;
        }
        .tor-fp-role-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }
        .tor-fp-role-settings {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: #8891aa;
        }
        .tor-fp-role-chevron {
          font-size: 1.4rem;
          color: var(--fc);
          line-height: 1;
          transform: translateX(-4px);
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
        }
        .tor-fp-role-row:hover .tor-fp-role-chevron {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 600px) {
          .tor-fp-main { padding: 72px 16px 80px; gap: 32px; }
          .tor-fp-role-settings { display: none; }
        }
      `}</style>

      <div className="tor-fp-page" style={{ "--fc": faction.color }}>
        <div className="tor-fp-stars" id="tor-fp-stars" />
        <div className="tor-fp-nebula tor-fp-nb1" />
        <div className="tor-fp-nebula tor-fp-nb2" />
        <div className="tor-fp-nebula tor-fp-nb3" />

        <Navbar />

        <main className="tor-fp-main">
          <FadeSection delay={0}>
            <nav className="tor-fp-breadcrumb">
              <Link href="/guide">Guide</Link>
              <span>/</span>
              <span style={{ color: faction.color }}>{faction.name}</span>
            </nav>
          </FadeSection>

          <FadeSection delay={40}>
            <div className="tor-fp-header">
              {/* Faction icon */}
              <div className="tor-fp-faction-icon-wrap">
                {faction.icon?.startsWith("/") ? (
                  <img
                    src={faction.icon}
                    alt={faction.name}
                    className="tor-fp-faction-icon-img"
                  />
                ) : (
                  <span className="tor-fp-faction-icon-emoji">{faction.icon}</span>
                )}
              </div>
              <div>
                <h1 className="tor-fp-title" style={{ color: faction.color }}>
                  {faction.name}
                </h1>
                <p className="tor-fp-count">
                  {faction.roles.length} role{faction.roles.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={80}>
            <div className="tor-fp-role-list">
              {faction.roles.map((role) => {
                // Build icon path from faction name + role name
                // e.g. /icons/Crewmate/Coroner.png
                const factionFolder = faction.name; // "Crewmate", "Impostor" etc.
                const roleName = role.name.replace(/\s+/g, ""); // remove spaces
                const iconPath = `/icons/${factionFolder}/${roleName}.png`;

                return (
                  <Link
                    key={role.slug}
                    href={`/guide/${faction.slug}/${role.slug}`}
                    className="tor-fp-role-row"
                    style={{
                      "--fc": faction.color,
                      "--fc-glow": `${faction.color}18`,
                    }}
                  >
                    {/* Role icon */}
                    <div className="tor-fp-role-icon-wrap">
                      {role.icon ? (
                        <img
                          src={role.icon}
                          alt={role.name}
                          className="tor-fp-role-icon-img"
                          onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                        />
                      ) : (
                        <img
                          src={iconPath}
                          alt={role.name}
                          className="tor-fp-role-icon-img"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = '<div class="tor-fp-role-icon-fallback"></div>';
                          }}
                        />
                      )}
                    </div>

                    <div className="tor-fp-role-info">
                      <span className="tor-fp-role-name">{role.name}</span>
                      <span className="tor-fp-role-alignment">{role.alignment}</span>
                    </div>
                    <div className="tor-fp-role-meta">
                      {Array.isArray(role.settings) && role.settings.length > 0 && (
                        <span className="tor-fp-role-settings">
                          {role.settings.length} settings
                        </span>
                      )}
                      <span className="tor-fp-role-chevron">›</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </FadeSection>
        </main>
        <Footer />
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var el = document.getElementById('tor-fp-stars');
              if (!el || el.dataset.init) return;
              el.dataset.init = '1';
              for (var i = 0; i < 130; i++) {
                var s = document.createElement('div');
                s.className = 'tor-fp-star';
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