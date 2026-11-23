import { createContext, useCallback, useContext, useRef, useState } from "react";

const Ctx = createContext(null);
export const useFeedback = () => useContext(Ctx);

// Fornece toasts e um diálogo de confirmação (promessa) para o app inteiro.
export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dlg, setDlg] = useState(null);
  const resolver = useRef(null);

  const toast = useCallback((msg, tipo = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tipo }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const confirmar = useCallback(
    (msg) => new Promise((res) => { resolver.current = res; setDlg(msg); }),
    []
  );
  const fechar = (v) => { resolver.current?.(v); setDlg(null); };

  return (
    <Ctx.Provider value={{ toast, confirmar }}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast ${t.tipo}`}>{t.msg}</div>)}
      </div>
      {dlg && (
        <div className="overlay" onClick={() => fechar(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <p>{dlg}</p>
            <div className="acoes">
              <button className="btn perigo-bg" autoFocus onClick={() => fechar(true)}>Excluir</button>
              <button className="link" onClick={() => fechar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
