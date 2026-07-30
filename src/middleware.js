import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function verificarToken(req, res, next) {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ sucesso: false, mensagem: "Acesso negado. Token não fornecido." });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = payload.id;
        next();
    } catch (error) {
        return res.status(401).json({ sucesso: false, mensagem: "Token inválido ou expirado." });
    }
}