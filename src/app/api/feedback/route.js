import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

const TYPE_COLORS = {
  Bug: 0xff5f5f,
  Suggestion: 0xa07bff,
  General: 0x7dd3fc,
};

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in with Discord to send feedback." }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { type, message } = body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("FEEDBACK_WEBHOOK_URL is not set in the environment.");
    return NextResponse.json({ error: "Feedback endpoint is not configured." }, { status: 500 });
  }

  const safeType = TYPE_COLORS[type] !== undefined ? type : "General";
  const { id: discordId, name: discordName, image: discordAvatar } = session.user;

  const payload = {
    // Per-message identity override — Discord webhooks support this natively,
    // so each feedback message shows up as if posted by the actual user.
    username: discordName || "Anonymous",
    avatar_url: discordAvatar || undefined,
    // Mentions only notify when placed in `content`, not inside embeds.
    content: `<@${discordId}>`,
    embeds: [
      {
        title: `New ${safeType} Feedback`,
        description: message.slice(0, 3800),
        color: TYPE_COLORS[safeType],
        footer: { text: `Discord ID: ${discordId}` },
        thumbnail: discordAvatar ? { url: discordAvatar } : undefined,
        timestamp: new Date().toISOString(),
      },
    ],
    // Since content mentions the user themself (not a role or @everyone),
    // this is safe to allow — it just makes their own message ping them, not others.
    allowed_mentions: { parse: ["users"] },
  };

  try {
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!discordRes.ok) {
      const text = await discordRes.text().catch(() => "");
      console.error("Webhook delivery failed:", discordRes.status, text);
      return NextResponse.json({ error: "Failed to deliver feedback." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback route error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}