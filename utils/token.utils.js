import jwt from 'jsonwebtoken';

export const generateTokens = (user) => {
    const SECRET_KEY = process.env.SECRET_KEY
    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: '2h' }
    );

    const refreshToken = jwt.sign(
        { email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: '7d' }  // 7 días
    );

    return { accessToken, refreshToken };
};
