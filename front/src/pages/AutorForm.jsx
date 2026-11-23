import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { Erro } from "../components/Estado.jsx";
import { useFeedback } from "../components/Feedback.jsx";

export default function AutorForm() {
  const navigate = useNavigate();
  const { toast } = useFeedback();
  const [form, setForm] = useState({ nome: "", email: "", biografia: "" });
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await api.criarAutor(form);
      toast("Autor cadastrado!");
      navigate("/autores");
    } catch (e) {
      setErro(e.message);
      setSalvando(false);
    }
  }

  return (
    <section>
      <h2>Novo autor</h2>
      <form onSubmit={enviar} className="form">
        <label>
          Nome
          <input value={form.nome} onChange={set("nome")} required />
        </label>
        <label>
          E-mail
          <input type="email" value={form.email} onChange={set("email")} required />
        </label>
        <label>
          Biografia
          <textarea value={form.biografia} onChange={set("biografia")} rows={4} />
        </label>
        <Erro msg={erro} />
        <div className="acoes">
          <button className="btn" disabled={salvando}>{salvando ? "Salvando…" : "Salvar"}</button>
          <Link to="/autores">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
