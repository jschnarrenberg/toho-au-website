import { factions } from "./factions";
import { crewmate } from "./crewmate";
import { impostor } from "./impostor";
import { neutral } from "./neutral";
import { coven } from "./coven";
import { modifier } from "./modifier";

export const factionData = { crewmate, impostor, neutral, coven, modifier };
export { factions };

export function getFactionBySlug(slug) {
  const base = factions.find(f => f.slug === slug);
  const data = factionData[slug];
  if (!base || !data) return null;
  return { ...base, ...data };
}

export function getRoleBySlug(factionSlug, roleSlug) {
  const faction = getFactionBySlug(factionSlug);
  return faction?.roles.find((r) => r.slug === roleSlug) ?? null;
}

export function getAllPaths() {
  return Object.values(factionData).flatMap((faction) =>
    faction.roles.map((role) => ({
      params: { faction: faction.slug, role: role.slug },
    }))
  );
}
