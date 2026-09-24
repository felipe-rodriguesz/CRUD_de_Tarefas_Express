# Gerenciador de tarefas

Aplicação web de gerenciamento de tarefas com contas de usuário. Cada pessoa pode criar uma conta, entrar e administrar as próprias tarefas pela interface ou pela API.

## Funcionalidades

- Cadastro e login com e-mail e senha.
- Criação, edição, conclusão e exclusão de tarefas.
- Busca por título ou descrição, com paginação disponível na API.
- Interface responsiva com tema claro e escuro.
- Documentação interativa da API em `/api-docs`.

## Tecnologias

- **Servidor e API:** Node.js, Express 5 (ES Modules).
- **Interface:** HTML, CSS e JavaScript sem framework; Tailwind CSS e Lucide carregados por CDN.
- **Persistência:** PostgreSQL acessado pelo pacote `pg`.
- **Autenticação:** bcryptjs para hash de senha e JWT em cookie `HttpOnly`.
- **Segurança HTTP e limites:** Helmet, CORS configurável e express-rate-limit.
- **Documentação da API:** Swagger JSDoc e Swagger UI.
- **Testes:** Jest e Supertest.

## Organização

```text
src/
  app.js          Configuração do Express, middlewares, arquivos estáticos e Swagger
  server.js       Inicialização do servidor HTTP
  routes.js       Rotas da API e validações de entrada
  middleware.js   Verificação do JWT nas rotas de tarefas
  funcoes.js      Operações de usuários e tarefas no banco
  database.js     Pool PostgreSQL e criação das tabelas
frontend/
  index.html      Estrutura da interface
  style.css       Estilos complementares
  script.js       Interações e comunicação com a API
tests/
  tasks.test.js   Testes de integração das rotas de tarefas
```

O Express serve os arquivos de `frontend/` e a API no mesmo processo. As rotas `/tasks` exigem autenticação. As consultas de tarefas filtram pelo identificador do usuário autenticado. Na inicialização, a aplicação cria as tabelas `usuarios` e `tarefas` se ainda não existirem.

## Autenticação e segurança implementadas

- As senhas são armazenadas como hash usando bcryptjs.
- No login, a API cria um JWT com validade de uma hora e o envia em um cookie `HttpOnly`; o token não é incluído no JSON de resposta.
- O cookie usa `Secure` quando `NODE_ENV=production` e `SameSite=Lax`.
- As rotas de tarefas verificam o token e filtram operações pelo usuário autenticado.
- Consultas SQL usam parâmetros do `pg`.
- Helmet aplica cabeçalhos HTTP, com a Content Security Policy desativada na configuração atual.
- CORS aceita a origem configurada em `FRONTEND_URL` e o endereço publicado definido no código; requisições sem `Origin` também são aceitas.
- Há limites de requisições global e mais estrito para cadastro e login.
- O schema ativa Row Level Security (RLS), mas não declara políticas RLS. O isolamento documentado neste projeto é feito pelas verificações da API.

O frontend guarda apenas a preferência de tema e o nome exibido na saudação em `localStorage`; o JWT fica no cookie `HttpOnly`.

## Banco de dados

É necessário um banco PostgreSQL acessível pela variável `DATABASE_URL`. Para executar os testes, configure também `TEST_DATABASE_URL` apontando para um banco de testes separado. A suíte esvazia as tabelas `tarefas` e `usuarios` antes de executar; não use a URL do banco de dados de desenvolvimento ou produção nos testes.

## Executar localmente

Requisitos: Node.js e npm, além de um banco PostgreSQL.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo de configuração e informe as URLs do banco e um segredo próprio para `JWT_SECRET`:

   ```bash
   cp .env.example .env
   ```

3. Inicie a aplicação:

   ```bash
   npm start
   ```

4. Abra [http://localhost:3000](http://localhost:3000). A documentação da API fica em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

O servidor usa a porta 3000 por padrão; defina `PORT` para escolher outra porta. O arquivo `.env` não deve ser versionado.

## Testes

```bash
npm test
```

Os testes existentes são testes de integração com Jest e Supertest e precisam de um PostgreSQL configurado em `TEST_DATABASE_URL`. Eles cobrem criação, listagem, atualização, exclusão e isolamento de tarefas entre dois usuários.

## Rotas principais

| Método | Caminho | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/usuarios/cadastro` | Público | Cadastra um usuário |
| `POST` | `/usuarios/login` | Público | Autentica e define o cookie de sessão |
| `POST` | `/usuarios/logout` | Público | Limpa o cookie de sessão |
| `GET` | `/tasks` | Autenticado | Lista tarefas; aceita `search`, `page` e `limit` |
| `POST` | `/tasks` | Autenticado | Cria uma tarefa |
| `PUT` | `/tasks/:id` | Autenticado | Atualiza dados ou status da tarefa |
| `PATCH` | `/tasks/:id/complete` | Autenticado | Marca a tarefa como concluída |
| `DELETE` | `/tasks/:id` | Autenticado | Exclui uma tarefa |

Consulte `/api-docs` para a documentação interativa. A especificação Swagger atual pode não descrever perfeitamente o esquema de autenticação por cookie em todas as rotas.
