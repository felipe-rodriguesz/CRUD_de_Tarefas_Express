import express from 'express';
import { rotas } from "./routes.js";

const app = express();
app.use(express.json());
app.use(rotas);

export { app };