import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { Erro, Vazio } from "../components/Estado.jsx";
import { useFeedback } from "../components/Feedback.jsx";

export default function AutoresList() {
  const { toast, confirmar } = useFeedback();
  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setAutores(await api.listarAutores());
      setErro("");
    } catch (e) {
      setErro(e.message === "Failed to fetch" ? "Não foi possível conectar à API." : e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function excluir(a) {
    if (!(await confirmar(`Excluir o autor "${a.nome}"?`))) return;
    try {
      await api.excluirAutor(a.id);
      toast("Autor excluído.");
      carregar();
    } catch (e) {
      toast(e.message, "erro");
    }
  }

  return (
    <section>
      <div className="barra">
        <h2>Autores</h2>
        <Link className="btn" to="/autores/novo">+ Novo autor</Link>
      </div>
      <Erro msg={erro} />
      {carregando ? (
        <p>Carregando…</p>
      ) : autores.length === 0 && !erro ? (
        <Vazio>Nenhum autor cadastrado.</Vazio>
      ) : (
        <table>
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Artigos</th><th></th></tr>
          </thead>
          <tbody>
            {autores.map((a) => (
              <tr key={a.id}>
                <td><Link to={`/autores/${a.id}`}>{a.nome}</Link></td>
                <td>{a.email}</td>
                <td>{a.artigos?.length ?? 0}</td>
                <td><button className="link perigo" onClick={() => excluir(a)}>Excluir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
