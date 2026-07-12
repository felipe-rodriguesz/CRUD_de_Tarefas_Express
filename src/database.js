import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPath = process.env.NODE_ENV === 'test' ? 'database.test.sqlite' : 'database.sqlite';

export const db = await open( {
    filename: dbPath,
    driver: sqlite3.Database
});

await db.exec(`
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        status TEXT DEFAULT 'PENDENTE'
    )
`);

await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
    )
`);