"use client";
import { useState, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaPaintBrush, FaFont, FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaBold, FaItalic, FaUnderline, FaPlus, FaRandom, FaDownload,
  FaCopy, FaTrash, FaUndo, FaRedo, FaMagic, FaTag,
} from "react-icons/fa";

// ── SDF font list ─────────────────────────────────────────────
const SDF_FONTS = [
  "OCRAEXT SDF", "BROOK SDF", "VCR SDF", "Barlow-Black SDF",
  "Barlow-BoldItalic SDF", "Barlow-Light SDF", "CONSOLA SDF",
  "DIGITAL-7 SDF", "DIN_Pro_Bold_700 SDF", "LiberationSans SDF",
  "NotoSansJP-Regular SDF",
];

// ── Gradient presets ─────────────────────────────────────────
const GRADIENT_PRESETS = [
  { name: "Aurora",   stops: [{ color: "#00d4aa", pos: 0 }, { color: "#7c5af0", pos: 50 }, { color: "#e05a7a", pos: 100 }] },
  { name: "Void",     stops: [{ color: "#3ecfcf", pos: 0 }, { color: "#7c5af0", pos: 100 }] },
  { name: "Ember",    stops: [{ color: "#ff6b35", pos: 0 }, { color: "#f7c948", pos: 50 }, { color: "#ff3a6e", pos: 100 }] },
  { name: "Frost",    stops: [{ color: "#a8edea", pos: 0 }, { color: "#8ec5fc", pos: 100 }] },
  { name: "Nebula",   stops: [{ color: "#667eea", pos: 0 }, { color: "#764ba2", pos: 50 }, { color: "#f093fb", pos: 100 }] },
  { name: "Solar",    stops: [{ color: "#f7971e", pos: 0 }, { color: "#ffd200", pos: 100 }] },
  { name: "Crimson",  stops: [{ color: "#e05a7a", pos: 0 }, { color: "#7c0a02", pos: 100 }] },
  { name: "Candy",    stops: [{ color: "#f953c6", pos: 0 }, { color: "#b91d73", pos: 100 }] },
  { name: "Steel",    stops: [{ color: "#bdc3c7", pos: 0 }, { color: "#2c3e50", pos: 100 }] },
  { name: "Forest",   stops: [{ color: "#134e5e", pos: 0 }, { color: "#71b280", pos: 100 }] },
];

// ── Named export slot keys ────────────────────────────────────
const NAMED_KEYS = ["welcome", "rules", "welcomebubblecolor", "rulesbubblecolor", "gamemodebubblecolor"];

// ── Tab metadata ─────────────────────────────────────────────
const tabsMeta = [
  { id: "editor",   label: "Editor",          icon: FaFont,       accent: "#a07bff" },
  { id: "presets",  label: "Gradient Presets", icon: FaMagic,      accent: "#fdba74" },
  { id: "exports",  label: "Named Exports",    icon: FaTag,        accent: "#4fffb0" },
];

// ── Colour helpers ────────────────────────────────────────────
function hexToRgb(hex) {
  const h = parseInt(hex.replace("#", ""), 16);
  return [(h >> 16) & 255, (h >> 8) & 255, h & 255];
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
}
function lerpColor(a, b, t) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex([ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]);
}
function gradientColorAt(stops, t) {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  if (t <= sorted[0].pos / 100) return sorted[0].color;
  if (t >= sorted[sorted.length - 1].pos / 100) return sorted[sorted.length - 1].color;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i].pos / 100, b = sorted[i + 1].pos / 100;
    if (t >= a && t <= b) return lerpColor(sorted[i].color, sorted[i + 1].color, (t - a) / (b - a));
  }
  return sorted[0].color;
}
function stopsToGradientCss(stops) {
  return [...stops].sort((a, b) => a.pos - b.pos).map(s => `${s.color} ${s.pos}%`).join(", ");
}

