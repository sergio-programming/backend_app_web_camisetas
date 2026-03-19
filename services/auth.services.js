import jwt from 'jsonwebtoken';
import { comparePassword } from "../helpers/password.helpers.js";
import { getUserByEmailService } from "./user.services.js";
import { AppError } from '../helpers/app.error.js';

export const authenticateUser = async(body) => {
    const normalizedEmail = body.email.trim();
    const normalizedPassword = body.password.trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        throw new AppError('El email es obligatorio y debe tener un formato válido', 400);
    }

    if (!normalizedPassword || normalizedPassword.length < 6) {
        throw new AppError('La contraseña es obligatoria y debe tener mínimo 6 caracteres', 400);
    }

    const user = await getUserByEmailService(normalizedEmail);

    if (!user) {
        throw new AppError('Credenciales inválidas', 403);
    }

    if (!user.isActive) {
        throw new AppError('El usuario se encuentra inactivo', 403);
    }

    const validPassword = await comparePassword(normalizedPassword, user.password);

    if (!validPassword) {
        throw new AppError('Credenciales inválidas', 401);
    }

    return user;

};

export const verifyRefreshToken = (token) => {
    try {
        const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
        const decoded = jwt.verify(token, REFRESH_SECRET_KEY);
        return decoded;
    } catch (error) {
        throw new AppError('Refresh token inválido o expirado', 403);
    }
};