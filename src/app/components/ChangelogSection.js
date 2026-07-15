"use client";

import { useEffect, useState } from "react";
import { FaHistory, FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/github-dark.css";

export default function ChangelogSection() {
  const [changelog, setChangelog] = useState("");
  const [version, setVersion] = useState("");
  const [htmlUrl, setHtmlUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChangelog() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/Limeau/TownofHost-Optimized/releases/latest"
        );
        const data = await res.json();
        if (data?.body) setChangelog(data.body);
        if (data?.tag_name) setVersion(data.tag_name);
        if (data?.html_url) setHtmlUrl(data.html_url);
      } catch (err) {
        console.error("Failed to fetch changelog:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchChangelog();
  }, []);

  return (
    <>
      <style>{`
        .tor-changelog {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }
        .tor-changelog-panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          transition: border-color 0.3s;
        }
        .tor-changelog-panel:hover {
          border-color: rgba(160,123,255,0.3);
        }
        .tor-changelog-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .tor-changelog-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(245,158,11,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #f59e0b;
          flex-shrink: 0;
        }
        /* Title + badge stacked in a column — badge never wraps mid-word */
        .tor-changelog-title-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }
        .tor-changelog-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #f0eeff;
          line-height: 1.1;
        }
        .tor-version-badge {
          display: inline-flex;
          align-items: center;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #a07bff;
          background: rgba(160,123,255,0.12);
          border: 1px solid rgba(160,123,255,0.25);
          padding: 3px 10px;
          border-radius: 100px;
          white-space: nowrap;
          width: fit-content;
        }
        .tor-changelog-body {
          background: #0a0d16;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 24px;
          overflow-x: auto;
        }
        .tor-changelog-loading,
        .tor-changelog-empty {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.35);
          text-align: center;
          padding: 32px 0;
          letter-spacing: 0.06em;
        }
        .tor-github-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          padding: 11px 22px;
          border-radius: 10px;
          background: rgba(35,134,54,0.9);
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          border: 1px solid rgba(46,160,67,0.6);
          transition: background 0.2s, transform 0.2s;
          letter-spacing: 0.04em;
        }
        .tor-github-btn:hover {
          background: rgba(46,160,67,1);
          transform: scale(1.03);
        }
        .tor-github-row {
          display: flex;
          justify-content: center;
        }
        .tor-changelog-body .markdown-body {
          background: transparent !important;
          color: rgba(240,238,255,0.85) !important;
          font-family: 'Space Mono', monospace !important;
          font-size: 13px !important;
          line-height: 1.7 !important;
        }
        .tor-changelog-body .markdown-body h1,
        .tor-changelog-body .markdown-body h2,
        .tor-changelog-body .markdown-body h3 {
          color: #f0eeff !important;
          border-bottom-color: rgba(255,255,255,0.08) !important;
          font-family: 'Syne', sans-serif !important;
        }
        .tor-changelog-body .markdown-body code {
          background: rgba(255,255,255,0.07) !important;
          color: #a07bff !important;
          border-radius: 4px !important;
        }
        .tor-changelog-body .markdown-body a {
          color: #a07bff !important;
        }
        .tor-changelog-body .markdown-body blockquote {
          border-left-color: rgba(160,123,255,0.4) !important;
          color: rgba(240,238,255,0.5) !important;
        }
        .tor-changelog-body .markdown-body hr {
          border-color: rgba(255,255,255,0.07) !important;
        }

        @media (max-width: 480px) {
          .tor-changelog-panel { padding: 20px 16px; }
          .tor-changelog-title { font-size: 22px; }
          .tor-changelog-body { padding: 16px 12px; }
        }
      `}</style>

      <section className="tor-changelog">
        <div className="tor-changelog-panel">
          <div className="tor-changelog-header">
            <div className="tor-changelog-icon">
              <FaHistory />
            </div>
            {/* Title and badge stacked vertically — no inline wrapping on mobile */}
            <div className="tor-changelog-title-group">
              <span className="tor-changelog-title">Changelog</span>
              {version && (
                <span className="tor-version-badge">{version}</span>
              )}
            </div>
          </div>

          <div className="tor-changelog-body">
            {loading ? (
              <p className="tor-changelog-loading">Fetching changelog...</p>
            ) : changelog ? (
              <>
                <article
                  className="markdown-body"
                  style={{ colorScheme: "dark", fontWeight: 400 }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {changelog}
                  </ReactMarkdown>
                </article>
                {htmlUrl && (
                  <div className="tor-github-row">
                    <a
                      href={htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tor-github-btn"
                    >
                      <FaGithub style={{ fontSize: 16 }} />
                      View on GitHub
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p className="tor-changelog-empty">No changelog available.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}