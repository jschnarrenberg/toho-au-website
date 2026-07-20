import { factions, getFactionBySlug } from "@/app/data/guide";
import FactionClient from "./FactionClient";

export function generateStaticParams() {
  return factions.map((f) => ({ faction: f.slug }));
}

export default async function FactionPage({ params }) {
  const { faction: factionSlug } = await params;
  const faction = getFactionBySlug(factionSlug);
  if (!faction) return null;
  return <FactionClient faction={faction} />;
}