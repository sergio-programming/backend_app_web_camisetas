import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateTokens } from '../utils/token.utils.js';

export const login = async (req, res) => {
    try {
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message : 'Los campos requeridos son obligatorios' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message : 'El email debe tener un formato válido' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message : 'La contraseña debe tener una longitud mínima de 6 caracteres' })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message : `No se encuentra un usuario registrado con el email ${email}` });
        }

        if (!user.activo) {
            return res.status(403).json({ message : 'El usuario se encuentra inactivo' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ message : 'La contraseña proporcionada es incorrecta' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // MANDA EL REFRESH TOKEN POR COOKIE HTTP-ONLY
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        });

        return res.status(200).json({
            message : 'Inicio de sesión exitoso',
            accessToken,
            user : {
                nombre: user.nombre,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        console.error('Error al cerrar sesión: ', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


export const refreshAccessToken = (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        return res.status(401).json({ message: 'No hay refresh token' });
    }

    const SECRET_KEY = process.env.SECRET_KEY;

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Refresh token inválido' });
        }

        const newAccessToken = jwt.sign(
            { email: decoded.email, role: decoded.role },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        res.json({ accessToken: newAccessToken });
    });
};
