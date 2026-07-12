import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/database.js';

describe('CRUD de Tarefas - Testes Automatizados', () => {
    
    beforeAll(() => {
        db.tarefas = [];
        db.proxId = 1;
    });

    it('Deve criar uma tarefa nova com sucesso', async () => {
        const resposta = await request(app)
            .post('/tasks')
            .send({ titulo: 'Estudar Testes', descricao: 'Aprender Jest e Supertest' });
        
        expect(resposta.status).toBe(201);
        expect(resposta.body).toBe("Tarefa criada!");
    });

    it('Deve listar a tarefa recém-criada', async () => {
        const resposta = await request(app).get('/tasks');
        
        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
        expect(resposta.body.length).toBe(1);
        expect(resposta.body[0].titulo).toBe('Estudar Testes');
    });

    it('Deve atualizar o titulo da tarefa via PUT', async () => {
        const resposta = await request(app)
            .put('/tasks/1')
            .send({ titulo: 'Estudar Testes Avançados', descricao: 'Aprender Jest' });
        
        expect(resposta.status).toBe(200);
        expect(resposta.body).toBe("Atualizado via PUT!");
    });

    it('Deve deletar a tarefa existente', async () => {
        const resposta = await request(app).delete('/tasks/1');
        
        expect(resposta.status).toBe(200);
    });

    it('Deve retornar erro 404 ao tentar deletar uma tarefa apagada/inexistente', async () => {
        const resposta = await request(app).delete('/tasks/999');
        
        expect(resposta.status).toBe(404);
        expect(resposta.body).toBe("Não encontrado");
    });
});