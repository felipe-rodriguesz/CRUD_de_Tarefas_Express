# 🚀 Full Stack Task Manager - Node.js, Express & Vanilla JS (Secure Edition)

🌍 **Acesse a aplicação ao vivo:** [https://crud-de-tarefas-express.onrender.com](https://crud-de-tarefas-express.onrender.com)

## 📌 Sobre o projeto
Um sistema completo (Full Stack) de gerenciamento de tarefas que evoluiu de uma API básica para uma aplicação web robusta, com foco extremo em **Segurança (Security by Design)**. 
O **Backend** é construído com Node.js e Express, utilizando arquitetura **Multi-tenant** e dupla camada de segurança (RLS no banco e Middleware na API). 
O **Frontend** foi construído com HTML, **Tailwind CSS** e Vanilla JavaScript, sendo servido diretamente pelo Express e autenticado via **Cookies HttpOnly**.

## ⚙️ Funcionalidades e Segurança
### Backend (API)
- **Autenticação Segura:** Cadastro com validação forte de senhas (>6 chars), hash via Bcrypt e emissão de JWT armazenado em **Cookies HttpOnly** (proteção total contra roubo de tokens via XSS).
- **Rate Limiting:** Prevenção contra ataques de força bruta (limite de 15 requisições de auth) e DDoS (limite global de 200 requisições).
- **Proteção de Headers:** Implementação do `Helmet` para segurança nativa no Express (proteção contra Clickjacking e Sniffing).
- **Proteção contra Injections:** Consultas 100% blindadas contra SQL Injection usando *Prepared Statements* (`pg`).
- **Multi-tenant & RLS:** Isolamento completo de dados por usuário. O banco de dados no Supabase está com **Row Level Security (RLS)** ativado, barrando qualquer acesso não autorizado diretamente na raiz dos dados.
- **Testes Automatizados:** Cobertura de testes End-to-End (E2E) com Jest e Supertest que validam todas as regras de segurança e isolamento.

### Frontend (Interface Web)
- **Single Page Application (SPA):** Transições de tela (Login -> Tarefas) e persistência de sessão utilizando leitura de rotas protegidas (Session Check), sem o uso de `localStorage` para dados sensíveis.
- **Design Premium (Figma-like):** Interface polida com Tailwind CSS, fundo dividido (split background), tipografia fluida e responsividade nativa para Mobile e Desktop.
- **Dark Mode Profundo:** Tema escuro ativado por botão.
- **Componentes Customizados:** Substituição total de `alert()`, `confirm()` e `prompt()` nativos por **Toast Notifications**, **Modais de Confirmação** e **Modais de Edição** criados do zero.
- **Experiência do Usuário (UX):** Skeleton loading, saudação dinâmica, proteção de duplo clique em formulários e ícones Lucide.

## 💻 Tecnologias
### Backend & Segurança
- **Node.js & Express** (Servidor Web)
- **PostgreSQL / Supabase** (Banco de Dados em Nuvem)
- **pg & pg-pool** (Driver com Prepared Statements)
- **JSON Web Token (JWT) & Bcryptjs** (Segurança Criptográfica)
- **Cookie-Parser & Express-Rate-Limit** (Tratamento de Sessão e Limites)
- **Helmet** (Segurança de HTTP Headers)
- **Jest & Supertest** (Testes Automatizados)

### Frontend
- **HTML5 & Vanilla JavaScript** (Estrutura e Lógica DOM)
- **Tailwind CSS** (Estilização Utilitária e Responsiva)
- **Lucide Icons** (Ícones SVG Vetoriais)

## 🚀 Como executar localmente
1. Clone este repositório:
   ```bash
   git clone https://github.com/felipe-rodriguesz/CRUD_de_Tarefas_Express.git
   ```
2. Instale as dependências do servidor:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:
   ```env
   DATABASE_URL=Sua_Url_Do_Supabase
   TEST_DATABASE_URL=Sua_Url_De_Testes_Do_Supabase
   JWT_SECRET=Seu_Segredo_Forte
   PORT=3000
   ```
4. Inicie o servidor Backend:
   ```bash
   npm start
   ```
5. O servidor Backend e o Frontend irão rodar juntos! Basta acessar no seu navegador:
   **[http://localhost:3000](http://localhost:3000)**

*(O Express agora serve a pasta `frontend` automaticamente, eliminando a necessidade da extensão Live Server).*

## 🛣️ Rotas da API (Visão Geral)
- `POST /usuarios/cadastro` - Cria um novo usuário
- `POST /usuarios/login` - Autentica e gera o Cookie HttpOnly
- `POST /usuarios/logout` - Limpa o Cookie HttpOnly, finalizando a sessão
- `GET /tasks` - Lista as tarefas do usuário (com paginação/busca)
- `POST /tasks` - Cria tarefa
- `PUT /tasks/:id` - Atualiza o texto da tarefa
- `PATCH /tasks/:id/complete` - Marca como concluída
- `DELETE /tasks/:id` - Remove a tarefa

## 🧠 O que aprendi (Auditoria de Segurança: "Never Trust AI")
Neste projeto, a aplicação passou por uma rigorosa **auditoria de segurança de 11 partes**, evoluindo de um protótipo para um produto sólido para produção:
- **Mitigação de XSS (Cross-Site Scripting):** Aprendi a remover tokens JWT do `localStorage` (onde ficam vulneráveis a scripts maliciosos) e migrá-los para **Cookies HttpOnly**, onde o JavaScript do navegador não tem acesso.
- **Defesa em Profundidade:** Implementação de camadas múltiplas de segurança. Além de verificar a autorização no Node.js (via `usuario_id`), ativamos o **Row Level Security (RLS)** diretamente no Supabase.
- **Prevenção de Abusos e DDoS:** Configuração de **Rate Limiting** para impedir ataques de força bruta no Login e esgotamento de recursos em toda a API.
- **Ocultação de Informações Sensíveis (Information Disclosure):** Uso do `Helmet` para ofuscar headers do Express, e tratamento global de erros no backend para evitar o vazamento de Stack Traces ou queries SQL para o cliente.
- **Proteção contra SQL Injection:** Garantia de uso estrito de queries parametrizadas (ex: `$1, $2`) invés de concatenação de strings na biblioteca `pg`.
