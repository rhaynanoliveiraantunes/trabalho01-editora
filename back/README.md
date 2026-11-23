Integrantes: Rhaynan Oliveira Antunes
             Luiz Gabriel Merotto De Lima
             Gabriel Eduardo Beck Paes

## Como executar

Requisitos: Java 17+ e PostgreSQL com o banco `editora` criado. As propriedades de conexão têm valores locais padrão e podem ser substituídas pelas variáveis `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` e `SPRING_DATASOURCE_PASSWORD`. A porta pode ser definida por `PORT` (padrão `8000`).

```bash
.\mvnw.cmd spring-boot:run   # Windows: sobe em http://localhost:8000/editora
```

`CORS_ALLOWED_ORIGINS` define as origens autorizadas (padrão `*`, apropriado para desenvolvimento local). Em produção, configure o domínio do front-end, sem barra no final. Há um `Dockerfile` nesta pasta para publicar o back-end em um serviço com suporte a Docker.

## Descrição da API

Base URL: `http://localhost:8000/editora` (CORS liberado para qualquer origem)

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

## Modelo de dados

![Tabelas no pgAdmin](docs/pgadmin-tabelas.png)
