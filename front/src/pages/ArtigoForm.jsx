import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { Erro } from "../components/Estado.jsx";
import { useFeedback } from "../components/Feedback.jsx";

const inicial = { titulo: "", resumo: "", publicado: true, autorId: "" };

export default function ArtigoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useFeedback();
  const [form, setForm] = useState(inicial);
  const [autores, setAutores] = useState([]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api.listarAutores().then(setAutores).catch((e) => setErro(e.message));
    if (id) {
      api
        .obterArtigo(id)
        .then((a) =>
          setForm({
            titulo: a.titulo,
            resumo: a.resumo,
            publicado: a.publicado,
            autorId: a.autor ? String(a.autor.id) : "",
          })
        )
        .catch((e) => setErro(e.message));
    }
  }, [id]);

  const set = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    if (!form.autorId) return setErro("Selecione um autor.");
    setSalvando(true);
    const payload = { ...form, autorId: Number(form.autorId) };
    try {
      if (id) await api.atualizarArtigo(id, payload);
      else await api.criarArtigo(payload);
      toast(id ? "Artigo atualizado!" : "Artigo cadastrado!");
      navigate("/artigos");
    } catch (e) {
      setErro(e.message);
      setSalvando(false);
    }
  }

  return (
    <section>
      <h2>{id ? "Editar artigo" : "Novo artigo"}</h2>
      <form onSubmit={enviar} className="form">
        <label>
          Título
          <input value={form.titulo} onChange={set("titulo")} maxLength={80} required />
          <small>{form.titulo.length}/80</small>
        </label>
        <label>
          Resumo
          <textarea value={form.resumo} onChange={set("resumo")} rows={5} required />
        </label>
        <label>
          Autor
          <select value={form.autorId} onChange={set("autorId")} required>
            <option value="">Selecione…</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </select>
          {autores.length === 0 && (
            <small>Nenhum autor cadastrado. <Link to="/autores/novo">Cadastrar autor</Link></small>
          )}
        </label>
        <label className="check">
          <input type="checkbox" checked={form.publicado} onChange={set("publicado")} />
          Publicado
        </label>
        <Erro msg={erro} />
        <div className="acoes">
          <button className="btn" disabled={salvando}>{salvando ? "Salvando…" : "Salvar"}</button>
          <Link to="/artigos">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
