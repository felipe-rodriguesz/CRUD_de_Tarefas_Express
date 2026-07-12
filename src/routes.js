import { Router } from 'express';
import { createTask, listTasks, updateTask, deleteTask } from './funcoes.js';

export const rotas = Router();

rotas.post('/tasks', async(req, res) => {
    const { titulo, descricao } = req.body;
    await createTask(titulo, descricao);
    return res.status(201).json("Tarefa criada!");
});
 
rotas.get('/tasks', async(req, res) => {
    const pesquisa = req.query.search;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const tarefas = await listTasks(pesquisa, page, limit);
            
    return res.status(200).json(tarefas);
});

rotas.delete('/tasks/:id', async(req, res) => {
    const id = Number(req.params.id);
    const sucesso = await deleteTask(id);
        
    if (sucesso) return res.status(200).json("Deletado com sucesso!");
    return res.status(404).json("Não encontrado");
});

rotas.put('/tasks/:id', async(req, res) => {
    const id = Number(req.params.id);
    const sucesso = await updateTask(id, req.body);
    
    if (sucesso) return res.status(200).json("Atualizado via PUT!");
    return res.status(404).json("Não encontrado");
});

rotas.patch('/tasks/:id/complete', async(req, res) => {
    const id = Number(req.params.id);
    const sucesso = await updateTask(id, { status: "CONCLUÍDO!" });
    
    if (sucesso) return res.status(200).json("Concluído via PATCH!");
    return res.status(404).json("Não encontrado");
});