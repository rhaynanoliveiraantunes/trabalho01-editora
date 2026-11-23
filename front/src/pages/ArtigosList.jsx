import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { Erro, Vazio } from "../components/Estado.jsx";
import { useFeedback } from "../components/Feedback.jsx";
import { useFavoritos } from "../useFavoritos.js";

const POR_PAGINA = 6;

// Destaca o termo buscado dentro do texto.
function Destaque({ texto, termo }) {
  if (!termo) return texto;
  const i = texto.toLowerCase().indexOf(termo.toLowerCase());
  if (i < 0) return texto;
  return (
    <>
      {texto.slice(0, i)}<mark>{texto.slice(i, i + termo.length)}</mark>{texto.slice(i + termo.length)}
    </>
  );
}

export default function ArtigosList() {
  const { toast, confirmar } = useFeedback();
  const [favoritos, alternarFav] = useFavoritos();
  const buscaRef = useRef(null);
  const [artigos, setArtigos] = useState([]);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("todos"); // todos | publicados | rascunhos | favoritos
  const [autorId, setAutorId] = useState("");
  const [ordem, setOrdem] = useState("titulo");
  const [grade, setGrade] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setErro("");
    try {
      setArtigos(await api.listarArtigos());
    } catch (e) {
      setErro(e.message === "Failed to fetch" ? "Não foi possível conectar à API." : e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => { setPagina(1); }, [busca, status, autorId, ordem]);

  // Atalho: tecla "/" foca a busca
  useEffect(() => {
    const h = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        buscaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const autores = useMemo(() => {
    const m = new Map();
    artigos.forEach((a) => a.autor && m.set(a.autor.id, a.autor.nome));
    return [...m];
  }, [artigos]);

  const termo = busca.trim();
  const filtrados = useMemo(() => {
    const t = termo.toLowerCase();
    const l = artigos.filter(
      (a) =>
        (!t || a.titulo.toLowerCase().includes(t) || (a.resumo || "").toLowerCase().includes(t)) &&
        (!autorId || String(a.autor?.id) === autorId) &&
        (status === "todos" ||
          (status === "publicados" && a.publicado) ||
          (status === "rascunhos" && !a.publicado) ||
          (status === "favoritos" && favoritos.includes(a.id)))
    );
    const cmp = {
      titulo: (a, b) => a.titulo.localeCompare(b.titulo, "pt", { numeric: true }),
      autor: (a, b) => (a.autor?.nome || "").localeCompare(b.autor?.nome || "", "pt", { numeric: true }),
      recentes: (a, b) => b.id - a.id,
    };
    return l.sort(cmp[ordem]);
  }, [artigos, termo, autorId, status, ordem, favoritos]);

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const pg = Math.min(pagina, paginas); // evita página inexistente após excluir/desfavoritar
  const visiveis = filtrados.slice((pg - 1) * POR_PAGINA, pg * POR_PAGINA);

  async function excluir(a) {
    if (!(await confirmar(`Excluir o artigo "${a.titulo}"?`))) return;
    try { await api.excluirArtigo(a.id); toast("Artigo excluído."); carregar(); }
    catch (e) { toast(e.message, "erro"); }
  }

  async function alternarPublicado(a) {
    try {
      await api.atualizarArtigo(a.id, { titulo: a.titulo, resumo: a.resumo, publicado: !a.publicado, autorId: a.autor?.id });
      toast(a.publicado ? "Movido para rascunho." : "Artigo publicado!");
      carregar();
    } catch (e) { toast(e.message, "erro"); }
  }

  function exportarCsv() {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const linhas = [["id", "titulo", "resumo", "publicado", "autor"], ...filtrados.map((a) => [a.id, a.titulo, a.resumo, a.publicado ? "sim" : "não", a.autor?.nome])];
    const blob = new Blob(["\ufeff" + linhas.map((l) => l.map(esc).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), { href: url, download: "artigos.csv" }).click();
    URL.revokeObjectURL(url);
  }

  function limpar() { setBusca(""); setStatus("todos"); setAutorId(""); setOrdem("titulo"); }
  const filtrando = termo || status !== "todos" || autorId;

  return (
    <section>
      <div className="barra">
        <h2>Artigos <small>({filtrados.length})</small></h2>
        <div className="acoes">
          <button className="link" onClick={exportarCsv} disabled={!filtrados.length}>Exportar CSV</button>
          <Link className="btn" to="/artigos/novo">+ Novo artigo</Link>
        </div>
      </div>

      <div className="filtros">
        <input ref={buscaRef} placeholder='Buscar no título e no resumo… (tecle "/")' value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select value={autorId} onChange={(e) => setAutorId(e.target.value)}>
          <option value="">Todos os autores</option>
          {autores.map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
        </select>
        <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
          <option value="titulo">Título (A–Z)</option>
          <option value="autor">Autor (A–Z)</option>
          <option value="recentes">Mais recentes</option>
        </select>
      </div>
      <div className="chips">
        {[["todos", "Todos"], ["publicados", "Publicados"], ["rascunhos", "Rascunhos"], ["favoritos", `★ Favoritos (${favoritos.length})`]].map(([v, rot]) => (
          <button key={v} className={status === v ? "chip ativo" : "chip"} onClick={() => setStatus(v)}>{rot}</button>
        ))}
        <span className="espaco" />
        {filtrando && <button className="link" onClick={limpar}>Limpar filtros</button>}
        <button className="link" onClick={() => setGrade(!grade)}>{grade ? "☰ Lista" : "▦ Grade"}</button>
      </div>

      <Erro msg={erro} />
      {carregando ? (
        <ul className="cards">{[1, 2, 3].map((i) => <li key={i} className="card skeleton" />)}</ul>
      ) : visiveis.length === 0 && !erro ? (
        <Vazio>Nenhum artigo encontrado.</Vazio>
      ) : (
        <ul className={grade ? "cards grade" : "cards"}>
          {visiveis.map((a) => {
            const fav = favoritos.includes(a.id);
            return (
              <li key={a.id} className="card">
                <div className="card-topo">
                  <h3><Destaque texto={a.titulo} termo={termo} /></h3>
                  <div className="acoes">
                    <span className={a.publicado ? "tag ok" : "tag"}>{a.publicado ? "Publicado" : "Rascunho"}</span>
                    <button className={fav ? "estrela on" : "estrela"} onClick={() => alternarFav(a.id)} aria-label={fav ? "Remover dos favoritos" : "Favoritar"}>★</button>
                  </div>
                </div>
                <p><Destaque texto={a.resumo || ""} termo={termo} /></p>
                <small>Autor: {a.autor ? <Link to={`/autores/${a.autor.id}`}>{a.autor.nome}</Link> : "—"}</small>
                <div className="acoes">
                  <Link to={`/artigos/${a.id}/editar`}>Editar</Link>
                  <button className="link" onClick={() => alternarPublicado(a)}>{a.publicado ? "Despublicar" : "Publicar"}</button>
                  <button className="link perigo" onClick={() => excluir(a)}>Excluir</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {paginas > 1 && (
        <div className="paginacao">
          <button className="link" disabled={pg === 1} onClick={() => setPagina(pg - 1)}>← Anterior</button>
          <span>{pg} / {paginas}</span>
          <button className="link" disabled={pg === paginas} onClick={() => setPagina(pg + 1)}>Próxima →</button>
        </div>
      )}
    </section>
  );
}
