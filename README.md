# 🚀 Full Stack Task Manager - Node.js, Express & Vanilla JS

## 📌 Sobre o projeto
Um sistema completo (Full Stack) de gerenciamento de tarefas, evoluído de uma API isolada para uma aplicação web com interface visual. 
O **Backend** é construído com Node.js e Express, utilizando arquitetura **Multi-tenant** e autenticação segura via JWT. 
O **Frontend** foi construído do zero utilizando HTML, CSS Moderno (com variáveis, animações e Dark Mode) e Vanilla JavaScript, consumindo diretamente a API REST.

## ⚙️ Funcionalidades
### Backend (API)
- **Autenticação:** Cadastro e Login com Senhas Criptografadas (Bcrypt) e emissão de JWT.
- **Multi-tenant:** Isolamento completo de dados por usuário.
- **Paginação e Busca:** Listagem de tarefas otimizada via Query Params.
- **CRUD Completo:** Criação, Edição, Atualização de Status e Remoção de tarefas no Banco de Dados.
- **Testes Automatizados:** Cobertura de testes End-to-End (E2E) com Jest e Supertest.
- **Documentação Interativa:** Portal Swagger na rota `/api-docs`.

### Frontend (Interface Web)
- **Single Page Application (SPA):** Transições de tela (Login -> Tarefas) sem recarregar a página.
- **Consumo de API:** Integração completa usando `fetch()` e injeção do cabeçalho `Authorization`.
- **Design Moderno:** Uso de variáveis CSS, Glassmorphism e CSS Reset.
- **Dark Mode:** Tema claro/escuro com preferência salva no `localStorage`.
- **Experiência do Usuário (UX):** Skeleton loading enquanto busca dados, ícones Lucide e visibilidade de senhas.
- **Feedback visual:** Tratamento de erros de conexão e estado de loading.

## 💻 Tecnologias
### Backend
- **Node.js & Express** (Servidor Web)
- **PostgreSQL / Supabase** (Banco de Dados em Nuvem)
- **pg & pg-pool** (Driver)
- **JSON Web Token (JWT) & Bcryptjs** (Segurança)
- **Jest & Supertest** (Testes)
- **Swagger / OpenAPI** (Documentação)

### Frontend
- **HTML5 & CSS3** (Estrutura e Estilização Nativa)
- **Vanilla JavaScript** (Lógica, DOM e chamadas HTTP)
- **Lucide Icons** (Ícones SVG Vetoriais)
- **Google Fonts** (Tipografia Inter)

## 🚀 Como executar localmente
1. Clone este repositório:
   ```bash
   git clone https://github.com/felipe-rodriguesz/CRUD_de_Tarefas_Express.git
   ```
2. Instale as dependências do servidor:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto e configure a variável `DATABASE_URL` com a sua string de conexão do PostgreSQL.
4. Inicie o servidor Backend:
   ```bash
   npm start
   ```
5. O servidor Backend rodará em `http://localhost:3000`.
6. Para abrir o **Frontend**, basta dar dois cliques no arquivo `frontend/index.html` ou usar a extensão "Live Server" do VSCode. O JavaScript interno está configurado para se comunicar automaticamente com a porta 3000.

## 🛣️ Rotas da API (Visão Geral)
- `POST /usuarios/cadastro` - Cria um novo usuário
- `POST /usuarios/login` - Autentica e retorna o JWT
- `GET /tasks` - Lista as tarefas do usuário (com paginação/busca)
- `POST /tasks` - Cria tarefa
- `PUT /tasks/:id` - Atualiza o texto da tarefa (ou status pendente)
- `PATCH /tasks/:id/complete` - Marca como concluída
- `DELETE /tasks/:id` - Remove a tarefa

## 🧠 O que aprendi
Neste projeto, a aplicação evoluiu de um simples script backend para um produto Full Stack funcional. Os principais aprendizados foram:
- **Integração Front e Back:** Compreensão profunda de como clientes HTTP (`fetch`) se comunicam com APIs, gerenciando Promessas (`async/await`) e cabeçalhos de autenticação (`Bearer Token`).
- **Arquitetura de UI:** Manipulação do DOM (Document Object Model) via JavaScript puro, construindo elementos (`createElement`, `innerHTML`) baseados em arrays de objetos do banco de dados.
- **Estilização Moderna:** Criação de um Design System básico em CSS puro usando `:root` para gerenciar as cores de Dark/Light mode sem necessitar de frameworks pesados.
- **Persistência no Cliente:** Uso do `localStorage` para manter o usuário logado e lembrar as preferências de tema da interface.
- **Segurança de APIs:** Proteção real de endpoints com validação de Tokens JWT no middleware do Node.js, impedindo vazamento de dados (Multi-tenant).
