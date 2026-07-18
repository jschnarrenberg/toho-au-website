"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaBirthdayCake, FaDiscord, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { birthdayConfig } from "../lib/birthdayConfig";

export default function BirthdayPage() {
  const { data: session, status } = useSession();
  const [wishes, setWishes] = useState([]);
  const [loadingWishes, setLoadingWishes] = useState(true);
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchWishes();
  }, []);

  async function fetchWishes() {
    setLoadingWishes(true);
    try {
      const res = await fetch("/api/birthdays/wishes");
      const data = await res.json();
      setWishes(data.wishes || []);
    } catch (err) {
      console.error("Failed to load wishes:", err);
    } finally {
      setLoadingWishes(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    setFormStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/birthdays/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send your wish.");
      }

      setFormStatus("success");
      setMessage("");
      fetchWishes();
    } catch (err) {
      setFormStatus("error");
      setErrorMsg(err.message);
    }
  }

  if (!birthdayConfig.active) {
    return (
      <div className="tor-bday-page">
        <Navbar />
        <main className="tor-bday-main">
          <p className="tor-bday-inactive">This birthday page isn't active right now.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const existingWish = session?.user?.id
    ? wishes.find(w => w.discordId === session.user.id)
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        .tor-bday-page {
          min-height: 100vh;
          background: #080b14;
          color: #f0eeff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }
        .tor-nb1 { position: fixed; width: 600px; height: 600px; background: rgba(160,123,255,0.1); filter: blur(90px); border-radius: 50%; top: -180px; right: -100px; pointer-events: none; z-index: 0; }
        .tor-nb2 { position: fixed; width: 440px; height: 440px; background: rgba(255,110,180,0.08); filter: blur(80px); border-radius: 50%; bottom: 8%; left: -120px; pointer-events: none; z-index: 0; }

        .tor-bday-main {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
          padding: 100px 24px 64px;
        }

        .tor-bday-hero { text-align: center; margin-bottom: 32px; }
        .tor-bday-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 3px solid rgba(160,123,255,0.4);
          object-fit: cover;
          margin-bottom: 16px;
        }
        .tor-bday-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
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
        .tor-bday-h1 {
          font-size: clamp(28px, 6vw, 44px);
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #a07bff, #ff6eb4, #ffe066);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        .tor-bday-intro {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.55);
          max-width: 460px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .tor-bday-auth-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          margin-bottom: 32px;
        }
        .tor-bday-auth-text {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.55);
        }
        .tor-bday-discord-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 12px 24px;
          border-radius: 100px;
          border: none;
          background: #5865f2;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }
        .tor-bday-discord-btn:hover { transform: translateY(-1px); opacity: 0.92; }

        .tor-bday-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 40px;
        }
        .tor-bday-identity {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tor-bday-identity img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .tor-bday-identity-text {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.6);
        }
        .tor-bday-identity-name { color: #f0eeff; font-weight: 700; }
        .tor-bday-signout {
          margin-left: auto;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(240,238,255,0.4);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
        }
        .tor-bday-signout:hover { color: rgba(240,238,255,0.7); }
        .tor-bday-textarea {
          width: 100%;
          box-sizing: border-box;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 14px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: #f0eeff;
          resize: vertical;
          min-height: 110px;
          transition: border-color 0.2s;
        }
        .tor-bday-textarea:focus { outline: none; border-color: rgba(160,123,255,0.5); }
        .tor-bday-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 12px 24px;
          border-radius: 100px;
          border: none;
          background: linear-gradient(90deg, #a07bff, #ff6eb4);
          color: #08050f;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
          width: fit-content;
        }
        .tor-bday-submit:hover { transform: translateY(-1px); }
        .tor-bday-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .tor-bday-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          padding: 10px 14px;
          border-radius: 10px;
        }
        .tor-bday-status.success { color: #86efac; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); }
        .tor-bday-status.error { color: #ff9f9f; background: rgba(255,95,95,0.1); border: 1px solid rgba(255,95,95,0.25); }

        .tor-bday-wall-title {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,238,255,0.4);
          margin-bottom: 16px;
        }
        .tor-bday-wall {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tor-wish-card {
          display: flex;
          gap: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px;
        }
        .tor-wish-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .tor-wish-name {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #d8b4fe;
          margin-bottom: 4px;
        }
        .tor-wish-message {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.8);
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .tor-bday-empty {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.35);
          text-align: center;
          padding: 24px;
        }
        .tor-bday-inactive {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.5);
          text-align: center;
          padding: 120px 24px;
        }

        @media (max-width: 680px) {
          .tor-bday-main { padding: 88px 14px 48px; }
        }
      `}</style>

      <div className="tor-bday-page">
        <div className="tor-nb1" /><div className="tor-nb2" />
        <Navbar />

        <main className="tor-bday-main">
          <div className="tor-bday-hero">
            <img src={birthdayConfig.avatarUrl} alt={birthdayConfig.name} className="tor-bday-avatar" />
            <div className="tor-bday-eyebrow">
              <FaBirthdayCake /> {birthdayConfig.date}
            </div>
            <h1 className="tor-bday-h1">Happy Birthday, {birthdayConfig.name}!</h1>
            <p className="tor-bday-intro">{birthdayConfig.intro}</p>
          </div>

          {status === "unauthenticated" && (
            <div className="tor-bday-auth-card">
              <p className="tor-bday-auth-text">Sign in with Discord to leave a birthday message.</p>
              <button className="tor-bday-discord-btn" onClick={() => signIn("discord")}>
                <FaDiscord style={{ fontSize: 16 }} />
                Sign in with Discord
              </button>
            </div>
          )}

          {status === "authenticated" && (
            <form className="tor-bday-form" onSubmit={handleSubmit}>
              <div className="tor-bday-identity">
                <img src={session.user.image} alt="" />
                <span className="tor-bday-identity-text">
                  Posting as <span className="tor-bday-identity-name">{session.user.name}</span>
                </span>
                <button type="button" className="tor-bday-signout" onClick={() => signOut()}>
                  Sign out
                </button>
              </div>

              <textarea
                className="tor-bday-textarea"
                placeholder={existingWish ? "Edit your message…" : "Write your birthday message…"}
                value={message || existingWish?.message || ""}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                required
              />

              <button type="submit" className="tor-bday-submit" disabled={formStatus === "sending" || !message.trim()}>
                <FaPaperPlane style={{ fontSize: 12 }} />
                {formStatus === "sending" ? "Sending…" : existingWish ? "Update Wish" : "Send Wish"}
              </button>

              {formStatus === "success" && (
                <div className="tor-bday-status success">
                  <FaCheckCircle /> Your wish is on the wall!
                </div>
              )}
              {formStatus === "error" && (
                <div className="tor-bday-status error">
                  <FaExclamationCircle /> {errorMsg || "Something went wrong. Please try again."}
                </div>
              )}
            </form>
          )}

          <div className="tor-bday-wall-title">/ {wishes.length} wish{wishes.length === 1 ? "" : "es"}</div>
          <div className="tor-bday-wall">
            {loadingWishes && <p className="tor-bday-empty">Loading wishes…</p>}
            {!loadingWishes && wishes.length === 0 && (
              <p className="tor-bday-empty">No wishes yet — be the first!</p>
            )}
            {wishes.map(w => (
              <div key={w.discordId} className="tor-wish-card">
                {w.avatar && <img src={w.avatar} alt="" className="tor-wish-avatar" />}
                <div>
                  <div className="tor-wish-name">{w.name}</div>
                  <div className="tor-wish-message">{w.message}</div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
