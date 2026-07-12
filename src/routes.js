import { Router } from 'express';
import { createTask, listTasks, updateTask, deleteTask, createUser, login } from './funcoes.js';
import { verificarToken } from './middleware.js';

export const rotas = Router();
rotas.use('/tasks', verificarToken);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 */
rotas.post('/tasks', async(req, res) => {
    const { titulo, descricao } = req.body;
    const usuario_id = req.usuarioId;

    if (!titulo || !descricao) {
        return res.status(400).json("Preencha título e descrição");
    }

    await createTask(titulo, descricao, usuario_id);
    return res.status(201).json("Tarefa criada!");
});
 
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista as tarefas do usuário logado
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por título ou descrição
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista de tarefas
 */
rotas.get('/tasks', async(req, res) => {
    const pesquisa = req.query.search;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const usuarioId = req.usuarioId;
    const tarefas = await listTasks(pesquisa, page, limit, usuarioId);
            
    return res.status(200).json(tarefas);
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Exclui uma tarefa específica
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *       404:
 *         description: Tarefa não encontrada ou não pertence ao usuário
 */
rotas.delete('/tasks/:id', async(req, res) => {
    const id = Number(req.params.id);
    const usuarioId = req.usuarioId
    const sucesso = await deleteTask(id, usuarioId);
        
    if (sucesso) return res.status(200).json("Deletado com sucesso!");
    return res.status(404).json("Não encontrado");
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualiza o título e/ou descrição de uma tarefa
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 *       404:
 *         description: Tarefa não encontrada
 */
rotas.put('/tasks/:id', async(req, res) => {
    const id = Number(req.params.id);
    const usuarioId = req.usuarioId
    const sucesso = await updateTask(id, req.body, usuarioId);
    
    if (sucesso) return res.status(200).json("Atualizado via PUT!");
    return res.status(404).json("Não encontrado");
});

/**
 * @swagger
 * /tasks/{id}/complete:
 *   patch:
 *     summary: Marca uma tarefa como concluída
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefa concluída
 *       404:
 *         description: Tarefa não encontrada
 */
rotas.patch('/tasks/:id/complete', async(req, res) => {
    const id = Number(req.params.id);
    const usuarioId = req.usuarioId
    const sucesso = await updateTask(id, { status: "CONCLUÍDO!" }, usuarioId);
    
    if (sucesso) return res.status(200).json("Concluído via PATCH!");
    return res.status(404).json("Não encontrado");
});

// ==========================================
// ROTAS DE AUTENTICAÇÃO (Públicas)
// ==========================================

/**
 * @swagger
 * /usuarios/cadastro:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Erro de validação ou email já existe
 */
rotas.post('/usuarios/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: "Preencha nome, email e senha." });
    }

    const resultado = await createUser(nome, email, senha);
    
    if (resultado.sucesso) {
        return res.status(201).json(resultado);
    } else {
        return res.status(400).json(resultado);
    }
});

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Faz login e retorna o Token JWT
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Senha incorreta ou usuário não encontrado
 */
rotas.post('/usuarios/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: "Preencha email e senha." });
    }

    const resultado = await login(email, senha);

    if (resultado.sucesso) {
        return res.status(200).json(resultado); 
    } else {
        return res.status(401).json(resultado);
    }
});