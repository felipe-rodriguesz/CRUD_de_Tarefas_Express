import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

export const db = new Pool( {
    connectionString: process.env.DATABASE_URL
});

async function createTable(params) {
    await db.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id SERIAL PRIMARY KEY,
            titulo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            status TEXT DEFAULT 'PENDENTE',
            usuario_id INTEGER NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    `);

    console.log("Tabelas verificadas/criadas no Supabase com sucesso!");
}

createTable();