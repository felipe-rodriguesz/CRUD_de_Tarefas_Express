import express from 'express';
import { rotas } from "./routes.js";

const app = express();
app.use(express.json());
app.use(rotas);

app.listen(3000, () => {
    console.log("Servidor rodando! Acesse: http://localhost:3000/tasks no seu navegador.");
});