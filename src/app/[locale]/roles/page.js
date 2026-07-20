"use client";

import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaInfoCircle, FaSearch, FaTimes } from "react-icons/fa";
import { parseMarkup } from "@/app/[locale]/lib/textMarkup";
import rolesData from "@/app/data/roles.json";

const PAGE_SIZE = 48;

const CATEGORY_STYLES = {
  Crewmate: { color: "#93c5fd", background: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)" },
  Impostor: { color: "#fca5a5", background: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)" },
  Neutral: { color: "#fde68a", background: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.3)" },
  Coven: { color: "#d8b4fe", background: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)" },
  Modifier: { color: "#86efac", background: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)" },
};

const CATEGORIES = ["All", "Crewmate", "Impostor", "Neutral", "Coven", "Modifier"];

function CategoryBadge({ category }) {
  const s = CATEGORY_STYLES[category] || CATEGORY_STYLES.Modifier;
  return (
    <span className="tor-badge" style={{ color: s.color, background: s.background, borderColor: s.border }}>
      {category}
    </span>
  );
}

function RoleCard({ role }) {
  const [open, setOpen] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);
  const s = CATEGORY_STYLES[role.category] || CATEGORY_STYLES.Modifier;

  return (
    <div className="tor-role-card">
      <div className="tor-role-header">
        {!iconFailed ? (
          <img
            src={`/icons/RoleIcons/${role.id}.png`}
            alt=""
            className="tor-role-icon-img"
            style={{ borderColor: s.border, background: s.background }}
            onError={() => setIconFailed(true)}
          />
        ) : (
          <div className="tor-role-icon" style={{ color: s.color, background: s.background, borderColor: s.border }}>
            {role.name.charAt(0)}
          </div>
        )}
        <div className="tor-role-meta">
          <h2 className="tor-role-name">{role.name}</h2>
          <div className="tor-badge-row">
            <CategoryBadge category={role.category} />
          </div>
        </div>
      </div>

      <div className="tor-role-desc">
        <FaInfoCircle style={{ color: "#4eb8ff", flexShrink: 0, marginTop: 2 }} />
        <span>{parseMarkup(role.description)}</span>
      </div>

      {role.extra && (
        <>
          <button className={`tor-expand-btn${open ? " open" : ""}`} onClick={() => setOpen(!open)}>
            {open ? "Show Less" : "Show More"}
            <span className="tor-expand-arrow">{open ? "▲" : "▼"}</span>
          </button>

          <div className={`tor-expand-body${open ? " open" : ""}`}>
            <div className="tor-expand-inner">
              <p className="tor-extra-text">{parseMarkup(role.extra)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Roles() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const counts = useMemo(() => {
    const c = { All: rolesData.length };
    for (const r of rolesData) c[r.category] = (c[r.category] || 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rolesData.filter((r) => {
      if (category !== "All" && r.category !== category) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    });
  }, [search, category]);

  const visible = filtered.slice(0, visibleCount);

  function handleSearchChange(value) {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  }

  function handleCategoryChange(cat) {
    setCategory(cat);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        .tor-roles-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .tor-nb1 { position: fixed; width: 600px; height: 600px; background: rgba(120,70,255,0.09); filter: blur(90px); border-radius: 50%; top: -200px; right: -100px; pointer-events: none; z-index: 0; }
        .tor-nb2 { position: fixed; width: 450px; height: 450px; background: rgba(255,70,150,0.06); filter: blur(80px); border-radius: 50%; bottom: 10%; left: -130px; pointer-events: none; z-index: 0; }

        .tor-roles-main {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin: 0 auto;
          padding: 100px 24px 64px;
        }

        .tor-page-title { text-align: center; margin-bottom: 40px; }
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
          font-size: clamp(32px, 6vw, 56px);
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #a07bff, #ff6eb4, #ffe066);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .tor-page-sub {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.5);
          margin-top: 12px;
        }

        /* Controls */
        .tor-controls {
          position: sticky;
          top: 12px;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
          padding: 14px;
          background: rgba(8,11,20,0.75);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
        }
        .tor-search-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        .tor-search-wrap:focus-within { border-color: rgba(160,123,255,0.4); }
        .tor-search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: #f0eeff;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
        }
        .tor-search-input::placeholder { color: rgba(240,238,255,0.35); }
        .tor-search-clear { background: none; border: none; color: rgba(240,238,255,0.4); cursor: pointer; display: flex; }
        .tor-search-clear:hover { color: #f0eeff; }

        .tor-filter-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .tor-filter-chip {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          padding: 7px 14px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(240,238,255,0.6);
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .tor-filter-chip:hover { border-color: rgba(160,123,255,0.3); color: #f0eeff; }
        .tor-filter-chip.active {
          background: rgba(160,123,255,0.15);
          border-color: rgba(160,123,255,0.4);
          color: #d9c9ff;
        }

        .tor-result-count {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(240,238,255,0.4);
          margin-bottom: 20px;
        }

        .tor-roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
          margin-bottom: 32px;
        }

        .tor-role-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.25s, transform 0.2s;
        }
        .tor-role-card:hover { border-color: rgba(160,123,255,0.28); transform: translateY(-2px); }

        .tor-role-header { display: flex; align-items: center; gap: 14px; }
        .tor-role-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 17px;
        }
        .tor-role-icon-img {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid;
          object-fit: contain;
          padding: 6px;
          flex-shrink: 0;
        }
        .tor-role-meta { flex: 1; min-width: 0; }
        .tor-role-name { font-size: 16px; font-weight: 800; color: #f0eeff; letter-spacing: -0.01em; margin-bottom: 6px; }
        .tor-badge-row { display: flex; flex-wrap: wrap; gap: 5px; }
        .tor-badge {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
          padding: 2px 8px;
          border-radius: 100px;
          border: 1px solid;
          white-space: nowrap;
        }

        .tor-role-desc {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: rgba(240,238,255,0.65);
          font-family: 'Space Mono', monospace;
          line-height: 1.6;
          padding: 10px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .tor-expand-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 9px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(240,238,255,0.5);
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .tor-expand-btn:hover, .tor-expand-btn.open {
          background: rgba(160,123,255,0.08);
          border-color: rgba(160,123,255,0.25);
          color: #a07bff;
        }
        .tor-expand-arrow { font-size: 9px; }

        .tor-expand-body { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.35s ease, opacity 0.3s ease; }
        .tor-expand-body.open { max-height: 600px; opacity: 1; }
        .tor-expand-inner { display: flex; flex-direction: column; gap: 12px; padding-top: 4px; }

        .tor-extra-text {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.6);
          line-height: 1.7;
          padding: 12px 14px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border-left: 2px solid rgba(160,123,255,0.4);
        }

        .tor-empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(240,238,255,0.4);
          font-family: 'Space Mono', monospace;
          font-size: 13px;
        }

        .tor-load-more-wrap { display: flex; justify-content: center; margin-bottom: 56px; }
        .tor-load-more-btn {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 12px 28px;
          border-radius: 100px;
          background: rgba(160,123,255,0.1);
          border: 1px solid rgba(160,123,255,0.3);
          color: #d9c9ff;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .tor-load-more-btn:hover { background: rgba(160,123,255,0.18); border-color: rgba(160,123,255,0.5); }

        @media (max-width: 600px) {
          .tor-roles-main { padding: 88px 14px 48px; }
          .tor-roles-grid { grid-template-columns: 1fr; }
          .tor-controls { position: static; }
        }
      `}</style>

      <div className="tor-roles-page">
        <div className="tor-nb1" />
        <div className="tor-nb2" />

        <Navbar />

        <main className="tor-roles-main">
          <div className="tor-page-title">
            <div className="tor-page-eyebrow">TOHO</div>
            <h1 className="tor-page-h1">Roles &amp; Modifiers</h1>
            <p className="tor-page-sub">{rolesData.length}+ roles, straight from the mod itself</p>
          </div>

          <div className="tor-controls">
            <div className="tor-search-wrap">
              <FaSearch style={{ color: "rgba(240,238,255,0.35)", fontSize: 13, flexShrink: 0 }} />
              <input
                className="tor-search-input"
                type="text"
                placeholder="Search roles by name or ability..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {search && (
                <button className="tor-search-clear" onClick={() => handleSearchChange("")}>
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="tor-filter-row">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`tor-filter-chip${category === cat ? " active" : ""}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat} {counts[cat] ? `(${counts[cat]})` : ""}
                </button>
              ))}
            </div>
          </div>

          <p className="tor-result-count">
            Showing {visible.length} of {filtered.length} matching roles
          </p>

          {filtered.length === 0 ? (
            <div className="tor-empty-state">No roles match &quot;{search}&quot;. Try a different search or filter.</div>
          ) : (
            <>
              <div className="tor-roles-grid">
                {visible.map((role) => (
                  <RoleCard key={role.id} role={role} />
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="tor-load-more-wrap">
                  <button className="tor-load-more-btn" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
                    Load More ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}

          <Footer />
        </main>
      </div>
    </>
  );
}
