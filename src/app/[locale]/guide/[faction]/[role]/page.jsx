import { getAllPaths, getFactionBySlug, getRoleBySlug } from "@/app/data/guide";
import RoleClient from "./RoleClient";

export function generateStaticParams() {
  return getAllPaths().map(({ params }) => params);
}

export default async function RolePage({ params }) {
  const { faction: factionSlug, role: roleSlug } = await params;
  const faction = getFactionBySlug(factionSlug);
  const role = getRoleBySlug(factionSlug, roleSlug);
  if (!faction || !role) return null;
  return <RoleClient faction={faction} role={role} />;
}
