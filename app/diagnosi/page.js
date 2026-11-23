export const dynamic = "force-dynamic";

export default async function Diagnosi() {
  const region = process.env.BLIZZARD_REGION || "eu";
  const id = process.env.BLIZZARD_CLIENT_ID;
  const secret = process.env.BLIZZARD_CLIENT_SECRET;
  const slugRaw = process.env.GUILD_SLUG || "(non impostato)";
  const out = [
    `Client ID presente: ${!!id}`,
    `Client Secret presente: ${!!secret}`,
    `Regione: ${region}`,
    `Slug gilda: ${slugRaw}`,
  ];
  let token = null;
  try {
    const r = await fetch("https://oauth.battle.net/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });
    out.push(`Token: HTTP ${r.status}`);
    if (r.ok) token = (await r.json()).access_token;
  } catch (e) {
    out.push("Token: errore di rete " + e.message);
  }
  if (token) {
    const slug = encodeURIComponent(decodeURIComponent(slugRaw));
    for (const path of ["", "/roster"]) {
      const url = `https://${region}.api.blizzard.com/data/wow/guild/${slug}${path}?namespace=profile-forever-${region}&locale=it_IT`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      out.push(`\nGilda${path || " (info)"}: HTTP ${r.status}`);
      out.push((await r.text()).slice(0, 500));
    }
  }
  return <pre style={{ whiteSpace: "pre-wrap", padding: 20 }}>{out.join("\n")}</pre>;
}
