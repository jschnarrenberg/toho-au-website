"use client";

import Footer from "../../../../components/Footer";
import Navbar from "../../../../components/Navbar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { parseMarkup } from "@/app/[locale]/lib/textMarkup";

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

function SettingRow({ setting }) {
  return (
    <div className="tor-rc-setting-row">
      <div className="tor-rc-setting-info">
        <span className="tor-rc-setting-label">{parseMarkup(setting.label)}</span>
        {setting.key && <span className="tor-rc-setting-key">{setting.key}</span>}
      </div>
      <div className="tor-rc-setting-value">
        {setting.type === "toggle" && (
          <span className={`tor-rc-badge ${setting.default ? "tor-rc-badge-on" : "tor-rc-badge-off"}`}>
            {setting.default ? "TRUE" : "FALSE"}
          </span>
        )}
        {setting.type === "number" && (
          <span className="tor-rc-setting-number">
            Default: <strong>{setting.default}{setting.suffix ?? ""}</strong>
            {setting.min !== undefined && (
              <span className="tor-rc-setting-range"> ({setting.min}–{setting.max}{setting.suffix ?? ""})</span>
            )}
          </span>
        )}
        {setting.type === "select" && Array.isArray(setting.options) && (
          <span className="tor-rc-setting-select">
            Default: <strong>{setting.default}</strong>
            <span className="tor-rc-setting-options"> [{setting.options.join(", ")}]</span>
          </span>
        )}
      </div>
    </div>
  );
}

// Tip bubble variants — pass type: "tip" | "warning" | "info" | "lore"
function TipBubble({ type = "tip", children }) {
  const config = {
    tip: {
      icon: "✦",
      label: "TIP",
      className: "tor-rc-tip-tip",
    },
    warning: {
      icon: "⚠",
      label: "WARNING",
      className: "tor-rc-tip-warning",
    },
    info: {
      icon: "◈",
      label: "NOTE",
      className: "tor-rc-tip-info",
    },
    lore: {
      icon: "❋",
      label: "LORE",
      className: "tor-rc-tip-lore",
    },
  };
  const c = config[type] ?? config.tip;
  return (
    <div className={`tor-rc-tip-bubble ${c.className}`}>
      <div className="tor-rc-tip-icon">{c.icon}</div>
      <div className="tor-rc-tip-body">
        <span className="tor-rc-tip-label">{c.label}</span>
        <span className="tor-rc-tip-text">{children}</span>
      </div>
    </div>
  );
}

