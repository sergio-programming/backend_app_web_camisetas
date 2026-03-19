import { generateTokens } from '../helpers/token.helpers.js';
import { authenticateUser, verifyRefreshToken } from '../services/auth.services.js';

export const login = async (req, res, next) => {
    try {
        
        const user = await authenticateUser(req.body);

        const { accessToken, refreshAccessToken } = generateTokens(user);

        // MANDA EL REFRESH TOKEN POR COOKIE HTTP-ONLY
        res.cookie("refreshToken", refreshAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        });

        res.status(200).json({
            message : 'Inicio de sesión exitoso',
            accessToken,
            user : {
                nombre: user.nombre,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};

export const logout = (req, res, next) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        next(error);
    }
};


export const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No hay refresh token' });
        }

        const decoded = verifyRefreshToken(refreshToken);

        // Generamos nuevos tokens
        // Pasamos un objeto limpio (solo lo necesario) para evitar errores de JWT
        const { accessToken, refreshAccessToken: newRefreshToken } = generateTokens({
            _id: decoded.id,
            email: decoded.email,
            role: decoded.role
        });

        // OPCIONAL: Rotación de Refresh Token (Muy recomendado)
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken });
        
    } catch (error) {
        next(error); 
    }
};
