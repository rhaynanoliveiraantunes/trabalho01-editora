// Cliente da API REST (Spring Boot). Base configurável via VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/editora";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    // Chrome: "Failed to fetch", Firefox: "NetworkError...", Safari: "Load failed"
    throw new Error("Não foi possível conectar à API.");
  }
  if (res.status === 204) return null; // sem conteúdo (lista vazia / delete)
  if (!res.ok) {
    const msgs = {
      400: "Dados inválidos.",
      404: "Registro não encontrado.",
      409: "Conflito: e-mail já cadastrado ou autor possui artigos.",
      500: "Erro interno no servidor.",
    };
    throw new Error(msgs[res.status] || `Erro ${res.status}`);
  }
  return res.json();
}

export const listaOuVazia = (p) => request(p).then((d) => d ?? []);

export const api = {
  // Artigos
  listarArtigos: (titulo) =>
    listaOuVazia(titulo ? `/?titulo=${encodeURIComponent(titulo)}` : "/"),
  listarPublicados: () => listaOuVazia("/publicado"),
  obterArtigo: (id) => request(`/${id}`),
  criarArtigo: (a) => request("/", { method: "POST", body: JSON.stringify(a) }),
  atualizarArtigo: (id, a) =>
    request(`/${id}`, { method: "PUT", body: JSON.stringify(a) }),
  excluirArtigo: (id) => request(`/${id}`, { method: "DELETE" }),

  // Autores
  listarAutores: () => listaOuVazia("/api/autores"),
  obterAutor: (id) => request(`/api/autores/${id}`),
  artigosDoAutor: (id) => listaOuVazia(`/api/autores/${id}/artigos`),
  criarAutor: (a) =>
    request("/api/autores", { method: "POST", body: JSON.stringify(a) }),
  excluirAutor: (id) => request(`/api/autores/${id}`, { method: "DELETE" }),
};
