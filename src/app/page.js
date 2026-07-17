"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import { FaPalette, FaVoteYea, FaPuzzlePiece, FaCog, FaGamepad, FaCheckCircle, FaDownload } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import Footer from "./components/Footer";
import ChangelogSection from "./components/ChangelogSection";

function DownloadButton() {
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    async function fetchLatest() {
      const res = await fetch("https://api.github.com/repos/Limeau/TownofHost-Optimized/releases/latest/TOHO.dll");
      const data = await res.json();
      if (data.assets?.length > 0) {
        setDownloadUrl(data.assets[0].browser_download_url);
      }
    }
    fetchLatest();
  }, []);

  return (
    <a
      href={downloadUrl || "#"}
      download
      className={`tor-btn-primary${!downloadUrl ? " tor-btn-disabled" : ""}`}
    >
      <FaDownload style={{ fontSize: 16 }} />
      {downloadUrl ? "Download Now" : "Fetching release…"}
    </a>
  );
}

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

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        .tor-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Stars ── */
        .tor-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .tor-star {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: torTwinkle var(--d, 3s) ease-in-out infinite var(--delay, 0s);
          opacity: var(--op, 0.4);
        }
        @keyframes torTwinkle {
          0%, 100% { opacity: var(--op); }
          50% { opacity: calc(var(--op) * 0.2); }
        }

        /* ── Nebulae ── */
        .tor-nebula { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
        .tor-nb1 { width: 650px; height: 650px; background: rgba(120,70,255,0.1); filter: blur(90px); top: -220px; right: -120px; }
        .tor-nb2 { width: 500px; height: 500px; background: rgba(255,70,150,0.07); filter: blur(80px); bottom: 5%; left: -150px; }
        .tor-nb3 { width: 380px; height: 380px; background: rgba(60,180,255,0.06); filter: blur(70px); top: 45%; left: 55%; }

        /* ── Layout ── */
        .tor-main {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 120px 24px 64px;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        /* ── Hero ── */
        .tor-hero { text-align: center; }
        .tor-eyebrow {
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
        .tor-h1 {
          font-size: clamp(38px, 7vw, 74px);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -0.025em;
        }
        .tor-gradient-text {
          background: linear-gradient(135deg, #a07bff 0%, #ff6eb4 50%, #ffe066 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 200%;
          animation: torGrad 6s ease infinite;
        }
        @keyframes torGrad {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .tor-sub {
          margin: 20px auto 0;
          max-width: 500px;
          font-size: 17px;
          color: rgba(240,238,255,0.45);
          line-height: 1.65;
          font-weight: 400;
          font-family: 'Space Mono', monospace;
        }
        .tor-cta-row {
          margin-top: 40px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        /* ── Buttons ── */
        .tor-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 30px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg, #7c4dff, #e040fb, #ff6e40);
          background-size: 200% 200%;
          animation: torGrad 4s ease infinite;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .tor-btn-primary:hover {
          transform: scale(1.04);
          box-shadow: 0 0 32px rgba(160,123,255,0.4);
        }
        .tor-btn-primary.tor-btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
        .tor-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #f0eeff;
          text-decoration: none;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(160,123,255,0.3);
          transition: background 0.2s, transform 0.2s;
        }
        .tor-btn-secondary:hover {
          background: rgba(160,123,255,0.1);
          transform: scale(1.02);
        }
        .tor-btn-starlight {
          color: #ffe066;
          border-color: rgba(255,224,102,0.35);
        }
        .tor-btn-starlight:hover { background: rgba(255,224,102,0.08); }

        /* ── Panel ── */
        .tor-panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          transition: border-color 0.3s;
        }
        .tor-panel:hover { border-color: rgba(160,123,255,0.3); }

        /* ── Section label ── */
        .tor-section-label {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .tor-section-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }
        .tor-icon-purple { background: rgba(130,80,255,0.18); color: #a07bff; }
        .tor-icon-green  { background: rgba(79,255,176,0.12); color: #4fffb0; }
        .tor-icon-blue   { background: rgba(78,184,255,0.12); color: #4eb8ff; }
        .tor-section-label h2 {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #f0eeff;
        }

        /* ── Feature Grid ── */
        .tor-feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 14px;
        }
        .tor-feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .tor-feature-card:hover {
          border-color: rgba(160,123,255,0.25);
          transform: translateY(-2px);
        }
        .tor-feat-icon { font-size: 20px; margin-bottom: 10px; display: block; color: #a07bff; }
        .tor-feat-title { font-size: 14px; font-weight: 700; color: #f0eeff; margin-bottom: 4px; }
        .tor-feat-desc {
          font-size: 12px;
          color: rgba(240,238,255,0.45);
          font-family: 'Space Mono', monospace;
          line-height: 1.5;
        }

        /* ── Compat ── */
        .tor-compat-list { display: flex; flex-direction: column; gap: 10px; }
        .tor-compat-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
        }
        .tor-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tor-dot-green  { background: #4fffb0; box-shadow: 0 0 8px #4fffb0; }
        .tor-dot-yellow { background: #ffe066; box-shadow: 0 0 8px #ffe066; }
        .tor-dot-red    { background: #ff5f5f; box-shadow: 0 0 8px #ff5f5f; }
        .tor-compat-text {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.55);
        }
        .tor-compat-text strong { color: #f0eeff; font-weight: 700; }

        /* ── Steps ── */
        .tor-steps { display: flex; flex-direction: column; }
        .tor-step {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .tor-step:last-child { border-bottom: none; }
        .tor-step-num {
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
        .tor-step-title { font-size: 15px; font-weight: 700; color: #f0eeff; margin-bottom: 3px; }
        .tor-step-desc {
          font-size: 12px;
          color: rgba(240,238,255,0.45);
          font-family: 'Space Mono', monospace;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .tor-main { padding: 96px 16px 48px; gap: 40px; }
          .tor-panel { padding: 24px 18px; }
          .tor-h1 { font-size: 38px; }
        }
      `}</style>

      <div className="tor-page">
        {/* Stars */}
        <div className="tor-stars" id="tor-stars" />

        {/* Nebulae */}
        <div className="tor-nebula tor-nb1" />
        <div className="tor-nebula tor-nb2" />
        <div className="tor-nebula tor-nb3" />

        <Navbar />

        <main className="tor-main">

          {/* Hero */}
          <FadeSection delay={0}>
            <section className="tor-hero">
              <div className="tor-eyebrow">Among Us Mod</div>
              <h1 className="tor-h1">
                The <span className="tor-gradient-text">Optmized</span><br />
                Experience
              </h1>
              <p className="tor-sub">
                A place for roles, features, and updates — optimized for both mobile and desktop.
              </p>
              <div className="tor-cta-row">
                <DownloadButton />
                <Link href="/guide" className="tor-btn-secondary">Guide →</Link>
                <Link href="/starlight" className="tor-btn-secondary tor-btn-starlight">✦ Starlight</Link>
              </div>
            </section>
          </FadeSection>

          {/* Features */}
          <FadeSection delay={80}>
            <section className="tor-panel">
              <div className="tor-section-label">
                <div className="tor-section-icon tor-icon-purple"><FaPuzzlePiece /></div>
                <h2>Features</h2>
              </div>
              <div className="tor-feature-grid">
                {[
                  { icon: <FaPalette />, title: "Colored UI",    desc: "Vibrant colors and visual enhancements throughout" },
                  { icon: <FaPuzzlePiece />, title: "Custom Roles", desc: "Feature-rich roles with unique abilities" },
                  { icon: <FaCog />,     title: "Game Options",   desc: "New settings and configuration tools" },
                  { icon: <FaGamepad />, title: "Gamemodes",      desc: "Entirely new ways to play" },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="tor-feature-card">
                    <span className="tor-feat-icon">{icon}</span>
                    <div className="tor-feat-title">{title}</div>
                    <div className="tor-feat-desc">{desc}</div>
                  </div>
                ))}
              </div>
            </section>
          </FadeSection>

          {/* Compatibility */}
          <FadeSection delay={100}>
            <section className="tor-panel">
              <div className="tor-section-label">
                <div className="tor-section-icon tor-icon-green"><FaCheckCircle /></div>
                <h2>Compatibility</h2>
              </div>
              <div className="tor-compat-list">
                <div className="tor-compat-item">
                  <div className="tor-dot tor-dot-green" />
                  <span className="tor-compat-text">Supports version <strong>2026.6.8 (17.4.0)</strong> on PC</span>
                </div>
                <div className="tor-compat-item">
                  <div className="tor-dot tor-dot-green" />
                  <span className="tor-compat-text">Supports the latest verion of <strong>Starlight</strong></span>
                </div>
                <div className="tor-compat-item">
                  <div className="tor-dot tor-dot-green" />
                  <span className="tor-compat-text">Host-only — <strong>only host requires the mod</strong> — not all players requires the mod</span>
                </div>
                <div className="tor-compat-item">
                  <div className="tor-dot tor-dot-red" />
                  <span className="tor-compat-text">Only works on <strong>Modded Regions (e.g. Niko-EU, Modded EU)</strong></span>
                </div>
              </div>
            </section>
          </FadeSection>

          {/* Installation */}
          <FadeSection delay={120}>
            <section className="tor-panel">
              <div className="tor-section-label">
                <div className="tor-section-icon tor-icon-blue"><FaCog /></div>
                <h2>Installation</h2>
              </div>
              <div className="tor-steps">
                {[
                  { title: "BepInEx",   desc: "Install Unity.Il2Cpp win-x86 BepInEx build" },
                  { title: "Reactor",   desc: "Install Reactor plugin for Among Us modding" },
                  { title: "TOHO",  desc: "Drop the downloaded .dll into your BepInEx/plugins folder" },
                ].map(({ title, desc }, i) => (
                  <div key={title} className="tor-step">
                    <div className="tor-step-num">{i + 1}</div>
                    <div>
                      <div className="tor-step-title">{title}</div>
                      <div className="tor-step-desc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </FadeSection>

          {/* Changelog */}
          <FadeSection delay={140}>
            <ChangelogSection />
          </FadeSection>

        </main>

        <Footer />
      </div>

      {/* Starfield script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var el = document.getElementById('tor-stars');
              if (!el) return;
              for (var i = 0; i < 130; i++) {
                var s = document.createElement('div');
                s.className = 'tor-star';
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
