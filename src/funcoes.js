import { db, salvarBanco } from './database.js';

export function createTask(titulo, descricao) {
    const novaTarefa = {
        id: db.proxId,
        titulo,
        descricao,
        status: "Pendente..."
    };
    db.tarefas.push(novaTarefa);
    db.proxId++;
    salvarBanco();
    return novaTarefa;
}

export function listTasks() {
    if (db.tarefas.length === 0) {
        console.log("Nenhuma tarefa cadastrada!");
        return;
    }
    console.log(db.tarefas);
}

export function updateTask(id, novosDados) {
    const index = db.tarefas.findIndex(tarefa => tarefa.id === id);
    if (index === -1) {
        console.log("Tarefa não encontrada");
        return false;
    }
    db.tarefas[index] = { ...db.tarefas[index], ...novosDados };
    salvarBanco();
    return true;
}

export function deleteTask(id) {
    const index = db.tarefas.findIndex(tarefa => tarefa.id === id);
    if (index === -1) {
        console.log("Tarefa não encontrada");
        return false;
    }
    db.tarefas.splice(index, 1);
    salvarBanco();
    return true;
}