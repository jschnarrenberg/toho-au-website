"use client";

import Link from "next/link";
import { birthdayConfig } from "@/app/[locale]/lib/birthdayConfig";

export default function BirthdayBanner() {
  if (!birthdayConfig.active) return null;

  return (
    <>
      <style>{`
        .tor-bday-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          background: linear-gradient(90deg, rgba(160,123,255,0.15), rgba(255,110,180,0.15));
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 10px 16px;
          text-align: center;
        }
        .tor-bday-banner-text {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.02em;
          color: #f0eeff;
        }
        .tor-bday-banner-text strong {
          background: linear-gradient(90deg, #a07bff, #ff6eb4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .tor-bday-banner-link {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #a07bff;
          text-decoration: underline;
          text-underline-offset: 2px;
          white-space: nowrap;
        }
        .tor-bday-banner-link:hover { color: #d8b4fe; }
      `}</style>

      <div className="tor-bday-banner">
        <span className="tor-bday-banner-text">
          🎂 It's <strong>{birthdayConfig.name}</strong>'s birthday ({birthdayConfig.date})!
        </span>
        <Link href="/birthdays" className="tor-bday-banner-link">
          Leave a wish →
        </Link>
      </div>
    </>
  );
}
