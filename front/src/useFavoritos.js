import { useCallback, useEffect, useState } from "react";

const KEY = "favoritos";
const ler = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};

// Favoritos ficam salvos no navegador (localStorage), sem precisar da API.
export function useFavoritos() {
  const [ids, setIds] = useState(ler);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* ignora */ }
  }, [ids]);
  const alternar = useCallback(
    (id) => setIds((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id])),
    []
  );
  return [ids, alternar];
}
