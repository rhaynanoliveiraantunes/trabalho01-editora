
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

Requisitos: Java 17+ e PostgreSQL com o banco `editora` criado. Por padrão, o back usa `localhost:5432`, usuário `postgres`, senha `SENHA` e porta `8000`. Configure credenciais diferentes pelas variáveis `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` e `SPRING_DATASOURCE_PASSWORD`; `PORT` também pode substituir a porta da API.

```bash
cd back
.\mvnw.cmd spring-boot:run
```

A API subirá em `http://localhost:8000/editora`.

Para mais detalhes, consulte [back/README.md](back/README.md).

### 2. Front-end

```bash
cd front
npm install
copy .env.example .env
npm run dev
```

O front-end ficará disponível em `http://localhost:5173` e consumirá a API definida em `VITE_API_URL` no arquivo `.env`.

Para mais detalhes, consulte [front/README.md](front/README.md).

## Publicação

O Vercel publica o front-end Vite; a API Spring Boot e o PostgreSQL precisam estar hospedados separadamente. Um caminho simples é usar Vercel para o front-end e Render para o back-end e o banco.

1. No Render, crie um PostgreSQL e anote o host, a porta, o nome do banco, o usuário e a senha.
2. Crie um Web Service usando este repositório, com **Root Directory** `back`, **Environment** `Docker` e o Dockerfile existente.
3. Configure no serviço do back:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://HOST:PORTA/NOME_DO_BANCO?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`: usuário do banco
   - `SPRING_DATASOURCE_PASSWORD`: senha do banco
   - `CORS_ALLOWED_ORIGINS`: domínio do front no Vercel, por exemplo `https://seu-projeto.vercel.app` (sem barra no final). Para mais de um domínio, separe-os por vírgula.

   O Render fornece a porta em `PORT`; o back já a utiliza automaticamente. Espere o deploy concluir e confirme que a API está disponível em `https://SEU-SERVICO.onrender.com/editora`.
4. No Vercel, importe o mesmo repositório e defina **Root Directory** como `front`. O comando de build é `npm run build` e o diretório de saída é `dist`.
5. Nas configurações do projeto Vercel, adicione a variável de ambiente `VITE_API_URL` com a URL completa da API, incluindo o contexto: `https://SEU-SERVICO.onrender.com/editora`. Faça um novo deploy após salvar a variável.
6. Abra o endereço do Vercel e teste listagem e cadastro de autores/artigos. O arquivo `front/vercel.json` permite que rotas da aplicação, como `/artigos`, também abram diretamente.

Não publique credenciais do banco no repositório. O valor local de `VITE_API_URL` fica em `front/.env`; no Vercel, configure-o no painel de variáveis de ambiente.
