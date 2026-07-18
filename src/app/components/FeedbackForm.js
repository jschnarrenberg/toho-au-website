"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaDiscord } from "react-icons/fa";

const TYPES = ["Bug", "Suggestion", "General"];

export default function FeedbackForm() {
  const { data: session, status } = useSession();
  const [type, setType] = useState("General");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    setFormStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send feedback.");
      }

      setFormStatus("success");
      setMessage("");
    } catch (err) {
      setFormStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <>
      <style>{`
        .tor-fb-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
        }
        .tor-fb-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240,238,255,0.5);
          margin-bottom: 8px;
          display: block;
        }
        .tor-fb-type-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tor-fb-type-btn {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.05em;
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          color: rgba(240,238,255,0.6);
          cursor: pointer;
          transition: all 0.2s;
        }
        .tor-fb-type-btn.active {
          border-color: rgba(160,123,255,0.5);
          background: rgba(160,123,255,0.15);
          color: #d8b4fe;
        }
        .tor-fb-textarea {
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
          min-height: 140px;
          transition: border-color 0.2s;
        }
        .tor-fb-textarea:focus {
          outline: none;
          border-color: rgba(160,123,255,0.5);
        }
        .tor-fb-submit {
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
          transition: opacity 0.2s, transform 0.2s;
          width: fit-content;
        }
        .tor-fb-submit:hover { transform: translateY(-1px); }
        .tor-fb-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .tor-fb-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          padding: 10px 14px;
          border-radius: 10px;
        }
        .tor-fb-status.success {
          color: #86efac;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
        }
        .tor-fb-status.error {
          color: #ff9f9f;
          background: rgba(255,95,95,0.1);
          border: 1px solid rgba(255,95,95,0.25);
        }

        /* Auth states */
        .tor-fb-auth-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px 24px;
          text-align: center;
        }
        .tor-fb-auth-text {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: rgba(240,238,255,0.55);
        }
        .tor-fb-discord-btn {
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
        .tor-fb-discord-btn:hover { transform: translateY(-1px); opacity: 0.92; }

        .tor-fb-identity {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }
        .tor-fb-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .tor-fb-identity-text {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(240,238,255,0.6);
        }
        .tor-fb-identity-name {
          color: #f0eeff;
          font-weight: 700;
        }
        .tor-fb-signout {
          margin-left: auto;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(240,238,255,0.4);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
        }
        .tor-fb-signout:hover { color: rgba(240,238,255,0.7); }
      `}</style>

      {status === "loading" && (
        <div className="tor-fb-auth-card">
          <p className="tor-fb-auth-text">Checking sign-in status…</p>
        </div>
      )}

      {status === "unauthenticated" && (
        <div className="tor-fb-auth-card">
          <p className="tor-fb-auth-text">
            Sign in with Discord to submit feedback. This links your feedback to your
            real account so we can follow up with you directly.
          </p>
          <button className="tor-fb-discord-btn" onClick={() => signIn("discord")}>
            <FaDiscord style={{ fontSize: 16 }} />
            Sign in with Discord
          </button>
        </div>
      )}

      {status === "authenticated" && (
        <form className="tor-fb-form" onSubmit={handleSubmit}>
          <div className="tor-fb-identity">
            <img src={session.user.image} alt="" className="tor-fb-avatar" />
            <span className="tor-fb-identity-text">
              Posting as <span className="tor-fb-identity-name">{session.user.name}</span>
            </span>
            <button type="button" className="tor-fb-signout" onClick={() => signOut()}>
              Sign out
            </button>
          </div>

          <div>
            <label className="tor-fb-label">Type</label>
            <div className="tor-fb-type-row">
              {TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`tor-fb-type-btn${type === t ? " active" : ""}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="tor-fb-label" htmlFor="tor-fb-message">Your feedback</label>
            <textarea
              id="tor-fb-message"
              className="tor-fb-textarea"
              placeholder="Found a bug? Have an idea? Let us know…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={4000}
            />
          </div>

          <button type="submit" className="tor-fb-submit" disabled={formStatus === "sending" || !message.trim()}>
            <FaPaperPlane style={{ fontSize: 12 }} />
            {formStatus === "sending" ? "Sending…" : "Send Feedback"}
          </button>

          {formStatus === "success" && (
            <div className="tor-fb-status success">
              <FaCheckCircle /> Thanks! Your feedback has been sent.
            </div>
          )}
          {formStatus === "error" && (
            <div className="tor-fb-status error">
              <FaExclamationCircle /> {errorMsg || "Something went wrong. Please try again."}
            </div>
          )}
        </form>
      )}
    </>
  );
}
