export const dynamic = "force-dynamic";

export default async function Diagnosi({ searchParams }) {
  const region = process.env.BLIZZARD_REGION || "eu";
  const ns = `profile-forever-${region}`;
  const out = [];
  const t = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${process.env.BLIZZARD_CLIENT_ID}:${process.env.BLIZZARD_CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const token = (await t.json()).access_token;
  const get = async (path) => {
    const r = await fetch(`https://${region}.api.blizzard.com${path}?namespace=${ns}&locale=it_IT`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return [r.status, await r.text()];
  };

  const char = searchParams?.char;
  if (char) {
    const [s, body] = await get(`/profile/wow/character/${encodeURIComponent(char.toLowerCase())}`);
    out.push(`Personaggio ${char}: HTTP ${s}`);
    try {
      out.push("Gilda del personaggio: " + JSON.stringify(JSON.parse(body).guild));
    } catch {
      out.push(body.slice(0, 300));
    }
  }

  const env = decodeURIComponent(process.env.GUILD_SLUG || "ænigmå");
  for (const s of [env, "aenigma", "ænigma"]) {
    const [st, body] = await get(`/data/wow/guild/${encodeURIComponent(s)}`);
    out.push(`Gilda "${s}": HTTP ${st}`);
    if (st === 200) out.push(body.slice(0, 250));
  }
  return <pre style={{ whiteSpace: "pre-wrap", padding: 20 }}>{out.join("\n")}</pre>;
}
