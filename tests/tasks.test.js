import request from 'supertest';
import { app } from '../src/app.js';
import { db, createTable } from '../src/database.js';
import { jest } from '@jest/globals';

let cookieBot = [];
let cookieHacker = [];

jest.setTimeout(30000);

describe('CRUD de Tarefas - Testes Automatizados (Postgres)', () => {
    
    beforeAll(async () => {
        await createTable();
        await db.query(`TRUNCATE TABLE tarefas, usuarios RESTART IDENTITY CASCADE`);

        const cadastroBot = await request(app).post('/usuarios/cadastro').send({
            nome: "Bot de Testes",
            email: "robo@robo.com",
            senha: "123456"
        });
        
        const respostaLogin = await request(app).post('/usuarios/login').send({
            email: "robo@robo.com",
            senha: "123456"
        });
        cookieBot = respostaLogin.headers['set-cookie'];

        await request(app).post('/usuarios/cadastro').send({
            nome: "Bot Hacker",
            email: "hacker@robo.com",
            senha: "123456"
        });
        const respostaHacker = await request(app).post('/usuarios/login').send({
            email: "hacker@robo.com",
            senha: "123456"
        });
        cookieHacker = respostaHacker.headers['set-cookie'];
    });

    afterAll(async () => {
        await db.end();
    });

    it('Deve criar uma tarefa nova com sucesso (Usuário A)', async () => {
        const resposta = await request(app)
            .post('/tasks')
            .set("Cookie", cookieBot)
            .send({
                titulo: 'Estudar Testes',
                descricao: 'Aprender Jest e Supertest'
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toBe("Tarefa criada!");
    });

    it('Deve listar a tarefa recém-criada (Usuário A)', async () => {
        const resposta = await request(app)
            .get('/tasks')
            .set("Cookie", cookieBot)

        expect(resposta.status).toBe(200);
        expect(resposta.body.data.length).toBe(1);
        expect(resposta.body.data[0].titulo).toBe('Estudar Testes');
    });

    it('ISOLAMENTO: Usuário B não deve ver as tarefas do Usuário A', async () => {
        const resposta = await request(app)
            .get('/tasks')
            .set("Cookie", cookieHacker)

        expect(resposta.status).toBe(200);
        expect(resposta.body.data.length).toBe(0);
    });

    it('Deve atualizar o titulo da tarefa via PUT', async () => {
        const resposta = await request(app)
            .put('/tasks/1')
            .set("Cookie", cookieBot)
            .send({
                titulo: 'Estudar Testes Avançados',
                descricao: 'Aprender Jest'
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body).toBe("Atualizado via PUT!");
    });

    it('ISOLAMENTO: Usuário B não pode deletar a tarefa do Usuário A', async () => {
        const resposta = await request(app)
            .delete('/tasks/1')
            .set("Cookie", cookieHacker)

        expect(resposta.status).toBe(404);
        expect(resposta.body).toBe("Não encontrado");
    });

    it('Deve deletar a tarefa existente (Pelo dono correto)', async () => {
        const resposta = await request(app)
            .delete('/tasks/1')
            .set("Cookie", cookieBot)

        expect(resposta.status).toBe(200);
        expect(resposta.body).toBe("Deletado com sucesso!");
    });
});