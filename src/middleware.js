import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ sucesso: false, mensagem: "Acesso negado. Token não fornecido." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = payload.id;
        next();
    } catch (error) {
        return res.status(401).json({ sucesso: false, mensagem: "Token inválido ou expirado." });
    }
}