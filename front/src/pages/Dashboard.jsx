import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { Erro } from "../components/Estado.jsx";
import { useFavoritos } from "../useFavoritos.js";

export default function Dashboard() {
  const [artigos, setArtigos] = useState([]);
  const [autores, setAutores] = useState([]);
  const [erro, setErro] = useState("");
  const [favoritos] = useFavoritos();

  useEffect(() => {
    Promise.all([api.listarArtigos(), api.listarAutores()])
      .then(([ar, au]) => { setArtigos(ar); setAutores(au); })
      .catch((e) => setErro(e.message === "Failed to fetch" ? "Não foi possível conectar à API." : e.message));
  }, []);

  const pub = artigos.filter((a) => a.publicado).length;
  const ranking = useMemo(() => {
    const m = new Map();
    artigos.forEach((a) => a.autor && m.set(a.autor.id, { ...a.autor, n: (m.get(a.autor.id)?.n || 0) + 1 }));
    return [...m.values()].sort((a, b) => b.n - a.n).slice(0, 5);
  }, [artigos]);
  const max = ranking[0]?.n || 1;

  return (
    <section>
      <h2>Painel</h2>
      <Erro msg={erro} />
      <div className="stats">
        <div className="stat"><b>{artigos.length}</b><span>Artigos</span></div>
        <div className="stat"><b>{pub}</b><span>Publicados</span></div>
        <div className="stat"><b>{artigos.length - pub}</b><span>Rascunhos</span></div>
        <div className="stat"><b>{autores.length}</b><span>Autores</span></div>
        <div className="stat"><b>{favoritos.length}</b><span>Favoritos ★</span></div>
      </div>
      {artigos.length > 0 && (
        <div className="donut-box">
          <div className="donut" style={{ background: `conic-gradient(var(--ok) ${(pub / artigos.length) * 360}deg, var(--line) 0)` }}>
            <span>{Math.round((pub / artigos.length) * 100)}%</span>
          </div>
          <p>dos artigos estão publicados<br /><small>{pub} de {artigos.length}</small></p>
        </div>
      )}
      <h3>Autores com mais artigos</h3>
      {ranking.length === 0 ? <p className="vazio">Sem dados ainda.</p> : (
        <ul className="barras">
          {ranking.map((r) => (
            <li key={r.id}>
              <Link to={`/autores/${r.id}`}>{r.nome}</Link>
              <div className="barra-bg"><div className="barra-fg" style={{ width: `${(r.n / max) * 100}%` }} /></div>
              <span>{r.n}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
