import { db } from './database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function createTask(titulo, descricao, usuario_id) {
    const query = `INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES ($1, $2, $3)`;
    await db.query(query, [titulo, descricao, usuario_id]);
}

export async function listTasks(pesquisa = "", page = 1, limit = 10, usuarioId) {
    const offset = (page - 1) * limit;
    let dados = [];
    let total = 0;

    if (pesquisa) {
        const termo = `%${pesquisa}%`;
        const resDados = await db.query(
            `SELECT * FROM tarefas WHERE usuario_id = $1 AND (titulo LIKE $2 OR descricao LIKE $3) LIMIT $4 OFFSET $5`, 
            [usuarioId, termo, termo, limit, offset]
        );
        dados = resDados.rows;

        const resCount = await db.query(
            `SELECT COUNT(*) as total FROM tarefas WHERE usuario_id = $1 AND (titulo LIKE $2 OR descricao LIKE $3)`, 
            [usuarioId, termo, termo]
        );
        total = Number(resCount.rows[0].total);
    } else {
        const resDados = await db.query(
            `SELECT * FROM tarefas WHERE usuario_id = $1 LIMIT $2 OFFSET $3`, 
            [usuarioId, limit, offset]
        );
        dados = resDados.rows;

        const resCount = await db.query(
            `SELECT COUNT(*) as total FROM tarefas WHERE usuario_id = $1`,
            [usuarioId]
        );
        total = Number(resCount.rows[0].total);
    }
    
    return {
        data: dados,
        page: page,
        limit: limit,
        total: total
    };
}

export async function updateTask(id, novosDados, usuarioId) {
    const res = await db.query(`SELECT * FROM tarefas WHERE id = $1 AND usuario_id = $2`, [id, usuarioId]);
    const tarefa = res.rows[0];
    if (!tarefa) return false;

    if (novosDados.status) {
        await db.query(`UPDATE tarefas SET status = $1 WHERE id = $2 AND usuario_id = $3`, [novosDados.status, id, usuarioId]);
        return true;
    }
    
    await db.query(
        `UPDATE tarefas SET titulo = $1, descricao = $2 WHERE id = $3 AND usuario_id = $4`, 
        [novosDados.titulo || tarefa.titulo, novosDados.descricao || tarefa.descricao, id, usuarioId]
    );
    return true;
}

export async function deleteTask(id, usuarioId) {
    const result = await db.query(`DELETE FROM tarefas WHERE id = $1 AND usuario_id = $2`, [id, usuarioId]);
    if (result.rowCount === 0) return false;
    return true;
}

export async function createUser(nome, email, senha) {
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        await db.query(`INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)`, [nome, email, senhaCriptografada]);
        return { sucesso: true};
    } catch (error) {
        if(error.code === '23505'){
            return { sucesso: false, message: 'Email já cadastrado!'};
        }
        return { sucesso: false, message: "Erro interno no servidor"};
    }
}

export async function login(email, senha){
    const res = await db.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
    const usuario = res.rows[0];
    if(!usuario) return { sucesso: false, message: "Usuario não encontrado"};

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        return { sucesso: false, mensagem: "Senha incorreta." };
    }
    
    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome }, 
        "minha_chave_super_secreta",
        { expiresIn: "1h" }
    );
    return { sucesso: true, token: token };
}