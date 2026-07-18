import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "../../../../auth";
import { birthdayConfig } from "../../../lib/birthdayConfig";

function wishesKey(slug) {
  return `birthday:${slug}:wishes`;
}

export async function GET() {
  if (!birthdayConfig.active) {
    return NextResponse.json({ wishes: [] });
  }

  try {
    const raw = await kv.hgetall(wishesKey(birthdayConfig.slug));
    const wishes = Object.entries(raw || {})
      .map(([discordId, value]) => {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return { discordId, ...parsed };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ wishes });
  } catch (err) {
    console.error("Failed to load birthday wishes:", err);
    return NextResponse.json({ error: "Failed to load wishes." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!birthdayConfig.active) {
    return NextResponse.json({ error: "This birthday page is no longer active." }, { status: 410 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in with Discord to leave a wish." }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > 500) {
    return NextResponse.json({ error: "Message is too long (max 500 characters)." }, { status: 400 });
  }

  const wish = {
    name: session.user.name || "Anonymous",
    avatar: session.user.image || null,
    message,
    createdAt: new Date().toISOString(),
  };

  try {
    // hset with the user's Discord ID as the field means resubmitting
    // just edits their existing wish instead of creating duplicates.
    await kv.hset(wishesKey(birthdayConfig.slug), { [session.user.id]: JSON.stringify(wish) });
    return NextResponse.json({ ok: true, wish: { discordId: session.user.id, ...wish } });
  } catch (err) {
    console.error("Failed to save birthday wish:", err);
    return NextResponse.json({ error: "Failed to save your wish." }, { status: 500 });
  }
}
