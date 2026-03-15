import { Router } from 'express';
import { login, logout, refreshAccessToken } from '../controllers/auth.controller.js';

export const authRoutes = Router();

authRoutes.post('/login',  login);
authRoutes.post('/logout', logout);
authRoutes.post('/refresh', refreshAccessToken);
