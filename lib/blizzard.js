import membri from "../data/membri.json";
const REGION = process.env.BLIZZARD_REGION || "eu";
const API = `https://${REGION}.api.blizzard.com`;
let cache = { token: null, exp: 0 };

async function token() {
  if (cache.token && Date.now() < cache.exp) return cache.token;
  const basic = Buffer.from(
    `${process.env.BLIZZARD_CLIENT_ID}:${process.env.BLIZZARD_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Token Blizzard rifiutato: controlla Client ID e Client Secret");
  const d = await res.json();
  cache = { token: d.access_token, exp: Date.now() + (d.expires_in - 300) * 1000 };
  return cache.token;
}

// Chiamata generica all'API Blizzard (dati in cache per 30 minuti)
export async function bget(path, namespace = `profile-forever-${REGION}`) {
  try {
    const t = await token();
    const url = `${API}${path}?namespace=${namespace}&locale=it_IT`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${t}` }, next: { revalidate: 1800 } });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export const GUILD_NAME = "Ænigmå";
const guildSlug = () => encodeURIComponent(decodeURIComponent(process.env.GUILD_SLUG || "ænigmå"));
export const charSlug = (c) => encodeURIComponent([c.name, c.surname].filter(Boolean).join("-").toLowerCase());

export async function getRoster() {
  const d = await bget(`/data/wow/guild/${guildSlug()}/roster`);
  if (d?.members?.length) {
    return d.members
      .map((m) => ({ ...m.character, rank: m.rank }))
      .sort((a, b) => a.rank - b.rank || b.level - a.level);
  }
  // Se l'API della gilda non risponde, usa l'elenco in data/membri.json
  const list = await Promise.all(
    membri.map(async (slug) => {
      const p = await bget(`/profile/wow/character/${encodeURIComponent(slug.toLowerCase())}`);
      return p
        ? { id: p.id, name: p.name, surname: p.surname, level: p.level, playable_class: { id: p.character_class?.id }, rank: 0 }
        : null;
    })
  );
  return list.filter(Boolean).sort((a, b) => b.level - a.level);
}
}

export async function getClassNames() {
  const d = await bget("/data/wow/playable-class/index", `static-forever-${REGION}`);
  return Object.fromEntries((d?.classes ?? []).map((c) => [c.id, c.name]));
}

export const CLASS_COLORS = {
  1: "#C79C6E", 2: "#F58CB2", 3: "#ABD473", 4: "#FFF569", 5: "#E8E8E8",
  7: "#4A90E2", 8: "#69CCF0", 9: "#9482C9", 11: "#FF7D0A",
};
export const QUALITY_COLORS = {
  POOR: "#9d9d9d", COMMON: "#e8e8e8", UNCOMMON: "#1eff00", RARE: "#4a90e2", EPIC: "#b25be0", LEGENDARY: "#ff8000",
};
