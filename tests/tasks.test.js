import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/database.js';

let tokenBot = "";

describe('CRUD de Tarefas - Testes Automatizados', () => {
    
    beforeAll(async () => {
        await db.run(`DELETE FROM tarefas`);
        await db.run(`DELETE FROM usuarios`);
        await db.run(`DELETE FROM sqlite_sequence WHERE name="tarefas"`);

        await request(app).post('/usuarios/cadastro').send({
            nome: "Bot de Testes",
            email: "robo@robo.com",
            senha: "123"
        });

        const respostaLogin = await request(app).post('/usuarios/login').send({
            email: "robo@robo.com",
            senha: "123"
        });

        tokenBot = respostaLogin.body.token;
    });

    it('Deve criar uma tarefa nova com sucesso', async () => {
        const resposta = await request(app)
            .post('/tasks')
            .set("Authorization", `Bearer ${tokenBot}`)
            .send({
                titulo: 'Estudar Testes',
                descricao: 'Aprender Jest e Supertest'
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toBe("Tarefa criada!");
    });

    it('Deve listar a tarefa recém-criada', async () => {
        const resposta = await request(app)
            .get('/tasks')
            .set("Authorization", `Bearer ${tokenBot}`)

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveProperty('data');
        expect(Array.isArray(resposta.body.data)).toBe(true);
        expect(resposta.body.data[0].titulo).toBe('Estudar Testes');

        expect(resposta.body.page).toBe(1);
        expect(resposta.body.limit).toBe(10);
        expect(resposta.body.total).toBe(1);
    });

    it('Deve atualizar o titulo da tarefa via PUT', async () => {
        const resposta = await request(app)
            .put('/tasks/1')
            .set("Authorization", `Bearer ${tokenBot}`)
            .send({
                titulo: 'Estudar Testes Avançados',
                descricao: 'Aprender Jest'
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body).toBe("Atualizado via PUT!");
    });

    it('Deve deletar a tarefa existente', async () => {
        const resposta = await request(app)
            .delete('/tasks/1')
            .set("Authorization", `Bearer ${tokenBot}`)

        expect(resposta.status).toBe(200);
        expect(resposta.body).toBe("Deletado com sucesso!");
    });

    it('Deve retornar erro 404 ao tentar deletar uma tarefa apagada/inexistente', async () => {
        const resposta = await request(app)
            .delete('/tasks/999')
            .set("Authorization", `Bearer ${tokenBot}`)

        expect(resposta.status).toBe(404);
        expect(resposta.body).toBe("Não encontrado");
    });
});