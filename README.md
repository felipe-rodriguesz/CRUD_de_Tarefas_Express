# 🚀 Tasks CRUD API - Node.js

![Demonstração da API](./print.png)

## 📌 Sobre o projeto
API REST para gerenciamento de tarefas, desenvolvida utilizando **Node.js puro** (sem frameworks como Express) com o objetivo de praticar os fundamentos do desenvolvimento backend.

## ⚙️ Funcionalidades
- Criar tarefas
- Listar tarefas
- Filtrar tarefas por título e descrição
- Atualizar tarefas por completo
- Remover tarefas
- Marcar tarefas como concluídas

## 💻 Tecnologias
- Node.js
- JavaScript
- HTTP (Módulo Nativo)
- JSON e File System
- Insomnia
- Git/GitHub

## 🚀 Como executar
1. Clone este repositório:
   ```bash
   git clone [https://github.com/felipe-rodriguesz/nodejs-tasks-api.git]
   ```
2. Instale as dependências (O projeto é construído apenas com a biblioteca padrão do Node.js, não sendo necessário `npm install`).
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. A API estará escutando na porta `http://localhost:3000`.

*(Dica: Você pode importar o arquivo `insomnia.json` presente neste repositório diretamente no seu aplicativo Insomnia para ter todas as requisições configuradas!)*

## 🛣️ Rotas da API

| Método | Rota | Descrição | Exemplo de Body |
|---|---|---|---|
| `POST` | `/tasks` | Cria uma nova tarefa | `{"titulo": "Node", "descricao": "Estudar"}` |
| `GET` | `/tasks` | Lista as tarefas (Aceita `?search=`) | *Nenhum* |
| `PUT` | `/tasks/:id` | Atualiza o título e descrição | `{"titulo": "Novo", "descricao": "Novo"}` |
| `PATCH`| `/tasks/:id/complete` | Marca a tarefa como concluída | *Nenhum* |
| `DELETE`| `/tasks/:id` | Exclui a tarefa do banco | *Nenhum* |

## 💡 Exemplos de uso (JSON)

**Criando uma Tarefa (`POST /tasks`)**
```json
{
  "titulo": "Estudar Node.js",
  "descricao": "Revisar os conceitos de File System e HTTP"
}
```

**Filtrando Tarefas (`GET /tasks?search=Node`)**
A API vasculha o banco e retorna apenas as tarefas que possuam a palavra "Node" no título ou na descrição (ignorando letras maiúsculas ou minúsculas).

## 🧠 O que aprendi
Desenvolver uma API sem frameworks me forçou a entender como a internet realmente funciona "por debaixo dos panos". Neste projeto eu apliquei e consolidei os seguintes conhecimentos:
- **Construção de API REST:** Entendimento profundo de Status Codes, Request/Response e verbos HTTP.
- **Organização de backend:** Refatoração de um script único para uma arquitetura modular com separação de responsabilidades (Rotas, Middlewares, Controladores e Utils).
- **Manipulação de requisições HTTP:** Uso de Streams e Buffers de forma assíncrona para lidar com a chegada do Body em requisições POST e PUT.
- **Persistência simples:** Criação de um banco de dados local através de leitura e escrita de arquivos físicos usando o módulo nativo `fs/promises`.
- **Tratamento de erros:** Validação de fluxos incorretos (ex: deletar IDs inexistentes, acessar rotas não cadastradas) retornando a sinalização `404 Not Found` ao cliente.
- **Documentação técnica:** Criação de documentação (README) focada no usuário e exportação de Collection de testes (Insomnia).

## 🚀 Melhorias futuras
- Substituir o arquivo de texto (JSON) por um Banco de Dados Relacional real (PostgreSQL).
- Implementar fluxo de autenticação e rotas privadas usando JWT (JSON Web Token).
- Escrever testes automatizados (Unitários e de Ponta a Ponta) utilizando Vitest ou Jest.
- Configurar documentação interativa utilizando o padrão OpenAPI (Swagger).
- Fazer o Deploy da API na nuvem utilizando serviços como o Render.