export default function RoleClient({ faction, role }) {
  // Icons live in public/icons/RoleIcons, named after the mod's internal role id
  const iconPath = role.icon ?? `/icons/RoleIcons/${role.id}.png`;

  return (
    <>
      <style>{`
        .tor-rc-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Stars ── */
        .tor-rc-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .tor-rc-star {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: torRcTwinkle var(--d, 3s) ease-in-out infinite var(--delay, 0s);
          opacity: var(--op, 0.4);
        }
        @keyframes torRcTwinkle {
          0%, 100% { opacity: var(--op); }
          50% { opacity: calc(var(--op) * 0.2); }
        }

        /* ── Nebulae ── */
        .tor-rc-nebula { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
        .tor-rc-nb1 { width: 650px; height: 650px; background: rgba(120,70,255,0.1); filter: blur(90px); top: -220px; right: -120px; }
        .tor-rc-nb2 { width: 500px; height: 500px; background: rgba(255,70,150,0.07); filter: blur(80px); bottom: 5%; left: -150px; }
        .tor-rc-nb3 { width: 380px; height: 380px; background: rgba(60,180,255,0.06); filter: blur(70px); top: 45%; left: 55%; }

        /* ── Layout ── */
        .tor-rc-main {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 0 auto;
          padding: 80px 24px 120px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* ── Breadcrumb ── */
        .tor-rc-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: #8891aa;
        }
        .tor-rc-breadcrumb a {
          color: #8891aa;
          text-decoration: none;
          transition: color 0.15s;
        }
        .tor-rc-breadcrumb a:hover { color: #f0eeff; }

        /* ── Role Header ── */
        .tor-rc-role-header {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* ── Role Icon ── */
        .tor-rc-role-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 24px var(--fc-dim), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .tor-rc-role-icon-img {
          width: 48px;
          height: 48px;
          object-fit: contain;
          filter: drop-shadow(0 0 8px var(--fc));
        }
        .tor-rc-role-icon-fallback {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--fc);
          box-shadow: 0 0 12px var(--fc);
        }

        .tor-rc-role-header-text { display: flex; flex-direction: column; gap: 6px; }
        .tor-rc-alignment {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--fc);
          margin: 0;
        }
        .tor-rc-title {
          font-size: clamp(2.2rem, 6vw, 3.5rem);
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
          line-height: 1.04;
          color: var(--fc);
        }

        /* ── Description ── */
        .tor-rc-description {
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
          color: #8891aa;
          line-height: 1.8;
          margin: 0;
          padding: 20px 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 2px solid var(--fc);
          border-radius: 0 12px 12px 0;
        }

        /* ── Sections ── */
        .tor-rc-section { display: flex; flex-direction: column; gap: 14px; }
        .tor-rc-section-title {
          font-size: 0.7rem;
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8891aa;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tor-rc-section-count {
          background: rgba(255,255,255,0.07);
          color: #f0eeff;
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 999px;
        }

        /* ── Abilities ── */
        .tor-rc-ability-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tor-rc-ability-item {
          font-family: 'Space Mono', monospace;
          font-size: 0.82rem;
          color: #c8d0e8;
          padding: 14px 18px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: flex-start;
          gap: 10px;
          transition: border-color 0.2s, background 0.2s;
        }
        .tor-rc-ability-text {
          line-height: 1.7;
        }
        .tor-rc-ability-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: var(--fc-dim);
        }
        .tor-rc-ability-item::before {
          content: "◆";
          font-size: 0.5rem;
          color: var(--fc);
          flex-shrink: 0;
          margin-top: 0.45em;
        }

        /* ── Settings ── */
        .tor-rc-settings-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .tor-rc-setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(255,255,255,0.025);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
          gap: 16px;
        }
        .tor-rc-setting-row:hover { background: rgba(255,255,255,0.045); }
        .tor-rc-setting-info { display: flex; flex-direction: column; gap: 3px; }
        .tor-rc-setting-label { font-size: 0.95rem; font-weight: 600; color: #f0eeff; }
        .tor-rc-setting-key {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: #8891aa;
          letter-spacing: 0.03em;
        }
        .tor-rc-setting-value {
          flex-shrink: 0;
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          color: #8891aa;
          text-align: right;
        }
        .tor-rc-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          font-weight: 700;
        }
        .tor-rc-badge-on  { background: rgba(79,195,127,0.15); color: #4fc37f; border: 1px solid rgba(79,195,127,0.3); }
        .tor-rc-badge-off { background: rgba(239,83,80,0.12);  color: #ef5350; border: 1px solid rgba(239,83,80,0.25); }
        .tor-rc-setting-number strong,
        .tor-rc-setting-select strong { color: #f0eeff; }
        .tor-rc-setting-range,
        .tor-rc-setting-options { color: #555e78; font-size: 0.68rem; }

        /* ── Tip Bubbles ── */
        .tor-rc-tip-bubble {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid;
          position: relative;
          overflow: hidden;
        }
        .tor-rc-tip-bubble::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--tip-glow);
          pointer-events: none;
        }

        /* tip */
        .tor-rc-tip-tip {
          --tip-color: #a07bff;
          --tip-glow: radial-gradient(ellipse at top left, rgba(160,123,255,0.08), transparent 70%);
          background: rgba(160,123,255,0.06);
          border-color: rgba(160,123,255,0.25);
        }
        /* warning */
        .tor-rc-tip-warning {
          --tip-color: #ffb347;
          --tip-glow: radial-gradient(ellipse at top left, rgba(255,179,71,0.08), transparent 70%);
          background: rgba(255,179,71,0.06);
          border-color: rgba(255,179,71,0.25);
        }
        /* info / note */
        .tor-rc-tip-info {
          --tip-color: #4fc3f7;
          --tip-glow: radial-gradient(ellipse at top left, rgba(79,195,247,0.08), transparent 70%);
          background: rgba(79,195,247,0.06);
          border-color: rgba(79,195,247,0.2);
        }
        /* lore */
        .tor-rc-tip-lore {
          --tip-color: #ce93d8;
          --tip-glow: radial-gradient(ellipse at top left, rgba(206,147,216,0.08), transparent 70%);
          background: rgba(206,147,216,0.06);
          border-color: rgba(206,147,216,0.22);
        }

        .tor-rc-tip-icon {
          font-size: 1rem;
          color: var(--tip-color);
          flex-shrink: 0;
          margin-top: 1px;
          filter: drop-shadow(0 0 6px var(--tip-color));
        }
        .tor-rc-tip-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .tor-rc-tip-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          font-weight: 700;
          color: var(--tip-color);
        }
        .tor-rc-tip-text {
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          color: rgba(240,238,255,0.7);
          line-height: 1.7;
        }

        /* ── Tips section list ── */
        .tor-rc-tips-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (max-width: 600px) {
          .tor-rc-main { padding: 72px 16px 80px; gap: 32px; }
          .tor-rc-role-icon-wrap { width: 56px; height: 56px; border-radius: 14px; }
          .tor-rc-role-icon-img { width: 36px; height: 36px; }
        }
      `}</style>

      <div className="tor-rc-page" style={{ "--fc": faction.color, "--fc-dim": `${faction.color}44` }}>
        <div className="tor-rc-stars" id="tor-rc-stars" />
        <div className="tor-rc-nebula tor-rc-nb1" />
        <div className="tor-rc-nebula tor-rc-nb2" />
        <div className="tor-rc-nebula tor-rc-nb3" />

        <Navbar />

        <main className="tor-rc-main">
          <FadeSection delay={0}>
            <nav className="tor-rc-breadcrumb">
              <Link href="/guide">Guide</Link>
              <span>/</span>
              <Link href={`/guide/${faction.slug}`} style={{ color: faction.color }}>
                {faction.name}
              </Link>
              <span>/</span>
              <span style={{ color: "#f0eeff" }}>{role.name}</span>
            </nav>
          </FadeSection>

          <FadeSection delay={40}>
            <div className="tor-rc-role-header">
              {/* Role icon */}
              <div className="tor-rc-role-icon-wrap">
                <img
                  src={iconPath}
                  alt={role.name}
                  className="tor-rc-role-icon-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = '<div class="tor-rc-role-icon-fallback"></div>';
                  }}
                />
              </div>
              <div className="tor-rc-role-header-text">
                <p className="tor-rc-alignment">{role.alignment}</p>
                <h1 className="tor-rc-title">{role.name}</h1>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={80}>
            <p className="tor-rc-description">{parseMarkup(role.description)}</p>
          </FadeSection>

          <FadeSection delay={100}>
            <section className="tor-rc-section">
              <h2 className="tor-rc-section-title">How It Works</h2>
              <ul className="tor-rc-ability-list">
                <li className="tor-rc-ability-item">
                  <span className="tor-rc-ability-text">{parseMarkup(role.extra || role.description)}</span>
                </li>
              </ul>
            </section>
          </FadeSection>

          {/* Tips section — populate role.tips in your data as an array of { type, text } */}
          {role.tips && role.tips.length > 0 && (
            <FadeSection delay={110}>
              <section className="tor-rc-section">
                <h2 className="tor-rc-section-title">
                  Tips
                  <span className="tor-rc-section-count">{role.tips.length}</span>
                </h2>
                <div className="tor-rc-tips-list">
                  {role.tips.map((tip, i) => (
                    <TipBubble key={i} type={tip.type ?? "tip"}>
                      {tip.text}
                    </TipBubble>
                  ))}
                </div>
              </section>
            </FadeSection>
          )}

          {Array.isArray(role.settings) && role.settings.length > 0 && (
            <FadeSection delay={120}>
              <section className="tor-rc-section">
                <h2 className="tor-rc-section-title">
                  Settings
                  <span className="tor-rc-section-count">{role.settings.length}</span>
                </h2>
                <div className="tor-rc-settings-list">
                  {role.settings.map((setting) => (
                    <SettingRow key={setting.key} setting={setting} />
                  ))}
                </div>
              </section>
            </FadeSection>
          )}
        </main>
        <Footer />
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var el = document.getElementById('tor-rc-stars');
              if (!el || el.dataset.init) return;
              el.dataset.init = '1';
              for (var i = 0; i < 130; i++) {
                var s = document.createElement('div');
                s.className = 'tor-rc-star';
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