// Edit this whenever you reuse the birthday page for someone new.
// `slug` is the storage key — changing it starts a fresh wish list
// without deleting the previous person's wishes (they stay archived in KV).
export const birthdayConfig = {
  active: true, // flip to false to hide the banner + redirect the page away
  slug: "lime-2026-07", // unique per person + occasion, e.g. "andries-2026-12"
  name: "Lime",
  avatarUrl: "https://cdn.discordapp.com/avatars/1187637542812655616/e7cbe534343422d35a5cba8ab4e8e4ea.png?size=1024", // drop an image in /public/birthday/
  date: "July 18th",
  intro: "Drop a birthday message below — it'll show up on the wall for everyone to see 🎉",
};
