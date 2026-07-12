import express from 'express';
import { rotas } from "./routes.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Tasks CRUD API',
            version: '1.0.0',
            description: 'API REST Multi-tenant para gerenciamento de tarefas',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./src/routes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
app.use(express.json());

// Rota da Documentação Oficial
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(rotas);

export { app };