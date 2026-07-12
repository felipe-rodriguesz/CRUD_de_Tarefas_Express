import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ sucesso: false, mensagem: "Acesso negado. Token não fornecido." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, "minha_chave_super_secreta");
        req.usuarioId = payload.id;
        next();
    } catch (error) {
        return res.status(401).json({ sucesso: false, mensagem: "Token inválido ou expirado." });
    }
}