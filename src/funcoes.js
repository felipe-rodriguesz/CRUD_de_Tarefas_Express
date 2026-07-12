import { db } from './database.js';

export async function createTask(titulo, descricao) {
    const query = `INSERT INTO tarefas (titulo, descricao) VALUES (?, ?)`;
    await db.run(query, [titulo, descricao]);
}

export async function listTasks(pesquisa = "") {
    if (pesquisa) {
        const query = `SELECT * FROM tarefas WHERE titulo LIKE ? OR descricao LIKE ?`;
        const termo = `%${pesquisa}%`;
        return await db.all(query, [termo, termo]);
    }
    return await db.all(`SELECT * FROM tarefas`);
}

export async function updateTask(id, novosDados) {
    const tarefa = await db.get(`SELECT * FROM tarefas WHERE id = ?`, [id]);
    if (!tarefa) return false;

    if (novosDados.status) {
        await db.run(`UPDATE tarefas SET status = ? WHERE id = ?`, [novosDados.status, id]);
        return true;
    }
    
    await db.run(`UPDATE tarefas SET titulo = ?, descricao = ? WHERE id = ?`, [novosDados.titulo || tarefa.titulo, novosDados.descricao || tarefa.descricao, id]);
    return true;
}

export async function deleteTask(id) {
    const result = await db.run(`DELETE FROM tarefas WHERE id = ?`, [id]);
    
    if (result.changes === 0) return false;
    
    return true;
}