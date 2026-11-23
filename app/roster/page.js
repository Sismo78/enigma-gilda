import { getRoster, getClassNames, CLASS_COLORS } from "../../lib/blizzard";
export const metadata = { title: "Roster – Ænigmå" };
export default async function Roster() {
  const [roster, classes] = await Promise.all([getRoster(), getClassNames()]);
  return (
    <>
      <h1>Roster</h1>
      {roster.length === 0 && <p className="muted">Nessun membro trovato. Controlla le variabili d'ambiente e riprova tra qualche minuto: i personaggi compaiono solo dal livello 10 e dopo il logout.</p>}
      <div className="scroll"><table>
        <thead><tr><th>Personaggio</th><th>Classe</th><th>Livello</th><th>Rango</th></tr></thead>
        <tbody>{roster.map((c) => (
          <tr key={c.id}>
            <td><a href={`/personaggio/${[c.name, c.surname].filter(Boolean).join("-").toLowerCase()}`} style={{color: CLASS_COLORS[c.playable_class?.id]}}>{c.name} {c.surname}</a></td>
            <td>{classes[c.playable_class?.id] ?? "—"}</td><td>{c.level}</td><td>{c.rank}</td>
          </tr>))}</tbody>
      </table></div>
    </>
  );
}
