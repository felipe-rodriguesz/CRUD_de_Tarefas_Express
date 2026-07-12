import { db } from './database.js';

export async function createTask(titulo, descricao) {
    const query = `INSERT INTO tarefas (titulo, descricao) VALUES (?, ?)`;
    await db.run(query, [titulo, descricao]);
}

export async function listTasks(pesquisa = "", page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let dados = [];
    let total = 0;

    if (pesquisa) {
        const termo = `%${pesquisa}%`;
        dados = await db.all(`SELECT * FROM tarefas WHERE titulo LIKE ? OR descricao LIKE ? LIMIT ? OFFSET ?`, [termo, termo, limit, offset]);
        const count = await db.get(`SELECT COUNT(*) as total FROM tarefas WHERE titulo LIKE ? OR descricao LIKE ?`, [termo, termo]);
        total = count.total;
    } else {
        dados = await db.all(`SELECT * FROM tarefas LIMIT ? OFFSET ?`, [limit, offset]);
        const count = await db.get(`SELECT COUNT(*) as total FROM tarefas`);
        total = count.total;
    }
    return {
        data: dados,
        page: page,
        limit: limit,
        total: total
    };
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