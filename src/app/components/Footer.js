import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <>
      <style>{`
        .tor-footer {
          width: 100%;
          position: relative;
          margin-top: 32px;
          padding: 40px 24px 32px;
          border-top: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }
        .tor-footer-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: linear-gradient(90deg, #a07bff, #ff6eb4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
          display: inline-block;
        }
        .tor-footer-made {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.4);
          margin-bottom: 8px;
          letter-spacing: 0.04em;
        }
        .tor-footer-made .heart {
          color: #ff6eb4;
          margin: 0 2px;
        }
        .tor-footer-made a {
          color: #a07bff;
          text-decoration: none;
        }
        .tor-footer-made a:hover {
          text-decoration: underline;
        }
        .tor-footer-legal {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(240,238,255,0.2);
          max-width: 640px;
          margin: 12px auto 0;
          line-height: 1.7;
          letter-spacing: 0.02em;
        }
        .tor-footer-divider {
          width: 40px;
          height: 1px;
          background: rgba(160,123,255,0.3);
          margin: 16px auto;
        }
        .tor-footer-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 16px;
        }
        .tor-footer-links a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.04em;
          color: rgba(240,238,255,0.55);
          text-decoration: none;
          transition: color 0.2s;
        }
        .tor-footer-links a:hover { color: #a07bff; }
        .tor-footer-ext-icon { font-size: 9px; opacity: 0.6; }
      `}</style>

      <footer className="tor-footer">
        <div className="tor-footer-logo">TOHO</div>
        <div className="tor-footer-divider" />
        <div className="tor-footer-links">
          <a href="https://github.com/Limeau/TownofHost-Optimized" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
            GitHub
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="tor-footer-ext-icon" />
          </a>
          <a href="https://discord.gg/tohoptimized" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faDiscord} />
            Discord
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="tor-footer-ext-icon" />
          </a>
        </div>
        <p className="tor-footer-made">
          © 2024 - 2026 TOHO &nbsp;·&nbsp; Made with{" "}
          <FontAwesomeIcon icon={faHeart} className="heart" />{" "}
          by Andries, for Lime, using{" "}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            Next.js
          </a>
        </p>
        <p className="tor-footer-legal">
          This mod is not affiliated with Among Us or Innersloth LLC, and the
          content contained therein is not endorsed or otherwise sponsored by
          Innersloth LLC. Portions of the materials contained herein are property
          of Innersloth LLC. © Innersloth LLC.
        </p>
      </footer>
    </>
  );
}