import { Router } from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js';
import { verifyToken, isSuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', verifyToken, isSuperAdmin, getUsers);
router.get('/:id', verifyToken, isSuperAdmin, getUserById);
router.post('/', verifyToken, isSuperAdmin, createUser);
router.put('/:id', verifyToken, isSuperAdmin, updateUser);
router.delete('/:id', verifyToken, isSuperAdmin, deleteUser);

export const userRoutes = router;