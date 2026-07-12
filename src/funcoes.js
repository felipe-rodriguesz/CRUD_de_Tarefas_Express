import { db } from './database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export async function createUser(nome, email, senha) {
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await db.run(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, senhaCriptografada]);
        return { sucesso: true};
    } catch (error) {
        if(error.code === 'SQLITE_CONSTRAINT'){
            return { sucesso: false, message: 'Email já cadastrado!'};
        }
        return { sucesso: false, message: "Erro interno no servidor"};
    }
}

export async function login(email, senha){
    const usuario = await db.get(`SELECT * FROM usuarios WHERE email = ?`, [email]);
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