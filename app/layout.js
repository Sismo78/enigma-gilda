import "./globals.css";
export const metadata = { title: "Ænigmå – Gilda di WoW Forever", description: "Roster, equipaggiamento e progressione della gilda Ænigmå" };
export default function Layout({ children }) {
  return (
    <html lang="it"><body>
      <nav><div className="wrap">
        <a className="logo" href="/">Ænigmå</a>
        <a href="/roster">Roster</a><a href="/progressione">Progressione</a>
      </div></nav>
      <main className="wrap">{children}</main>
      <footer className="wrap muted" style={{padding:"40px 20px"}}>Dati dall'armeria ufficiale Blizzard, aggiornati ogni 30 minuti circa.</footer>
    </body></html>
  );
}
