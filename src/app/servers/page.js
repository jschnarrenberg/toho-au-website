"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCog, FaWindows, FaMobileAlt, FaDownload, FaExternalLinkAlt, FaShieldAlt } from "react-icons/fa";

export default function ServerInstallation() {
  const moddedServers = [
    { name: "Modded EU",   region: "EU",   href: "window.location.href='amongus://init?servername=Modded_EU&serverport=443&serverip=https%3A%2F%2Fau-eu.duikbo.at&usedtls=false'" },
    { name: "Modded NA",   region: "NA",   href: "window.location.href='amongus://init?servername=Modded_NA&serverport=443&serverip=https%3A%2F%2Faumods.org&usedtls=false'" },
    { name: "Modded Asia", region: "AS", href: "window.location.href='amongus://init?servername=Modded_AS&serverport=443&serverip=https%3A%2F%2Fau-as.duikbo.at&usedtls=false'" },
  ];

  const nikoServers = [
    { name: "NikoCat EU",   region: "EU",   href: "window.location.href='amongus://init?servername=Niko233(EU)&serverport=443&serverip=https%3A%2F%2Fau-eu.niko233.top&usedtls=false'" },
    { name: "NikoCat NA",   region: "NA",   href: "window.location.href='amongus://init?servername=Niko233(NA)&serverport=443&serverip=https%3A%2F%2Fau-us.niko233.top&usedtls=false'" },
    { name: "NikoCat Asia", region: "AS", href: "window.location.href='amongus://init?servername=Niko233(AS)&serverport=443&serverip=https%3A%2F%2Fau-as.niko233.top&usedtls=false'" },
  ];

  const regionColors = {
    EU:   { color: "#7dd3fc", bg: "rgba(14,165,233,0.12)",  border: "rgba(14,165,233,0.3)"  },
    NA:   { color: "#86efac", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)"   },
    AS:   { color: "#fdba74", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.3)"  },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        .tor-srv-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }
        .tor-nb1 { position: fixed; width: 600px; height: 600px; background: rgba(120,70,255,0.09); filter: blur(90px); border-radius: 50%; top: -180px; right: -100px; pointer-events: none; z-index: 0; }
        .tor-nb2 { position: fixed; width: 440px; height: 440px; background: rgba(255,70,150,0.06); filter: blur(80px); border-radius: 50%; bottom: 8%; left: -120px; pointer-events: none; z-index: 0; }

        .tor-srv-main {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
          padding: 100px 24px 64px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* Title */
        .tor-page-title { text-align: center; }
        .tor-page-eyebrow {
          display: inline-block;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a07bff;
          border: 1px solid rgba(160,123,255,0.3);
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 16px;
        }
        .tor-page-h1 {
          font-size: clamp(30px, 6vw, 54px);
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #a07bff, #ff6eb4, #ffe066);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 14px;
        }
        .tor-page-sub {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.45);
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto;
        }

        /* Panel */
        .tor-panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px 32px;
          transition: border-color 0.3s;
        }
        .tor-panel:hover { border-color: rgba(160,123,255,0.25); }

        .tor-panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .tor-panel-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }
        .tor-icon-blue   { background: rgba(78,184,255,0.12); color: #4eb8ff; }
        .tor-icon-purple { background: rgba(160,123,255,0.15); color: #a07bff; }
        .tor-panel-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #f0eeff;
        }

        /* Install steps */
        .tor-steps { display: flex; flex-direction: column; }
        .tor-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.65);
          line-height: 1.6;
        }
        .tor-step:last-child { border-bottom: none; }
        .tor-step-num {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: rgba(160,123,255,0.12);
          border: 1px solid rgba(160,123,255,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #a07bff;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Windows download button */
        .tor-dl-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          padding: 13px 26px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #fff;
          background: linear-gradient(135deg, #7c4dff, #e040fb, #ff6e40);
          background-size: 200% 200%;
          animation: torGrad 4s ease infinite;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .tor-dl-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 0 28px rgba(160,123,255,0.4);
        }
        @keyframes torGrad {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .tor-dl-note {
          margin-top: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(240,238,255,0.25);
          letter-spacing: 0.04em;
        }

        /* Divider */
        .tor-srv-divider {
          display: flex; align-items: center; gap: 14px; margin: 8px 0 20px;
        }
        .tor-srv-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .tor-srv-divider-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,238,255,0.3);
          white-space: nowrap;
        }

        /* Server group */
        .tor-srv-group { margin-bottom: 28px; }
        .tor-srv-group:last-child { margin-bottom: 0; }
        .tor-srv-group-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .tor-srv-group-title {
          font-size: 15px;
          font-weight: 700;
          color: #f0eeff;
        }
        .tor-srv-group-sub {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(240,238,255,0.35);
          margin-top: 2px;
        }

        /* Server buttons */
        .tor-srv-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tor-srv-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid;
          background: transparent;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
        }
        .tor-srv-btn:hover {
          transform: translateY(-2px);
        }
        .tor-srv-region {
          font-size: 9px;
          letter-spacing: 0.12em;
          padding: 2px 6px;
          border-radius: 100px;
          border: 1px solid;
          opacity: 0.85;
        }

        @media (max-width: 600px) {
          .tor-srv-main { padding: 88px 14px 48px; }
          .tor-panel { padding: 20px 16px; }
          .tor-panel-title { font-size: 18px; }
        }
      `}</style>

      <div className="tor-srv-page">
        <div className="tor-nb1" /><div className="tor-nb2" />
        <Navbar />

        <main className="tor-srv-main">

          {/* Title */}
          <div className="tor-page-title">
            <div className="tor-page-eyebrow">TOR-W : L</div>
            <h1 className="tor-page-h1">Server Installation</h1>
            <p className="tor-page-sub">
              TOR-W: L cannot be played on official Innersloth servers. Use one of the modded servers below to play.
            </p>
          </div>

          {/* Windows */}
          <div className="tor-panel">
            <div className="tor-panel-header">
              <div className="tor-panel-icon tor-icon-blue"><FaWindows /></div>
              <h2 className="tor-panel-title">Windows Installation</h2>
            </div>
            <div className="tor-steps">
              <div className="tor-step">
                <span className="tor-step-num">1</span>
                <span>Download the <strong style={{ color: "#f0eeff" }}>.bat</strong> file below.</span>
              </div>
              <div className="tor-step">
                <span className="tor-step-num">2</span>
                <span>Run the <strong style={{ color: "#f0eeff" }}>.bat</strong> file to automatically install all modded servers.</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <a href="https://au.niko233.top/Setup_Custom_Server.bat" download className="tor-dl-btn">
                <FaDownload style={{ fontSize: 14 }} />
                Download .bat Installer
              </a>
              <p className="tor-dl-note">Provided for convenience. Use at your own discretion.</p>
            </div>
          </div>

          {/* Mobile */}
          <div className="tor-panel">
            <div className="tor-panel-header">
              <div className="tor-panel-icon tor-icon-purple"><FaMobileAlt /></div>
              <h2 className="tor-panel-title">Mobile Installation</h2>
            </div>

            <div className="tor-steps" style={{ marginBottom: 28 }}>
              <div className="tor-step">
                <span className="tor-step-num">1</span>
                <span>Open Among Us on your device.</span>
              </div>
              <div className="tor-step">
                <span className="tor-step-num">2</span>
                <span>Tap a server link below — it will open directly in the game.</span>
              </div>
            </div>

            {/* Modded Servers */}
            <div className="tor-srv-group">
              <div className="tor-srv-divider">
                <div className="tor-srv-divider-line" />
                <span className="tor-srv-divider-label">Modded Servers</span>
                <div className="tor-srv-divider-line" />
              </div>
              <div className="tor-srv-grid">
                {moddedServers.map(server => {
                  const s = regionColors[server.region];
                  return (
                    <a
                      key={server.name}
                      href={server.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tor-srv-btn"
                      style={{ color: s.color, borderColor: s.border, background: s.bg }}
                    >
                      <FaExternalLinkAlt style={{ fontSize: 10, opacity: 0.7 }} />
                      {server.name}
                      <span
                        className="tor-srv-region"
                        style={{ color: s.color, borderColor: s.border, background: `rgba(0,0,0,0.2)` }}
                      >
                        {server.region}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* NikoCat Servers */}
            <div className="tor-srv-group">
              <div className="tor-srv-divider">
                <div className="tor-srv-divider-line" />
                <span className="tor-srv-divider-label">NikoCat233 Servers</span>
                <div className="tor-srv-divider-line" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <FaShieldAlt style={{ fontSize: 13, color: "#4fffb0" }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(79,255,176,0.8)" }}>
                  Includes built-in Anti-Cheat for host-only mods
                </span>
              </div>
              <div className="tor-srv-grid">
                {nikoServers.map(server => {
                  const s = regionColors[server.region];
                  return (
                    <a
                      key={server.name}
                      href={server.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tor-srv-btn"
                      style={{ color: s.color, borderColor: s.border, background: s.bg }}
                    >
                      <FaExternalLinkAlt style={{ fontSize: 10, opacity: 0.7 }} />
                      {server.name}
                      <span
                        className="tor-srv-region"
                        style={{ color: s.color, borderColor: s.border, background: `rgba(0,0,0,0.2)` }}
                      >
                        {server.region}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          <Footer />
        </main>
      </div>
    </>
  );
}