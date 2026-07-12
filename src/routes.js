import { Router } from 'express';
import { createTask, listTasks, updateTask, deleteTask, createUser, login } from './funcoes.js';
import { verificarToken } from './middleware.js';

export const rotas = Router();
rotas.use('/tasks', verificarToken);

rotas.post('/tasks', async(req, res) => {
    const { titulo, descricao } = req.body;
    const usuario_id = req.usuarioId;

    if (!titulo || !descricao) {
        return res.status(400).json("Preencha título e descrição");
    }

    await createTask(titulo, descricao, usuario_id);
    return res.status(201).json("Tarefa criada!");
});
 
rotas.get('/tasks', async(req, res) => {
    const pesquisa = req.query.search;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const usuarioId = req.usuarioId;
    const tarefas = await listTasks(pesquisa, page, limit, usuarioId);
            
    return res.status(200).json(tarefas);
});

rotas.delete('/tasks/:id', async(req, res) => {
    const id = Number(req.params.id);
    const usuarioId = req.usuarioId
    const sucesso = await deleteTask(id, usuarioId);
        
    if (sucesso) return res.status(200).json("Deletado com sucesso!");
    return res.status(404).json("Não encontrado");
});

rotas.put('/tasks/:id', async(req, res) => {
    const id = Number(req.params.id);
    const usuarioId = req.usuarioId
    const sucesso = await updateTask(id, req.body, usuarioId);
    
    if (sucesso) return res.status(200).json("Atualizado via PUT!");
    return res.status(404).json("Não encontrado");
});

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