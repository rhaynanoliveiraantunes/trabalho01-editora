export function Erro({ msg }) {
  return msg ? <p className="erro" role="alert">{msg}</p> : null;
}
export function Vazio({ children }) {
  return <p className="vazio">{children}</p>;
}
