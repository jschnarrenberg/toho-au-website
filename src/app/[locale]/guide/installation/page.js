"use client";

import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaCog, FaExternalLinkAlt } from "react-icons/fa";

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

const STEPS = [
  {
    title: "BepInEx",
    desc: "Install Unity.Il2Cpp win-x86 BepInEx build",
    body: (
      <>
        Download <span className="tor-install-code">BepInEx-Unity.IL2CPP-win-x86-*.zip</span>{" "}
        from{" "}
        <a href="https://builds.bepinex.dev/projects/bepinex_be" target="_blank" rel="noopener noreferrer" className="tor-install-link">
          builds.bepinex.dev
        </a>{" "}
        and extract every file straight into your Among Us folder — the one with{" "}
        <span className="tor-install-code">Among Us.exe</span> in it. Launch the game once and
        wait; the first start takes noticeably longer while BepInEx unpacks itself. When it's
        done you'll see new <span className="tor-install-code">BepInEx/plugins</span>,{" "}
        <span className="tor-install-code">BepInEx/config</span>, and{" "}
        <span className="tor-install-code">BepInEx/interop</span> folders that weren't there
        before.
      </>
    ),
  },
  {
    title: "TOHO",
    desc: "Drop the downloaded .dll into your BepInEx/plugins folder",
    body: (
      <>
        Download <span className="tor-install-code">TOHO.dll</span> from the{" "}
        <a href="https://github.com/Limeau/TownofHost-Optimized/releases/latest" target="_blank" rel="noopener noreferrer" className="tor-install-link">
          latest release
        </a>{" "}
        and place it in the same <span className="tor-install-code">BepInEx/plugins</span>{" "}
        folder as Reactor. Start the game and TOHO's menu will show up alongside the vanilla UI.
      </>
    ),
  },
];

