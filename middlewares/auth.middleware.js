import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const SECRET_KEY = process.env.SECRET_KEY;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: 'El token ha expirado' });
        }
        return res.status(401).json({ message : 'Token inválido' });
    }
};

export const verifyRole = (rolesPermitidos) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({ message : 'Usuario no autenticado' });
        }

        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ message : 'No tienes permiso para realizar esta acción' });
        }
        next();
    }
};

export const isSuperAdmin = async (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({ message : 'Usuario no autenticado' });
    }

    if (req.user.role !== "superadmin") {
        return res.status(403).json({ message : 'Se requieren permisos de Super Administrador' });
    }

    next();
};
