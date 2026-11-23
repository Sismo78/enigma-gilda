import { getRoster, getClassNames, CLASS_COLORS } from "../lib/blizzard";
import data from "../data/progressione.json";
export default async function Home() {
  const [roster, classes] = await Promise.all([getRoster(), getClassNames()]);
  const top = [...roster].sort((a, b) => b.level - a.level).slice(0, 5);
  return (
    <>
      <section className="hero">
        <h1>Ænigmå</h1>
        <p>Gilda di World of Warcraft: Forever, regione EU. Qui trovi il roster, l'equipaggiamento dei membri e la nostra progressione nei raid.</p>
      </section>
      <div className="panel"><strong>{roster.length}</strong> membri in gilda</div>
      <h2>I personaggi di livello più alto</h2>
      <div className="panel"><ul className="plain">
        {top.length === 0 && <li className="muted">Roster non disponibile al momento.</li>}
        {top.map((c) => (
          <li key={c.id}><a href={`/personaggio/${[c.name, c.surname].filter(Boolean).join("-").toLowerCase()}`} style={{color: CLASS_COLORS[c.playable_class?.id]}}>{c.name} {c.surname}</a>
          <span className="muted">{classes[c.playable_class?.id] ?? ""} · livello {c.level}</span></li>
        ))}
      </ul></div>
      <h2>Ultimi traguardi</h2>
      <div className="panel"><ul className="plain">
        {data.traguardi.map((t) => <li key={t.titolo}><span>{t.titolo}</span><span className="muted">{t.data}</span></li>)}
      </ul></div>
    </>
  );
}
