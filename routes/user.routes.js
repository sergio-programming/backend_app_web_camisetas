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
import { verifyToken, isSuperAdmin } from "../middlewares/auth.middleware.js";

export const userRoutes = Router();

userRoutes.get('/', verifyToken, isSuperAdmin, getUsers);
userRoutes.get('/:id', verifyToken, isSuperAdmin, getUser);
userRoutes.post('/', verifyToken, isSuperAdmin, createUser);
userRoutes.put('/:id', verifyToken, isSuperAdmin, updateUser);
userRoutes.patch('/:id/cancel', verifyToken, isSuperAdmin, cancelUser);
userRoutes.patch('/:id/active', verifyToken, isSuperAdmin, activateUser);
userRoutes.delete('/:id', verifyToken, isSuperAdmin, deleteUser);

