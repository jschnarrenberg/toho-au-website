"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaNewspaper } from "react-icons/fa";
import NewsModal from "./NewsModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openNews, setOpenNews] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let intervalId;
    async function checkNews() {
      try {
        const res = await fetch("/news/news.json");
        let data = await res.json();
        data.sort((a, b) => b.id - a.id);
        const seen = JSON.parse(localStorage.getItem("seenNews") || "[]");
        setHasUnread(data.some((item) => !seen.includes(item.id)));
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }
    }
    checkNews();
    intervalId = setInterval(checkNews, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/roles", label: "Roles" },
    { href: "/options", label: "Options" },
    { href: "/templates", label: "Live Template Editor" },
    { href: "/servers", label: "Servers" },
    { href: "/features", label: "Features" },
    { href: "/guide", label: "Guide" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Space+Mono&display=swap');

        .tor-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 100;
          transition: background 0.3s, border-color 0.3s;
        }
        .tor-nav.scrolled {
          background: rgba(8, 11, 20, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .tor-nav:not(.scrolled) {
          background: transparent;
          border-bottom: 1px solid transparent;
        }

        /* Inner row — full width, padded on both sides */
        .tor-nav-inner {
          width: 100%;
          box-sizing: border-box;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tor-logo {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: linear-gradient(90deg, #a07bff, #ff6eb4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
          flex-shrink: 0;
        }

        /* Desktop links */
        .tor-nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .tor-nav-links a,
        .tor-nav-btn {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(240,238,255,0.55);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          border: none;
          background: none;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .tor-nav-links a:hover,
        .tor-nav-btn:hover {
          color: #f0eeff;
          background: rgba(255,255,255,0.05);
        }
        .tor-nav-links a.starlight { color: #ffe066; }
        .tor-nav-links a.starlight:hover { background: rgba(255,224,102,0.08); }

        .tor-news-btn { position: relative; }
        .tor-unread-dot {
          position: absolute;
          top: 4px;
          right: 6px;
          width: 7px;
          height: 7px;
          background: #ff5f5f;
          border-radius: 50%;
          box-shadow: 0 0 6px #ff5f5f;
          pointer-events: none;
        }

        /* Mobile controls — hidden on desktop */
        .tor-mobile-controls {
          display: none;
          align-items: center;
          gap: 8px;
        }
        .tor-mobile-news-btn {
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          color: rgba(240,238,255,0.6);
          font-size: 16px;
          cursor: pointer;
        }
        .tor-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 38px;
          height: 38px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          cursor: pointer;
        }
        .tor-hamburger span {
          display: block;
          width: 18px;
          height: 1.5px;
          background: white;
          transition: all 0.3s;
          transform-origin: center;
        }
        .tor-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .tor-hamburger.open span:nth-child(2) { opacity: 0; }
        .tor-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile dropdown — full width, flush edges */
        .tor-mobile-menu {
          width: 100%;
          box-sizing: border-box;
          background: rgba(13,17,32,0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.4s ease;
        }
        .tor-mobile-menu.open {
          max-height: 420px;
        }
        .tor-mobile-menu-inner {
          padding: 8px 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .tor-mobile-menu a {
          display: block;
          padding: 12px 16px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(240,238,255,0.65);
          text-decoration: none;
          border-radius: 10px;
          transition: background 0.2s, color 0.2s;
        }
        .tor-mobile-menu a:hover { background: rgba(255,255,255,0.05); color: #f0eeff; }
        .tor-mobile-menu a.starlight { color: #ffe066; }
        .tor-mobile-menu a.starlight:hover { background: rgba(255,224,102,0.08); }

        @media (max-width: 768px) {
          .tor-nav-links { display: none; }
          .tor-mobile-controls { display: flex; }
          .tor-nav-inner { padding: 0 16px; }
        }
      `}</style>

      <nav className={`tor-nav${scrolled ? " scrolled" : ""}`}>
        <div className="tor-nav-inner">
          <Link href="/" className="tor-logo">TOR-W : L</Link>

          {/* Desktop — hidden on mobile */}
          <div className="tor-nav-links">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <Link href="/starlight" className="starlight">✦ Starlight</Link>
            <button className="tor-nav-btn tor-news-btn" onClick={() => setOpenNews(true)}>
              <FaNewspaper />
              News
              {hasUnread && <span className="tor-unread-dot" />}
            </button>
          </div>

          {/* Mobile — hidden on desktop */}
          <div className="tor-mobile-controls">
            <button className="tor-mobile-news-btn" onClick={() => setOpenNews(true)}>
              <FaNewspaper />
              {hasUnread && <span className="tor-unread-dot" />}
            </button>
            <button
              className={`tor-hamburger${open ? " open" : ""}`}
              onClick={() => setOpen(!open)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile dropdown — full width, no floating */}
        <div className={`tor-mobile-menu${open ? " open" : ""}`}>
          <div className="tor-mobile-menu-inner">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
            ))}
            <Link href="/starlight" className="starlight" onClick={() => setOpen(false)}>✦ Starlight</Link>
          </div>
        </div>
      </nav>

      {openNews && <NewsModal onClose={() => setOpenNews(false)} />}
    </>
  );
}