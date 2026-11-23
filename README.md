# Editora

Aplicação para cadastro e listagem de autores e artigos.

**Integrantes:**
- Rhaynan Oliveira Antunes
- Luiz Gabriel Merotto De Lima
- Gabriel Eduardo Beck Paes

## Estrutura do Repositório

- `back/`: API REST desenvolvida em Spring Boot + PostgreSQL. Para mais detalhes, consulte [back/README.md](back/README.md).
- `front/`: Aplicação web desenvolvida em React + Vite. Para mais detalhes, consulte [front/README.md](front/README.md).

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
