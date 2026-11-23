import { bget, QUALITY_COLORS } from "../../../lib/blizzard";
export default async function Personaggio({ params }) {
  const slug = encodeURIComponent(decodeURIComponent(params.slug));
  const [p, eq] = await Promise.all([bget(`/profile/wow/character/${slug}`), bget(`/profile/wow/character/${slug}/equipment`)]);
  if (!p) return (<><h1>Personaggio non trovato</h1><p className="muted">L'armeria non ha ancora i dati di questo personaggio. Riprova più tardi.</p><a href="/roster">Torna al roster</a></>);
  const items = eq?.equipped_items ?? [];
  return (
    <>
      <h1>{p.name} {p.surname}</h1>
      <p className="muted">Livello {p.level} · {p.character_class?.name} · {p.race?.name} · item level medio {p.average_item_level ?? "—"}</p>
      <div className="panel"><ul className="plain">
        {items.length === 0 && <li className="muted">Equipaggiamento non disponibile.</li>}
        {items.map((i) => (
          <li key={i.slot?.type + i.name}><span style={{color: QUALITY_COLORS[i.quality?.type]}}>{i.name}</span>
          <span className="muted">{i.slot?.name} · ilvl {i.level?.value}</span></li>))}
      </ul></div>
      <a href="/roster">Torna al roster</a>
    </>
  );
}