export default function InstallationGuidePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        .tor-install-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Stars ── */
        .tor-install-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .tor-install-star {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: torInstallTwinkle var(--d, 3s) ease-in-out infinite var(--delay, 0s);
          opacity: var(--op, 0.4);
        }
        @keyframes torInstallTwinkle {
          0%, 100% { opacity: var(--op); }
          50% { opacity: calc(var(--op) * 0.2); }
        }

        /* ── Nebulae ── */
        .tor-install-nebula { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
        .tor-install-nb1 { width: 650px; height: 650px; background: rgba(120,70,255,0.1); filter: blur(90px); top: -220px; right: -120px; }
        .tor-install-nb2 { width: 500px; height: 500px; background: rgba(255,70,150,0.07); filter: blur(80px); bottom: 5%; left: -150px; }
        .tor-install-nb3 { width: 380px; height: 380px; background: rgba(60,180,255,0.06); filter: blur(70px); top: 45%; left: 55%; }

        /* ── Layout ── */
        .tor-install-main {
          position: relative;
          z-index: 1;
          max-width: 780px;
          margin: 0 auto;
          padding: 120px 24px 64px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* ── Hero ── */
        .tor-install-hero { text-align: center; }
        .tor-install-eyebrow {
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
        .tor-install-title {
          font-size: clamp(32px, 6vw, 56px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
        }
        .tor-install-gradient-text {
          background: linear-gradient(135deg, #a07bff 0%, #ff6eb4 50%, #ffe066 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 200%;
          animation: torInstallGrad 6s ease infinite;
        }
        @keyframes torInstallGrad {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .tor-install-sub {
          margin: 0 auto;
          max-width: 460px;
          font-size: 14px;
          color: rgba(240,238,255,0.45);
          line-height: 1.8;
          font-family: 'Space Mono', monospace;
        }

        /* ── Panel (matches homepage) ── */
        .tor-install-panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          transition: border-color 0.3s;
        }
        .tor-install-panel:hover { border-color: rgba(160,123,255,0.3); }

        .tor-install-section-label {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .tor-install-section-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }
        .tor-install-icon-green { background: rgba(79,255,176,0.12); color: #4fffb0; }
        .tor-install-icon-blue  { background: rgba(78,184,255,0.12); color: #4eb8ff; }
        .tor-install-section-label h2 {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #f0eeff;
        }

        /* ── Compat ── */
        .tor-install-compat-list { display: flex; flex-direction: column; gap: 10px; }
        .tor-install-compat-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
        }
        .tor-install-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tor-install-dot-green { background: #4fffb0; box-shadow: 0 0 8px #4fffb0; }
        .tor-install-dot-red   { background: #ff5f5f; box-shadow: 0 0 8px #ff5f5f; }
        .tor-install-compat-text {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.55);
        }
        .tor-install-compat-text strong { color: #f0eeff; font-weight: 700; }

        /* ── Steps ── */
        .tor-install-steps { display: flex; flex-direction: column; }
        .tor-install-step {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .tor-install-step:last-child { border-bottom: none; padding-bottom: 0; }
        .tor-install-step-num {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(160,123,255,0.12);
          border: 1px solid rgba(160,123,255,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #a07bff;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .tor-install-step-title { font-size: 16px; font-weight: 700; color: #f0eeff; margin-bottom: 4px; }
        .tor-install-step-desc {
          font-size: 12px;
          color: rgba(240,238,255,0.45);
          font-family: 'Space Mono', monospace;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .tor-install-step-body {
          font-size: 12.5px;
          color: rgba(240,238,255,0.6);
          font-family: 'Space Mono', monospace;
          line-height: 1.85;
        }
        .tor-install-link {
          color: #a07bff;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }
        .tor-install-link:hover { color: #d8b4fe; }
        .tor-install-code {
          background: rgba(160,123,255,0.12);
          border: 1px solid rgba(160,123,255,0.3);
          border-radius: 4px;
          padding: 2px 6px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #a07bff;
          white-space: nowrap;
        }

        .tor-install-note {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-top: 24px;
          padding: 14px 18px;
          background: rgba(255,224,102,0.06);
          border: 1px solid rgba(255,224,102,0.2);
          border-radius: 12px;
        }
        .tor-install-note-icon { color: #ffe066; font-size: 13px; margin-top: 2px; flex-shrink: 0; }
        .tor-install-note-text {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.6);
          line-height: 1.7;
        }
        .tor-install-note-text strong { color: #ffe066; }

        @media (max-width: 600px) {
          .tor-install-main { padding: 96px 16px 48px; gap: 32px; }
          .tor-install-panel { padding: 24px 18px; }
        }
      `}</style>

      <div className="tor-install-page">
        <div className="tor-install-stars" id="tor-install-stars" />

        <div className="tor-install-nebula tor-install-nb1" />
        <div className="tor-install-nebula tor-install-nb2" />
        <div className="tor-install-nebula tor-install-nb3" />

        <Navbar />

        <main className="tor-install-main">

          <FadeSection delay={0}>
            <section className="tor-install-hero">
              <div className="tor-install-eyebrow">Guide</div>
              <h1 className="tor-install-title">
                Installing <span className="tor-install-gradient-text">TOHO</span>
              </h1>
              <p className="tor-install-sub">
                TOHO is host-only — only whoever's hosting needs it installed. Everyone else
                can join as normal.
              </p>
            </section>
          </FadeSection>

          <FadeSection delay={80}>
            <section className="tor-install-panel">
              <div className="tor-install-section-label">
                <div className="tor-install-section-icon tor-install-icon-green"><FaCheckCircle /></div>
                <h2>Compatibility</h2>
              </div>
              <div className="tor-install-compat-list">
                <div className="tor-install-compat-item">
                  <div className="tor-install-dot tor-install-dot-green" />
                  <span className="tor-install-compat-text">Supports version <strong>2026.6.8 (17.4.0)</strong> on PC</span>
                </div>
                <div className="tor-install-compat-item">
                  <div className="tor-install-dot tor-install-dot-green" />
                  <span className="tor-install-compat-text">Supports the latest version of <strong>Starlight</strong></span>
                </div>
                <div className="tor-install-compat-item">
                  <div className="tor-install-dot tor-install-dot-green" />
                  <span className="tor-install-compat-text">Host-only — <strong>only host requires the mod</strong> — not all players require the mod</span>
                </div>
                <div className="tor-install-compat-item">
                  <div className="tor-install-dot tor-install-dot-red" />
                  <span className="tor-install-compat-text">Only works on <strong>Modded Regions</strong> (e.g. Niko-EU, Modded EU)</span>
                </div>
              </div>
            </section>
          </FadeSection>

          <FadeSection delay={120}>
            <section className="tor-install-panel">
              <div className="tor-install-section-label">
                <div className="tor-install-section-icon tor-install-icon-blue"><FaCog /></div>
                <h2>Installation</h2>
              </div>
              <div className="tor-install-steps">
                {STEPS.map((step, i) => (
                  <div key={step.title} className="tor-install-step">
                    <div className="tor-install-step-num">{i + 1}</div>
                    <div>
                      <div className="tor-install-step-title">{step.title}</div>
                      <div className="tor-install-step-desc">{step.desc}</div>
                      <div className="tor-install-step-body">{step.body}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="tor-install-note">
                <FaExternalLinkAlt className="tor-install-note-icon" />
                <span className="tor-install-note-text">
                  <strong>Note:</strong> BepInEx's first launch dumps and patches the game's
                  assemblies, which is why it takes longer than usual. This only happens once
                  — or again after an Among Us update.
                </span>
              </div>
            </section>
          </FadeSection>

        </main>

        <Footer />
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var el = document.getElementById('tor-install-stars');
              if (!el) return;
              for (var i = 0; i < 130; i++) {
                var s = document.createElement('div');
                s.className = 'tor-install-star';
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