// ── Rich-text → Among Us markup ──────────────────────────────
function domToMarkup(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  const el = node;
  const tag = el.tagName?.toUpperCase();
  let inner = Array.from(el.childNodes).map(domToMarkup).join("");
  if (tag === "BR" || tag === "DIV") inner += "\\n";
  const color = el.style?.color;
  const hexColor = color ? cssColorToHex(color) : null;
  const bold = tag === "B" || tag === "STRONG" || el.style?.fontWeight === "bold";
  const italic = tag === "I" || tag === "EM" || el.style?.fontStyle === "italic";
  const under = tag === "U" || (el.style?.textDecoration || "").includes("underline");
  if (bold)     inner = `<b>${inner}</b>`;
  if (italic)   inner = `<i>${inner}</i>`;
  if (under)    inner = `<u>${inner}</u>`;
  if (hexColor) inner = `<color=${hexColor}>${inner}</color>`;
  return inner;
}
function cssColorToHex(css) {
  if (!css) return null;
  if (css.startsWith("#")) return css;
  const m = css.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (m) return rgbToHex([+m[1], +m[2], +m[3]]);
  return null;
}

// ── Component ─────────────────────────────────────────────────
export default function TemplatePage() {
  const editorRef = useRef(null);

  // editor state
  const [align, setAlignState]   = useState("left");
  const [font, setFont]           = useState("OCRAEXT SDF");
  const [solidColor, setSolid]    = useState("#7c5af0");
  const [markup, setMarkup]       = useState("");
  const [historyStack, setHistory] = useState([""]);
  const [histIdx, setHistIdx]     = useState(0);

  // gradient stops
  const [stops, setStops] = useState([
    { id: 0, color: "#7c5af0", pos: 0 },
    { id: 1, color: "#3ecfcf", pos: 100 },
  ]);
  const nextId = useRef(2);

  // tabs
  const [activeTab, setActiveTab] = useState("editor");

  // named exports
  const [namedMarkups, setNamedMarkups] = useState(
    Object.fromEntries(NAMED_KEYS.map(k => [k, ""]))
  );

  // ── Markup sync ──────────────────────────────────────────────
  const syncMarkup = useCallback(() => {
    if (!editorRef.current) return;
    const out = Array.from(editorRef.current.childNodes).map(domToMarkup).join("").replace(/\\n+$/, "");
    setMarkup(out);
  }, []);

  const pushHistory = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setHistory(prev => {
      const next = prev.slice(0, histIdx + 1).concat(html);
      return next.slice(-80);
    });
    setHistIdx(prev => Math.min(prev + 1, 79));
    syncMarkup();
  }, [histIdx, syncMarkup]);

  const handleEditorInput = () => { pushHistory(); };

  // ── Style commands ───────────────────────────────────────────
  const execCmd = cmd => { editorRef.current?.focus(); document.execCommand(cmd); pushHistory(); };

  const applyAlign = a => {
    setAlignState(a);
    if (editorRef.current) editorRef.current.style.textAlign = a;
  };

  const applySolid = () => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    document.execCommand("foreColor", false, solidColor);
    pushHistory();
  };

  const applyGradient = () => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const text = range.toString();
    if (!text) return;
    const chars = [...text];
    const html = chars.map((ch, i) => {
      const t = chars.length > 1 ? i / (chars.length - 1) : 0;
      const c = gradientColorAt(stops, t);
      const safe = ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : ch;
      return `<span style="color:${c}">${safe}</span>`;
    }).join("");
    const frag = document.createRange().createContextualFragment(html);
    range.deleteContents();
    range.insertNode(frag);
    pushHistory();
  };

  const insertLiteral = str => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel?.rangeCount) {
      const r = sel.getRangeAt(0);
      r.deleteContents();
      r.insertNode(document.createTextNode(str));
      r.collapse(false);
    }
    pushHistory();
  };

  const undo = () => {
    if (histIdx <= 0) return;
    const ni = histIdx - 1;
    setHistIdx(ni);
    if (editorRef.current) editorRef.current.innerHTML = historyStack[ni];
    syncMarkup();
  };

  const redo = () => {
    if (histIdx >= historyStack.length - 1) return;
    const ni = histIdx + 1;
    setHistIdx(ni);
    if (editorRef.current) editorRef.current.innerHTML = historyStack[ni];
    syncMarkup();
  };

  const clearAll = () => {
    if (!confirm("Clear all editor content?")) return;
    if (editorRef.current) editorRef.current.innerHTML = "";
    pushHistory();
  };

  // ── Gradient stop helpers ────────────────────────────────────
  const addStop = () => {
    setStops(prev => [...prev, { id: nextId.current++, color: "#ffffff", pos: 50 }]);
  };
  const updateStop = (id, field, val) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };
  const removeStop = id => {
    setStops(prev => prev.filter(s => s.id !== id));
  };
  const randomizeStops = () => {
    setStops(prev => prev.map(s => ({
      ...s, color: "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"),
    })));
  };
  const reverseStops = () => {
    setStops(prev => {
      const sorted = [...prev].sort((a, b) => a.pos - b.pos);
      return prev.map((s, i) => ({ ...s, color: sorted[sorted.length - 1 - i]?.color || s.color }));
    });
  };
  const distributeStops = () => {
    setStops(prev => prev.map((s, i) => ({
      ...s, pos: prev.length > 1 ? Math.round(i / (prev.length - 1) * 100) : 0,
    })));
  };
  const loadPreset = preset => {
    setStops(preset.stops.map((s, i) => ({ ...s, id: nextId.current++ })));
    setActiveTab("editor");
  };

  // ── Export helpers ───────────────────────────────────────────
  const copyMarkup = () => navigator.clipboard.writeText(markup);
  const downloadTxt = () => {
    const blob = new Blob([markup], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "torwl_template.txt"; a.click(); URL.revokeObjectURL(a.href);
  };
  const useCurrentForNamed = key => {
    setNamedMarkups(prev => ({ ...prev, [key]: markup }));
  };
  const downloadNamed = () => {
    const lines = NAMED_KEYS.map(k => `${k}:${namedMarkups[k]}`).join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "torwl_named_exports.txt"; a.click(); URL.revokeObjectURL(a.href);
  };
  const copyNamed = () => {
    navigator.clipboard.writeText(NAMED_KEYS.map(k => `${k}:${namedMarkups[k]}`).join("\n"));
  };

  const gradCss = stopsToGradientCss(stops);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        .tor-template-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }
        .tor-nb1 { position: fixed; width: 600px; height: 600px; background: rgba(120,70,255,0.09); filter: blur(90px); border-radius: 50%; top: -180px; right: -100px; pointer-events: none; z-index: 0; }
        .tor-nb2 { position: fixed; width: 440px; height: 440px; background: rgba(255,70,150,0.06); filter: blur(80px); border-radius: 50%; bottom: 8%; left: -120px; pointer-events: none; z-index: 0; }

        .tor-template-main {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 0 auto;
          padding: 100px 24px 64px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* Page title */
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
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #a07bff, #ff6eb4, #ffe066);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Tab bar */
        .tor-tab-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .tor-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(240,238,255,0.5);
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .tor-tab-btn:hover { background: rgba(255,255,255,0.07); color: #f0eeff; }
        .tor-tab-btn.active {
          background: rgba(160,123,255,0.12);
          border-color: var(--tab-accent, rgba(160,123,255,0.4));
          color: var(--tab-accent, #a07bff);
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
          background: rgba(160,123,255,0.12);
          display: flex; align-items: center; justify-content: center;
          color: #a07bff;
          font-size: 17px;
          flex-shrink: 0;
        }
        .tor-panel-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        /* Section divider */
        .tor-section-heading {
          display: flex; align-items: center; gap: 14px; margin-bottom: 16px;
        }
        .tor-section-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .tor-section-title {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,238,255,0.35);
        }

        /* Toolbar grid */
        .tor-toolbar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .tor-toolbar-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tor-toolbar-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,238,255,0.35);
        }
        .tor-toolbar-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          align-items: center;
        }

        /* Icon buttons */
        .tor-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(240,238,255,0.6);
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .tor-icon-btn:hover { background: rgba(255,255,255,0.09); color: #f0eeff; }
        .tor-icon-btn.active {
          background: rgba(160,123,255,0.15);
          border-color: rgba(160,123,255,0.4);
          color: #a07bff;
        }
        .tor-icon-btn.accent {
          background: rgba(160,123,255,0.12);
          border-color: rgba(160,123,255,0.35);
          color: #a07bff;
        }
        .tor-icon-btn.accent:hover {
          background: rgba(160,123,255,0.22);
        }
        .tor-icon-btn.danger {
          border-color: rgba(255,100,100,0.3);
          color: rgba(255,130,130,0.7);
        }
        .tor-icon-btn.danger:hover { background: rgba(255,80,80,0.08); color: #ff8080; }

        /* Font select */
        .tor-font-select {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 7px 10px;
          color: #f0eeff;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
          flex: 1;
        }
        .tor-font-select:focus { border-color: rgba(160,123,255,0.5); }

        /* Color swatch */
        .tor-color-input {
          width: 36px; height: 32px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 7px;
          background: none;
          cursor: pointer;
          padding: 2px;
          flex-shrink: 0;
        }

        /* Rich text editor */
        .tor-editor {
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 16px;
          min-height: 120px;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          color: #f0eeff;
          outline: none;
          line-height: 1.7;
          transition: border-color 0.2s;
          word-break: break-all;
        }
        .tor-editor:focus { border-color: rgba(160,123,255,0.45); }
        .tor-editor:empty:before {
          content: "Type your template here…";
          color: rgba(240,238,255,0.2);
          pointer-events: none;
        }

        /* Preview box */
        .tor-preview {
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px;
          min-height: 80px;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          line-height: 1.7;
          word-break: break-all;
        }

        /* Markup output */
        .tor-markup-output {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(160,123,255,0.2);
          border-radius: 12px;
          padding: 14px 16px;
          min-height: 70px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #a07bff;
          white-space: pre-wrap;
          word-break: break-all;
          line-height: 1.6;
          user-select: all;
        }

        /* Gradient bar */
        .tor-gradient-bar {
          height: 10px;
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,0.1);
          margin: 8px 0;
        }

        /* Stop rows */
        .tor-stop-row {
          display: grid;
          grid-template-columns: 36px 1fr 72px auto;
          gap: 8px;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .tor-stop-row:last-child { border-bottom: none; }
        .tor-stop-color {
          width: 34px; height: 30px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px;
          background: none;
          cursor: pointer;
          padding: 2px;
        }
        .tor-stop-pos {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: #f0eeff;
          padding: 5px 8px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          outline: none;
          width: 100%;
          text-align: right;
          transition: border-color 0.2s;
        }
        .tor-stop-pos:focus { border-color: rgba(160,123,255,0.45); }
        .tor-stop-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(240,238,255,0.3);
        }

        /* Preset grid */
        .tor-preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 10px;
        }
        .tor-preset-card {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.2s;
        }
        .tor-preset-card:hover {
          transform: scale(1.03);
          border-color: rgba(160,123,255,0.4);
        }
        .tor-preset-swatch {
          height: 36px;
        }
        .tor-preset-name {
          padding: 7px 10px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(240,238,255,0.6);
          background: rgba(255,255,255,0.03);
          letter-spacing: 0.06em;
        }

        /* Named exports */
        .tor-named-row {
          display: grid;
          grid-template-columns: 90px 1fr auto;
          gap: 10px;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .tor-named-row:last-child { border-bottom: none; }
        .tor-named-key {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #4fffb0;
          letter-spacing: 0.06em;
          padding-top: 8px;
        }
        .tor-named-textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #f0eeff;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          padding: 7px 10px;
          resize: vertical;
          min-height: 42px;
          outline: none;
          transition: border-color 0.2s;
          line-height: 1.5;
        }
        .tor-named-textarea:focus { border-color: rgba(160,123,255,0.45); }

        /* Variable tags */
        .tor-var-tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(78,184,255,0.3);
          background: rgba(78,184,255,0.07);
          color: #4eb8ff;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .tor-var-tag:hover { background: rgba(78,184,255,0.14); border-color: rgba(78,184,255,0.5); }

        /* Export row */
        .tor-export-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          padding-top: 8px;
        }
        .tor-export-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
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
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .tor-export-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 0 28px rgba(160,123,255,0.4);
        }
        @keyframes torGrad {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .tor-export-hint {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.3);
          line-height: 1.6;
        }

        @media (max-width: 680px) {
          .tor-template-main { padding: 88px 14px 48px; gap: 28px; }
          .tor-panel { padding: 20px 16px; }
          .tor-toolbar { grid-template-columns: 1fr; }
          .tor-named-row { grid-template-columns: 1fr; }
          .tor-named-key { padding-top: 0; }
        }
      `}</style>

      <div className="tor-template-page">
        <div className="tor-nb1" /><div className="tor-nb2" />
        <Navbar />

        <main className="tor-template-main">

          {/* Title */}
          <div className="tor-page-title">
            <div className="tor-page-eyebrow">TOR-W : L</div>
            <h1 className="tor-page-h1">Live Template Editor</h1>
          </div>

          {/* Tab bar */}
          <div className="tor-tab-bar">
            {tabsMeta.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tor-tab-btn${activeTab === tab.id ? " active" : ""}`}
                  style={{ "--tab-accent": tab.accent }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon style={{ fontSize: 12 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── EDITOR TAB ── */}
          {activeTab === "editor" && (
            <div className="tor-panel">
              <div className="tor-panel-header">
                <div className="tor-panel-icon"><FaPaintBrush /></div>
                <h2 className="tor-panel-title">Template Editor</h2>
              </div>

              {/* Toolbar */}
              <div className="tor-toolbar">

                {/* Font + Align */}
                <div className="tor-toolbar-group">
                  <div className="tor-toolbar-label">Font</div>
                  <div className="tor-toolbar-row">
                    <select
                      className="tor-font-select"
                      value={font}
                      onChange={e => setFont(e.target.value)}
                    >
                      {SDF_FONTS.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>

                  <div className="tor-toolbar-label" style={{ marginTop: 8 }}>Align</div>
                  <div className="tor-toolbar-row">
                    <button className={`tor-icon-btn${align === "left" ? " active" : ""}`} onClick={() => applyAlign("left")} title="Left">
                      <FaAlignLeft style={{ fontSize: 12 }} />
                    </button>
                    <button className={`tor-icon-btn${align === "center" ? " active" : ""}`} onClick={() => applyAlign("center")} title="Center">
                      <FaAlignCenter style={{ fontSize: 12 }} />
                    </button>
                    <button className={`tor-icon-btn${align === "right" ? " active" : ""}`} onClick={() => applyAlign("right")} title="Right">
                      <FaAlignRight style={{ fontSize: 12 }} />
                    </button>
                  </div>
                </div>

                {/* Style + Solid color */}
                <div className="tor-toolbar-group">
                  <div className="tor-toolbar-label">Style</div>
                  <div className="tor-toolbar-row">
                    <button className="tor-icon-btn" onClick={() => execCmd("bold")} title="Bold (Ctrl+B)">
                      <FaBold style={{ fontSize: 12 }} />
                    </button>
                    <button className="tor-icon-btn" onClick={() => execCmd("italic")} title="Italic (Ctrl+I)">
                      <FaItalic style={{ fontSize: 12 }} />
                    </button>
                    <button className="tor-icon-btn" onClick={() => execCmd("underline")} title="Underline (Ctrl+U)">
                      <FaUnderline style={{ fontSize: 12 }} />
                    </button>
                    <button className="tor-icon-btn" onClick={() => insertLiteral("\\n")} title="Insert literal \n">
                      ↵ \n
                    </button>
                    <button className="tor-icon-btn" onClick={undo} title="Undo"><FaUndo style={{ fontSize: 11 }} /></button>
                    <button className="tor-icon-btn" onClick={redo} title="Redo"><FaRedo style={{ fontSize: 11 }} /></button>
                  </div>

                  <div className="tor-toolbar-label" style={{ marginTop: 8 }}>Solid Color</div>
                  <div className="tor-toolbar-row">
                    <input type="color" className="tor-color-input" value={solidColor} onChange={e => setSolid(e.target.value)} />
                    <button className="tor-icon-btn accent" onClick={applySolid}>Apply to selection</button>
                  </div>
                </div>
              </div>

              {/* Gradient stops */}
              <div className="tor-section-heading">
                <span className="tor-section-line" />
                <span className="tor-section-title">Gradient</span>
                <span className="tor-section-line" />
              </div>

              <div
                className="tor-gradient-bar"
                style={{ background: `linear-gradient(to right, ${gradCss})` }}
              />

              <div style={{ marginBottom: 12 }}>
                {stops.map(s => (
                  <div key={s.id} className="tor-stop-row">
                    <input
                      type="color" className="tor-stop-color" value={s.color}
                      onChange={e => updateStop(s.id, "color", e.target.value)}
                    />
                    <div />
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input
                        type="number" className="tor-stop-pos"
                        min={0} max={100} step={1} value={s.pos}
                        onChange={e => updateStop(s.id, "pos", +e.target.value)}
                      />
                      <span className="tor-stop-label">%</span>
                    </div>
                    {stops.length > 2 && (
                      <button className="tor-icon-btn danger" onClick={() => removeStop(s.id)}>
                        <FaTrash style={{ fontSize: 10 }} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="tor-toolbar-row" style={{ marginBottom: 20, flexWrap: "wrap", gap: 6 }}>
                <button className="tor-icon-btn" onClick={addStop}><FaPlus style={{ fontSize: 10 }} /> Add stop</button>
                <button className="tor-icon-btn" onClick={randomizeStops}><FaRandom style={{ fontSize: 10 }} /> Randomize</button>
                <button className="tor-icon-btn" onClick={reverseStops}>Reverse</button>
                <button className="tor-icon-btn" onClick={distributeStops}>Distribute</button>
                <button className="tor-icon-btn accent" onClick={applyGradient}><FaMagic style={{ fontSize: 10 }} /> Apply gradient</button>
              </div>

              {/* Insert variables */}
              <div className="tor-section-heading">
                <span className="tor-section-line" />
                <span className="tor-section-title">Insert Variable</span>
                <span className="tor-section-line" />
              </div>
              <div className="tor-toolbar-row" style={{ marginBottom: 20, gap: 6, flexWrap: "wrap" }}>
                {["{{PlayerName}}", "{{ModVersion}}"].map(v => (
                  <span key={v} className="tor-var-tag" onClick={() => insertLiteral(v)}>{v}</span>
                ))}
              </div>

              {/* Editor + Preview */}
              <div className="tor-section-heading">
                <span className="tor-section-line" />
                <span className="tor-section-title">Editor</span>
                <span className="tor-section-line" />
              </div>
              <div
                ref={editorRef}
                className="tor-editor"
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                style={{ textAlign: align }}
                onInput={handleEditorInput}
                onKeyDown={e => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); insertLiteral("\\n"); }
                  if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); downloadTxt(); }
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6, marginBottom: 16 }}>
                <button className="tor-icon-btn danger" onClick={clearAll}>
                  <FaTrash style={{ fontSize: 10 }} /> Clear slate
                </button>
              </div>

              <div className="tor-section-heading">
                <span className="tor-section-line" />
                <span className="tor-section-title">Live Preview</span>
                <span className="tor-section-line" />
              </div>
              <div className="tor-preview" dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || "" }} />

              <div className="tor-section-heading" style={{ marginTop: 20 }}>
                <span className="tor-section-line" />
                <span className="tor-section-title">Markup Output</span>
                <span className="tor-section-line" />
              </div>
              <div className="tor-markup-output">{markup || <span style={{ color: "rgba(160,123,255,0.3)" }}>Output will appear here…</span>}</div>

              <div className="tor-export-row" style={{ marginTop: 20 }}>
                <button className="tor-export-btn" onClick={downloadTxt}>
                  <FaDownload style={{ fontSize: 14 }} /> Download .txt
                </button>
                <button className="tor-icon-btn accent" onClick={copyMarkup} style={{ padding: "10px 20px" }}>
                  <FaCopy style={{ fontSize: 12 }} /> Copy markup
                </button>
                <p className="tor-export-hint">
                  Ctrl+S to quick-save. Output uses Among Us color/style markup.
                </p>
              </div>
            </div>
          )}

          {/* ── PRESETS TAB ── */}
          {activeTab === "presets" && (
            <div className="tor-panel">
              <div className="tor-panel-header">
                <div className="tor-panel-icon"><FaMagic /></div>
                <h2 className="tor-panel-title">Gradient Presets</h2>
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "rgba(240,238,255,0.45)", marginBottom: 24, lineHeight: 1.7 }}>
                Click any preset to load its stops into the editor.
              </p>
              <div className="tor-preset-grid">
                {GRADIENT_PRESETS.map(preset => (
                  <div key={preset.name} className="tor-preset-card" onClick={() => loadPreset(preset)}>
                    <div
                      className="tor-preset-swatch"
                      style={{ background: `linear-gradient(to right, ${stopsToGradientCss(preset.stops)})` }}
                    />
                    <div className="tor-preset-name">{preset.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NAMED EXPORTS TAB ── */}
          {activeTab === "exports" && (
            <div className="tor-panel">
              <div className="tor-panel-header">
                <div className="tor-panel-icon"><FaTag /></div>
                <h2 className="tor-panel-title">Named Exports</h2>
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "rgba(240,238,255,0.45)", marginBottom: 24, lineHeight: 1.7 }}>
                Download emits <code className="tor-code">name:markup</code> per line.
                Use <em>Use current</em> to capture the editor's current output into a slot.
              </p>

              <div>
                {NAMED_KEYS.map(key => (
                  <div key={key} className="tor-named-row">
                    <div className="tor-named-key">{key}</div>
                    <textarea
                      className="tor-named-textarea"
                      placeholder={`Markup for ${key}…`}
                      value={namedMarkups[key]}
                      onChange={e => setNamedMarkups(prev => ({ ...prev, [key]: e.target.value }))}
                    />
                    <button className="tor-icon-btn accent" onClick={() => useCurrentForNamed(key)}>
                      Use current
                    </button>
                  </div>
                ))}
              </div>

              <div className="tor-export-row" style={{ marginTop: 24 }}>
                <button className="tor-export-btn" onClick={downloadNamed}>
                  <FaDownload style={{ fontSize: 14 }} /> Download named .txt
                </button>
                <button className="tor-icon-btn accent" onClick={copyNamed} style={{ padding: "10px 20px" }}>
                  <FaCopy style={{ fontSize: 12 }} /> Copy named
                </button>
              </div>
            </div>
          )}

          <Footer />
        </main>
      </div>
    </>
  );
}
