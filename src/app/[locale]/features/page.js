"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState, useRef } from "react";

function RainbowText({ text }) {
  const colors = [
    "rgb(255,127,80)", "rgb(255,218,185)", "rgb(255,0,255)",  "rgb(220,20,60)",
    "rgb(0,255,255)",  "rgb(242,133,0)",   "rgb(106,90,205)", "rgb(0,255,0)",
    "rgb(218,112,214)","rgb(224,17,95)",   "rgb(152,255,152)","rgb(255,120,150)",
    "rgb(238,232,170)","rgb(128,200,255)", "rgb(255,200,100)","rgb(200,100,255)",
  ];
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset(p => (p + 1) % colors.length), 150);
    return () => clearInterval(id);
  }, []);
  return (
    <span>
      {text.split("").map((char, i) => (
        <span key={i} style={{ color: colors[(i + offset) % colors.length], transition: "color 0.15s linear" }}>
          {char}
        </span>
      ))}
    </span>
  );
}

function FadeCard({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

export default function FeaturesPage() {
  const features = [
    {
      title: "Main Menu Rework",
      description: "The UI has been set to fit the color theme of this mod — purple. It removes the normal Among Us logo and adds the custom TOHO logo.",
      image: "/features/feature1.png",
      tag: "UI",
    },
    {
      title: "Chat Themes",
      description: "Set the chat theme to whatever you like! Do you like the color of gold? Great! Golden Yellow and many more are there!",
      image: "/features/feature2.png",
      tag: "Cosmetics",
    },
    {
      title: "Custom Welcome Messages",
      description: (
        <>
          Greet your players with a lovely little welcome message. you can edit them in <code className="tor-code">TOHO-DATA\template.txt</code>.
        </>
      ),
      image: "/features/feature3.png",
      tag: "UI",
    },
    {
      title: "Custom View Panel",
      description: "A secondary panel has been added to the View Panel, which, sadly, only works for the host.",
      image: "/features/feature4.png",
      tag: "Settings",
    },
	{
      title: "Custom Roles & Modifiers",
      description: (
        <>
          This mod adds <span style={{ color: "#d8b4fe", fontWeight: 700 }}>400+ unique roles (Including Modifiers)</span> to spice up the game.
        </>
      ),
      image: "/features/feature5.png",
      tag: ["Roles", "Modifiers"],
    },
    {
      title: "Game Settings",
      description: "Customize settings to your liking! This includes Custom Presets (up to 5) and then Gamemodes as well!",
      image: "/features/feature6.png",
      tag: "Settings",
    },
    {
      title: "Custom Gamemodes",
      description: "Like chaos? Then you're in for a treat because Gamemodes do EXACTLY that.",
      image: "/features/feature7.png",
      tag: "Gamemodes",
    },
    {
      title: "Custom Mod Settings",
      description: "It basically does what it says. But you get to modify the mod with its settings to YOUR own liking.",
      image: "/features/feature8.png",
      tag: "Gameplay",
    },
    {
      title: "Auto Lobby Posting",
      description: (
        <>
          This sends your lobby DIRECTLY to the <a href="https://discord.gg/tohoptimized" target="_blank" rel="noopener noreferrer" className="tor-link">TOHO Discord Server</a> & can be toggled in the <code className="tor-code">SYSTEM SETTINGS</code> tab.
        </>
      ),
      image: "/features/feature9.png",
      tag: "Miscellaneous",
    },
  ];

  const tagColors = {
    UI:        { color: "#7dd3fc", bg: "rgba(14,165,233,0.12)",  border: "rgba(14,165,233,0.3)"  },
    Cosmetics: { color: "#f9a8d4", bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.3)"  },
    Settings:  { color: "#fdba74", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.3)"  },
    Roles:     { color: "#d8b4fe", bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.3)"  },
    Modifiers: { color: "#67e8f9", bg: "rgba(6,182,212,0.12)",   border: "rgba(6,182,212,0.3)"   },
    Gamemodes: { color: "#facc15", bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.3)"   },
    Gameplay:  { color: "#86efac", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)"   },
	Miscellaneous: { color: "#c4b5fd", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        .tor-feat-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }
        .tor-nb1 { position: fixed; width: 600px; height: 600px; background: rgba(120,70,255,0.09); filter: blur(90px); border-radius: 50%; top: -180px; right: -100px; pointer-events: none; z-index: 0; }
        .tor-nb2 { position: fixed; width: 440px; height: 440px; background: rgba(255,70,150,0.06); filter: blur(80px); border-radius: 50%; bottom: 8%; left: -120px; pointer-events: none; z-index: 0; }

        .tor-feat-main {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 0 auto;
          padding: 100px 24px 64px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
		
		.tor-link {
		  color: #a07bff;
		  text-decoration: underline;
		  text-underline-offset: 2px;
		  transition: color 0.2s;
		}
		
		.tor-link:hover {
		  color: #d8b4fe;
		}
		
        .tor-page-title { text-align: center; margin-bottom: 16px; }
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
        }

        .tor-feat-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 32px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          transition: border-color 0.3s;
          overflow: hidden;
        }
        .tor-feat-card:hover { border-color: rgba(160,123,255,0.28); }
        .tor-feat-card.reversed { direction: rtl; }
        .tor-feat-card.reversed > * { direction: ltr; }

        .tor-feat-img-wrap {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.3);
          aspect-ratio: 16/10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tor-feat-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .tor-feat-card:hover .tor-feat-img-wrap img { transform: scale(1.03); }

        .tor-feat-text { display: flex; flex-direction: column; gap: 12px; }
        .tor-feat-tag-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .tor-feat-tag {
          display: inline-flex;
          align-items: center;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid;
          width: fit-content;
        }
        .tor-feat-num {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(240,238,255,0.2);
          letter-spacing: 0.1em;
        }
        .tor-feat-title {
          font-size: clamp(18px, 3vw, 24px);
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #f0eeff;
          line-height: 1.2;
        }
        .tor-feat-desc {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.6);
          line-height: 1.8;
        }
        .tor-code {
          background: rgba(160,123,255,0.12);
          border: 1px solid rgba(160,123,255,0.3);
          border-radius: 4px;
          padding: 2px 6px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #a07bff;
        }

        @media (max-width: 680px) {
          .tor-feat-card,
          .tor-feat-card.reversed {
            grid-template-columns: 1fr;
            direction: ltr;
          }
          .tor-feat-img-wrap { aspect-ratio: 16/9; }
          .tor-feat-main { padding: 88px 14px 48px; gap: 16px; }
        }
      `}</style>

      <div className="tor-feat-page">
        <div className="tor-nb1" /><div className="tor-nb2" />
        <Navbar />

        <main className="tor-feat-main">

          <div className="tor-page-title">
            <div className="tor-page-eyebrow">TOHO</div>
            <h1 className="tor-page-h1">Features</h1>
          </div>

          {features.map((f, i) => {
            const tags = (Array.isArray(f.tag) ? f.tag : [f.tag]).slice(0, 2);
            return (
              <FadeCard key={i} delay={i % 3 * 60}>
                <div className={`tor-feat-card${i % 2 !== 0 ? " reversed" : ""}`}>

                  <div className="tor-feat-img-wrap">
                    <img src={f.image} alt={f.title} />
                  </div>

                  <div className="tor-feat-text">
                    <span className="tor-feat-num">/ {String(i + 1).padStart(2, "0")}</span>
                    <div className="tor-feat-tag-row">
                      {tags.map(t => {
                        const tag = tagColors[t] || tagColors.UI;
                        return (
                          <span
                            key={t}
                            className="tor-feat-tag"
                            style={{ color: tag.color, background: tag.bg, borderColor: tag.border }}
                          >
                            {t}
                          </span>
                        );
                      })}
                    </div>
                    <h2 className="tor-feat-title">{f.title}</h2>
                    <div className="tor-feat-desc">
                      {typeof f.description === "string"
                        ? <p>{f.description}</p>
                        : f.description}
                    </div>
                  </div>

                </div>
              </FadeCard>
            );
          })}

          <Footer />
        </main>
      </div>
    </>
  );
}