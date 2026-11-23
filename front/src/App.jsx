import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ArtigosList from "./pages/ArtigosList.jsx";
import ArtigoForm from "./pages/ArtigoForm.jsx";
import AutoresList from "./pages/AutoresList.jsx";
import AutorForm from "./pages/AutorForm.jsx";
import AutorDetalhe from "./pages/AutorDetalhe.jsx";

function useTema() {
  const [tema, setTema] = useState(() => {
    try { return localStorage.getItem("tema"); } catch { return null; }
  });
  useEffect(() => {
    if (tema) document.documentElement.dataset.theme = tema;
    try { if (tema) localStorage.setItem("tema", tema); } catch { /* ignora */ }
  }, [tema]);
  const escuro = tema ? tema === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  return [escuro, () => setTema(escuro ? "light" : "dark")];
}

export default function App() {
  const [escuro, alternarTema] = useTema();
  return (
    <>
      <header className="topo">
        <h1>Editora</h1>
        <nav>
          <NavLink to="/painel">Painel</NavLink>
          <NavLink to="/artigos">Artigos</NavLink>
          <NavLink to="/autores">Autores</NavLink>
        </nav>
        <button className="link tema" onClick={alternarTema} aria-label="Alternar tema">{escuro ? "☀️" : "🌙"}</button>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/painel" replace />} />
          <Route path="/painel" element={<Dashboard />} />
          <Route path="/artigos" element={<ArtigosList />} />
          <Route path="/artigos/novo" element={<ArtigoForm />} />
          <Route path="/artigos/:id/editar" element={<ArtigoForm />} />
          <Route path="/autores" element={<AutoresList />} />
          <Route path="/autores/novo" element={<AutorForm />} />
          <Route path="/autores/:id" element={<AutorDetalhe />} />
          <Route path="*" element={<p>Página não encontrada.</p>} />
        </Routes>
      </main>
    </>
  );
}
