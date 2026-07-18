"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeedbackForm from "../components/FeedbackForm";

export default function FeedbackPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        .tor-fb-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }
        .tor-nb1 { position: fixed; width: 600px; height: 600px; background: rgba(120,70,255,0.09); filter: blur(90px); border-radius: 50%; top: -180px; right: -100px; pointer-events: none; z-index: 0; }
        .tor-nb2 { position: fixed; width: 440px; height: 440px; background: rgba(255,70,150,0.06); filter: blur(80px); border-radius: 50%; bottom: 8%; left: -120px; pointer-events: none; z-index: 0; }

        .tor-fb-main {
          position: relative;
          z-index: 1;
          max-width: 640px;
          margin: 0 auto;
          padding: 100px 24px 64px;
        }
        .tor-page-title { text-align: center; margin-bottom: 32px; }
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
          font-size: clamp(30px, 6vw, 48px);
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #a07bff, #ff6eb4, #ffe066);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }
        .tor-page-sub {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.5);
        }

        @media (max-width: 680px) {
          .tor-fb-main { padding: 88px 14px 48px; }
        }
      `}</style>

      <div className="tor-fb-page">
        <div className="tor-nb1" /><div className="tor-nb2" />
        <Navbar />

        <main className="tor-fb-main">
          <div className="tor-page-title">
            <div className="tor-page-eyebrow">TOHO</div>
            <h1 className="tor-page-h1">Feedback</h1>
            <p className="tor-page-sub">Bugs, ideas, complaints — we read all of it.</p>
          </div>

          <FeedbackForm />
        </main>

        <Footer />
      </div>
    </>
  );
}
