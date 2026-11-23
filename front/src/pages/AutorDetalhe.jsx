import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import { Erro, Vazio } from "../components/Estado.jsx";

export default function AutorDetalhe() {
  const { id } = useParams();
  const [autor, setAutor] = useState(null);
  const [artigos, setArtigos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([api.obterAutor(id), api.artigosDoAutor(id)])
      .then(([a, ar]) => { setAutor(a); setArtigos(ar); })
      .catch((e) => setErro(e.message));
  }, [id]);

  if (erro) return <Erro msg={erro} />;
  if (!autor) return <p>Carregando…</p>;

  return (
    <section>
      <div className="barra">
        <h2>{autor.nome}</h2>
        <Link to="/autores">← Voltar</Link>
      </div>
      <p><strong>E-mail:</strong> {autor.email}</p>
      {autor.biografia && <p>{autor.biografia}</p>}
      <h3>Artigos</h3>
      {artigos.length === 0 ? (
        <Vazio>Este autor ainda não possui artigos.</Vazio>
      ) : (
        <ul className="cards">
          {artigos.map((a) => (
            <li key={a.id} className="card">
              <div className="card-topo">
                <h3>{a.titulo}</h3>
                <span className={a.publicado ? "tag ok" : "tag"}>{a.publicado ? "Publicado" : "Rascunho"}</span>
              </div>
              <p>{a.resumo}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
