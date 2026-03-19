import { Router } from "express";
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    cancelUser,
    activateUser
} from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

export const userRoutes = Router();

userRoutes.get('/', verifyToken, isAdmin, getUsers);
userRoutes.get('/:id', verifyToken, isAdmin, getUser);
userRoutes.post('/', verifyToken, isAdmin, createUser);
userRoutes.put('/:id', verifyToken, isAdmin, updateUser);
userRoutes.patch('/:id/cancel', verifyToken, isAdmin, cancelUser);
userRoutes.patch('/:id/active', verifyToken, isAdmin, activateUser);
userRoutes.delete('/:id', verifyToken, isAdmin, deleteUser);

