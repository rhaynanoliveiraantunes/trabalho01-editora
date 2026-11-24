# Editora

Aplicação para cadastro e listagem de autores e artigos.

**Integrantes:**
- Rhaynan Oliveira Antunes
- Luiz Gabriel Merotto De Lima
- Gabriel Eduardo Beck Paes

## Estrutura do Repositório

- `back/`: API REST desenvolvida em Spring Boot + PostgreSQL. Para mais detalhes, consulte [back/README.md](back/README.md).
- `front/`: Aplicação web desenvolvida em React + Vite. Para mais detalhes, consulte [front/README.md](front/README.md).

## Aplicação online (deploy)

- Front-end (Vercel): https://trabalho01-editora.vercel.app
- API (Render): https://editora-api.onrender.com/editora
- Banco de dados: PostgreSQL hospedado no Render (região Oregon).

Observações:
- A API roda no plano gratuito do Render e "dorme" após 15 minutos sem uso. A primeira requisição depois disso pode levar cerca de 1 minuto para responder.
- O front-end é publicado na Vercel a partir da pasta front/, usando a variável de ambiente VITE_API_URL (https://editora-api.onrender.com/editora).
- A API é publicada no Render a partir da pasta back/, via Docker (back/Dockerfile), configurada pelas variáveis de ambiente DB_URL, DB_USER, DB_PASSWORD e PORT.

## Como executar

### 1. API (Back-end)
Requisitos: Java 17+, PostgreSQL com o banco `editora` criado e a senha ajustada em `back/src/main/resources/application.properties`.

```bash
cd back
./mvnw spring-boot:run
```
A API subirá em: `http://localhost:8000/editora`

Para mais detalhes, consulte [back/README.md](back/README.md).

### 2. Front-end
```bash
cd front
npm install
```

Copiar `.env.example` para `.env`:
- PowerShell (Windows): `copy .env.example .env`
- Linux / macOS: `cp .env.example .env`

Iniciar a aplicação:
```bash
npm run dev
```
O front-end estará disponível em: `http://localhost:5173`

Para mais detalhes, consulte [front/README.md](front/README.md).
