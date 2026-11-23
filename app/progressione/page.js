import data from "../../data/progressione.json";
export const metadata = { title: "Progressione – Ænigmå" };
export default function Progressione() {
  return (
    <>
      <h1>Progressione nei raid</h1>
      {data.raids.map((r) => (
        <div className="panel" key={r.nome}>
          <h2 style={{margin:"0 0 4px"}}>{r.nome}</h2>
          <div className="muted">{r.giocatori} giocatori · si sblocca il {r.sblocco}</div>
          <ul className="plain" style={{marginTop:10}}>
            {r.boss.length === 0 && <li className="muted">Nessun boss registrato.</li>}
            {r.boss.map((b) => <li key={b.nome}><span className={b.ucciso ? "done" : ""}>{b.nome}</span><span className="muted">{b.ucciso ? `ucciso il ${b.data}` : "da sconfiggere"}</span></li>)}
          </ul>
        </div>
      ))}
    </>
  );
}
