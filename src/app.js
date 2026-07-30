import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rotas } from "./routes.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

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
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'auth_token',
                }
            }
        }
    },
    apis: ['./src/routes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
app.use(cookieParser());

// ==========================================
// SEGURANÇA: Headers HTTP (Helmet)
// ==========================================
app.use(helmet({
    contentSecurityPolicy: false // Desabilita CSP para não bloquear Tailwind CDN e Lucide CDN
}));

// ==========================================
// SEGURANÇA: CORS restrito a origens autorizadas
// ==========================================
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://crud-de-tarefas-express.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permite requisições sem origin (Postman, Insomnia, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Bloqueado pelo CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==========================================
// SEGURANÇA: Limite de tamanho do body (anti JSON Bomb)
// ==========================================
app.use(express.json({ limit: '10kb' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Faz o Express servir nossa pasta 'frontend' como um site público!
// Ao acessar a URL base, ele vai carregar automaticamente o index.html
app.use(express.static(path.join(__dirname, '../frontend')));

// ==========================================
// SEGURANÇA: Rate Limit Global
// ==========================================
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // máximo 200 requests por IP a cada 15 min
    message: { sucesso: false, mensagem: 'Muitas requisições. Tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => process.env.NODE_ENV === 'test'
});
app.use(globalLimiter);

app.use(rotas);

// ==========================================
// SEGURANÇA: Error Handler Global
// ==========================================
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
});

export { app };