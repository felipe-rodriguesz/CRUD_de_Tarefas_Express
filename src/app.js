import express from 'express';
import cors from 'cors';
import { rotas } from "./routes.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração necessária para usar __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(cors()); // Permite que qualquer Frontend converse com a API
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Faz o Express servir nossa pasta 'frontend' como um site público!
// Ao acessar a URL base, ele vai carregar automaticamente o index.html
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(rotas);

export { app };