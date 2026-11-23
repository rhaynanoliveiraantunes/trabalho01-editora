# Editora — Front-end React

Aplicação ReactJS (Vite + React Router) para cadastro e listagem de **autores** e **artigos**, consumindo a API REST `trabalho01-editora` (Spring Boot + PostgreSQL).

**Integrantes:** Rhaynan Oliveira Antunes, Luiz Gabriel Merotto De Lima, Gabriel Eduardo Beck Paes

## Como executar

### 1. API (Spring Boot)
Consulte as instruções e requisitos de execução na pasta [../back](../back/README.md).

### 2. Front-end
```bash
npm install
copy .env.example .env    # Windows; ajuste VITE_API_URL se necessário
npm run dev              # http://localhost:5173
```

## Funcionalidades
- **Painel** com totais (artigos, publicados, rascunhos, autores) e ranking de autores
- Busca no título e no resumo (com destaque), filtros por autor e status (publicados, rascunhos, favoritos), ordenação, paginação, visualização em grade/lista e **exportação para CSV**
- **Favoritos** (★) salvos no navegador e atalho `/` para buscar
- **Publicar/despublicar** com um clique
- Notificações (toasts) e diálogo de confirmação ao excluir
- Tema claro/escuro (automático ou manual) e layout responsivo
- Listar, buscar por título, filtrar publicados, cadastrar, editar e excluir **artigos**
- Listar, cadastrar, excluir e ver detalhes (com seus artigos) de **autores**
- Tratamento de erros da API (409, 404, falha de conexão) e estados de carregamento/lista vazia

## Descrição da API

Base URL: `http://localhost:8000/editora` (CORS aceita qualquer origem por padrão no desenvolvimento)

Em produção, defina `VITE_API_URL` como a URL pública do back-end com `/editora` no final. Ao publicar no Vercel, use `front` como Root Directory, `npm run build` como comando de build e `dist` como diretório de saída; configure a variável em **Settings > Environment Variables** e faça novo deploy. O arquivo `vercel.json` habilita o acesso direto às rotas internas do React.

O back-end não é hospedado pelo Vercel neste projeto. Publique-o em um serviço Java/Docker (por exemplo, Render) com PostgreSQL externo e configure `CORS_ALLOWED_ORIGINS` com o domínio do Vercel. Veja o passo a passo no [README principal](../README.md#publicação).

### Modelos
**Autor**
```json
{ "id": 1, "nome": "Maria", "email": "maria@exemplo.com", "biografia": "texto opcional", "artigos": [] }
```
**Artigo** (resposta)
```json
{ "id": 1, "titulo": "Título (máx. 80)", "resumo": "texto", "publicado": true, "autor": { "id": 1, "nome": "Maria", "email": "...", "biografia": "..." } }
```
**ArtigoRequest** (corpo de POST/PUT)
```json
{ "titulo": "string", "resumo": "string", "publicado": true, "autorId": 1 }
```

### Artigos
| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| GET | `/` | Lista artigos; aceita `?titulo=` (busca parcial, sem diferenciar maiúsculas) | 200, 204 (vazio) |
| GET | `/{id}` | Obtém um artigo | 200, 404 |
| POST | `/` | Cria artigo (`autorId` obrigatório) | 201, 400, 404 (autor inexistente) |
| PUT | `/{id}` | Atualiza artigo | 200, 404 |
| DELETE | `/{id}` | Remove artigo | 204 |
| DELETE | `/` | Remove todos os artigos | 204 |
| GET | `/publicado` | Lista artigos publicados | 200, 204 |

### Autores
| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| GET | `/api/autores` | Lista autores | 200 |
| GET | `/api/autores/{id}` | Obtém um autor | 200, 404 |
| GET | `/api/autores/{id}/artigos` | Artigos do autor | 200, 404 |
| POST | `/api/autores` | Cria autor (`nome` e `email` obrigatórios; e-mail único) | 201, 400, 409 |
| DELETE | `/api/autores/{id}` | Remove autor (falha se tiver artigos) | 204, 404, 409 |

## Estrutura
```
front/src/
  api.js            # cliente HTTP da API
  App.jsx           # rotas
  pages/            # ArtigosList, ArtigoForm, AutoresList, AutorForm, AutorDetalhe
  components/       # Estado (erro / lista vazia)
```
