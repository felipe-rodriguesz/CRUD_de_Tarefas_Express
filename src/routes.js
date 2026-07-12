import { Router } from 'express';
import { db } from './database.js';
import { createTask, updateTask, deleteTask } from './funcoes.js';

export const rotas = Router();

rotas.post('/tasks', (req, res) => {
    const { titulo, descricao } = req.body;
    createTask(titulo, descricao);
    return res.status(201).json("Tarefa criada!");
});
 
rotas.get('/tasks', (req, res) => {
    const pesquisa = req.query.search;
    let tarefasFiltradas = db.tarefas;
            
    if (pesquisa) {
        tarefasFiltradas = db.tarefas.filter(tarefa => {
            return tarefa.titulo.toLowerCase().includes(pesquisa.toLowerCase()) || 
                   tarefa.descricao.toLowerCase().includes(pesquisa.toLowerCase());
        });
    }
    return res.status(200).json(tarefasFiltradas);
});

rotas.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const sucesso = deleteTask(id);
        
    if (sucesso) return res.status(200).json("Deletado com sucesso!");
    return res.status(404).json("Não encontrado");
});

rotas.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const sucesso = updateTask(id, req.body);
    
    if (sucesso) return res.status(200).json("Atualizado via PUT!");
    return res.status(404).json("Não encontrado");
});

rotas.patch('/tasks/:id/complete', (req, res) => {
    const id = Number(req.params.id);
    const sucesso = updateTask(id, { status: "CONCLUÍDO!" });
    
    if (sucesso) return res.status(200).json("Concluído via PATCH!");
    return res.status(404).json("Não encontrado");
});