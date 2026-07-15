"use client";

import { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa6";
import { MdCancel, MdNewReleases } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function NewsModal({ onClose }) {
  const [news, setNews] = useState(null);
  const [selected, setSelected] = useState(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    let intervalId;

    async function load() {
      try {
        const res = await fetch("/news/news.json");
        let data = await res.json();
        data.sort((a, b) => b.id - a.id);
        const seen = JSON.parse(localStorage.getItem("seenNews") || "[]");
        setNews(data.map(n => ({ ...n, seen: seen.includes(n.id) })));
      } catch (err) {
        console.error("Failed to load news:", err);
      }
    }

    load();
    intervalId = setInterval(load, 10000);
    return () => clearInterval(intervalId);
  }, []);

  function openArticle(item) {
    setSelected(item);
    const seen = JSON.parse(localStorage.getItem("seenNews") || "[]");
    if (!seen.includes(item.id)) {
      localStorage.setItem("seenNews", JSON.stringify([...seen, item.id]));
      setNews(prev => prev.map(n => n.id === item.id ? { ...n, seen: true } : n));
    }
  }

  return (
    <>
      <style>{`
        @keyframes tor-modal-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes tor-modal-slide {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .tor-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 16px;
          animation: tor-modal-fade 0.2s ease;
          /* Prevent backdrop itself from scrolling */
          overflow: hidden;
          touch-action: none;
        }

        .tor-modal {
          width: 100%;
          max-width: 520px;
          background: #0d1120;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 28px;
          position: relative;
          animation: tor-modal-slide 0.25s ease;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          /* Allow the modal box itself to scroll internally */
          touch-action: auto;
        }

        .tor-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          color: rgba(240,238,255,0.45);
          cursor: pointer;
          font-size: 16px;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }
        .tor-modal-close:hover {
          color: #ff5f5f;
          background: rgba(255,95,95,0.1);
          border-color: rgba(255,95,95,0.3);
        }

        .tor-modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-right: 36px;
        }
        .tor-modal-header-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(160,123,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a07bff;
          font-size: 16px;
          flex-shrink: 0;
        }
        .tor-modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #f0eeff;
          letter-spacing: -0.01em;
        }

        .tor-news-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
          max-height: 60vh;
          padding-right: 4px;
          -webkit-overflow-scrolling: touch;
        }
        .tor-news-list::-webkit-scrollbar { width: 4px; }
        .tor-news-list::-webkit-scrollbar-track { background: transparent; }
        .tor-news-list::-webkit-scrollbar-thumb {
          background: rgba(160,123,255,0.3);
          border-radius: 4px;
        }

        .tor-news-item {
          padding: 14px 16px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .tor-news-item:hover {
          border-color: rgba(160,123,255,0.3);
          background: rgba(160,123,255,0.07);
          transform: translateX(3px);
        }
        .tor-news-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .tor-news-unread-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ff5f5f;
          box-shadow: 0 0 7px #ff5f5f;
          flex-shrink: 0;
        }
        .tor-news-read-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
        .tor-news-item-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #f0eeff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tor-news-item-date {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(240,238,255,0.3);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tor-new-badge {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #ff5f5f;
          background: rgba(255,95,95,0.12);
          border: 1px solid rgba(255,95,95,0.3);
          padding: 2px 7px;
          border-radius: 100px;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .tor-modal-loading {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.3);
          text-align: center;
          padding: 32px 0;
          letter-spacing: 0.06em;
        }

        .tor-article-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(240,238,255,0.4);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 20px;
          transition: color 0.2s;
        }
        .tor-article-back:hover { color: #a07bff; }

        .tor-article-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #f0eeff;
          letter-spacing: -0.01em;
          margin-bottom: 8px;
          padding-right: 36px;
        }
        .tor-article-date {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(240,238,255,0.3);
          letter-spacing: 0.06em;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tor-article-date::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 1px;
          background: rgba(160,123,255,0.5);
        }
        .tor-article-body {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.75);
          line-height: 1.8;
          white-space: pre-line;
          overflow-y: auto;
          max-height: 55vh;
          padding-right: 4px;
          -webkit-overflow-scrolling: touch;
        }
        .tor-article-body::-webkit-scrollbar { width: 4px; }
        .tor-article-body::-webkit-scrollbar-track { background: transparent; }
        .tor-article-body::-webkit-scrollbar-thumb {
          background: rgba(160,123,255,0.3);
          border-radius: 4px;
        }

        .tor-article-author {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          color: rgba(240,238,255,0.4);
          flex-shrink: 0;
        }
        .tor-article-author-name {
          color: #a07bff;
          font-weight: 700;
        }

        .tor-modal-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 16px 0;
          flex-shrink: 0;
        }
      `}</style>

      <div
        className="tor-modal-backdrop"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="tor-modal">
          <button className="tor-modal-close" onClick={onClose} title="Close">
            <MdCancel />
          </button>

          {!selected ? (
            <>
              <div className="tor-modal-header">
                <div className="tor-modal-header-icon"><FaNewspaper /></div>
                <span className="tor-modal-title">Latest News</span>
              </div>

              <div className="tor-modal-divider" />

              {!news ? (
                <p className="tor-modal-loading">Fetching news...</p>
              ) : (
                <div className="tor-news-list">
                  {news.map(item => (
                    <div key={item.id} className="tor-news-item" onClick={() => openArticle(item)}>
                      <div className="tor-news-item-left">
                        {item.seen
                          ? <div className="tor-news-read-dot" />
                          : <div className="tor-news-unread-dot" />
                        }
                        <span className="tor-news-item-title">{item.title}</span>
                        {!item.seen && <span className="tor-new-badge">new</span>}
                      </div>
                      <span className="tor-news-item-date">{item.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <button className="tor-article-back" onClick={() => setSelected(null)}>
                <IoMdArrowRoundBack style={{ fontSize: 16 }} />
                Back
              </button>
              <div className="tor-article-title">{selected.title}</div>
              <div className="tor-article-date">{selected.date}</div>
              <div className="tor-modal-divider" />
              <div className="tor-article-body">{selected.content}</div>
              {selected.author && (
                <div className="tor-article-author">
                  - <span className="tor-article-author-name">{selected.author}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}