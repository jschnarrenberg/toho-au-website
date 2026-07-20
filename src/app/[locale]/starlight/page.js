import Navbar from "../../components/Navbar";
import Link from "next/link";
import Footer from "../../components/Footer";
import { FaRocket, FaMobileAlt, FaDownload, FaInfoCircle, FaStar } from "react-icons/fa";

export const metadata = {
  title: "TOR-W: L | Starlight",
  description: "Quickly install and launch your Among Us mods on mobile."
};

export default function Starlight() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        .tor-sl-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Nebulae — gold tones for Starlight */
        .tor-sl-nb1 {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
          width: 700px; height: 700px;
          background: rgba(255,200,50,0.07);
          filter: blur(100px);
          top: -250px; left: 50%; transform: translateX(-50%);
        }
        .tor-sl-nb2 {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
          width: 500px; height: 500px;
          background: rgba(255,160,30,0.05);
          filter: blur(80px);
          bottom: 5%; right: -150px;
        }
        .tor-sl-nb3 {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
          width: 400px; height: 400px;
          background: rgba(120,70,255,0.06);
          filter: blur(80px);
          top: 40%; left: -120px;
        }

        .tor-sl-main {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
          padding: 100px 24px 64px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* Hero */
        .tor-sl-hero { text-align: center; }
        .tor-sl-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #ffe066;
          border: 1px solid rgba(255,224,102,0.35);
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .tor-sl-h1 {
          font-size: clamp(32px, 6vw, 58px);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.05;
          color: #f0eeff;
          margin-bottom: 16px;
        }
        .tor-sl-h1 span {
          background: linear-gradient(135deg, #ffe066, #ffb020, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .tor-sl-sub {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.45);
          line-height: 1.8;
          max-width: 500px;
          margin: 0 auto 28px;
        }
        .tor-sl-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 24px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: #1a1200;
          background: linear-gradient(135deg, #ffe066, #ffb020);
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .tor-sl-back:hover {
          transform: scale(1.04);
          box-shadow: 0 0 24px rgba(255,176,32,0.4);
        }

        /* Panel */
        .tor-sl-panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px 32px;
          transition: border-color 0.3s;
        }
        .tor-sl-panel:hover { border-color: rgba(255,200,60,0.25); }
        .tor-sl-panel.gold-border { border-color: rgba(255,200,60,0.2); }

        .tor-sl-panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .tor-sl-panel-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }
        .tor-sl-icon-gold  { background: rgba(255,200,60,0.15); color: #ffe066; }
        .tor-sl-icon-pink  { background: rgba(236,72,153,0.15); color: #f9a8d4; }
        .tor-sl-icon-blue  { background: rgba(78,184,255,0.12); color: #4eb8ff; }

        .tor-sl-panel-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #f0eeff;
        }

        /* Feature list */
        .tor-sl-features { display: flex; flex-direction: column; gap: 2px; }
        .tor-sl-feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.75);
          margin-bottom: 8px;
          transition: border-color 0.2s, background 0.2s;
        }
        .tor-sl-feature-item:last-child { margin-bottom: 0; }
        .tor-sl-feature-item:hover {
          border-color: rgba(255,200,60,0.2);
          background: rgba(255,200,60,0.04);
        }
        .tor-sl-feature-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(255,200,60,0.1);
          border: 1px solid rgba(255,200,60,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #ffe066;
          font-size: 14px;
          flex-shrink: 0;
        }

        /* Video */
        .tor-sl-video-label {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.4);
          text-align: center;
          margin-bottom: 16px;
          letter-spacing: 0.06em;
        }
        .tor-sl-video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255,200,60,0.15);
        }
        .tor-sl-video-wrap iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Download button */
        .tor-sl-dl-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 30px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #0d0a00;
          background: linear-gradient(135deg, #ffe066, #ffb020, #ff8c00);
          background-size: 200% 200%;
          animation: torSlGrad 4s ease infinite;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 4px;
        }
        .tor-sl-dl-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 0 32px rgba(255,176,32,0.45);
        }
        @keyframes torSlGrad {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .tor-sl-dl-desc {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.35);
          margin-bottom: 20px;
          text-align: center;
        }

        @media (max-width: 600px) {
          .tor-sl-main { padding: 88px 14px 48px; gap: 28px; }
          .tor-sl-panel { padding: 20px 16px; }
        }
      `}</style>

      <div className="tor-sl-page">
        <div className="tor-sl-nb1" />
        <div className="tor-sl-nb2" />
        <div className="tor-sl-nb3" />

        <Navbar />

        <main className="tor-sl-main">

          {/* Hero */}
          <section className="tor-sl-hero">
            <div className="tor-sl-eyebrow">
              <FaStar style={{ fontSize: 12 }} />
              Mobile Mod Launcher
            </div>
            <h1 className="tor-sl-h1">
              <span>Starlight</span>
            </h1>
            <p className="tor-sl-sub">
              Quickly install and launch your Among Us mods on mobile — with guides, features, and downloads.
            </p>
            <Link href="/" className="tor-sl-back">
              ← Back to Home
            </Link>
          </section>

          {/* Features */}
          <div className="tor-sl-panel gold-border">
            <div className="tor-sl-panel-header">
              <div className="tor-sl-panel-icon tor-sl-icon-gold"><FaStar /></div>
              <h2 className="tor-sl-panel-title">Features</h2>
            </div>
            <div className="tor-sl-features">
              {[
                { icon: <FaMobileAlt />, text: "Mobile-first installation" },
                { icon: <FaRocket />,    text: "Fast mod launching" },
                { icon: <FaInfoCircle />,text: "Step-by-step usage guides" },
                { icon: <FaDownload />,  text: "Download mods directly from Starlight" },
              ].map(({ icon, text }) => (
                <div key={text} className="tor-sl-feature-item">
                  <div className="tor-sl-feature-icon">{icon}</div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* How to Launch */}
          <div className="tor-sl-panel gold-border">
            <div className="tor-sl-panel-header">
              <div className="tor-sl-panel-icon tor-sl-icon-pink"><FaRocket /></div>
              <h2 className="tor-sl-panel-title">How to Launch</h2>
            </div>
            <p className="tor-sl-video-label">Watch the tutorial below for step-by-step instructions</p>
            <div className="tor-sl-video-wrap">
              <iframe
                src="https://www.youtube.com/embed/Sgc549J0R-I"
                title="Starlight Mod Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Download */}
          <div className="tor-sl-panel gold-border" style={{ textAlign: "center" }}>
            <div className="tor-sl-panel-header" style={{ justifyContent: "center" }}>
              <div className="tor-sl-panel-icon tor-sl-icon-blue"><FaDownload /></div>
              <h2 className="tor-sl-panel-title">Download</h2>
            </div>
            <p className="tor-sl-dl-desc">Get the latest version of Starlight for mobile</p>
            <a
              href="https://allofus.dev/starlight.html"
              target="_blank"
              rel="noopener noreferrer"
              className="tor-sl-dl-btn"
            >
              <FaDownload style={{ fontSize: 15 }} />
              Download Latest Version
            </a>
          </div>

          <Footer />
        </main>
      </div>
    </>
  );
}