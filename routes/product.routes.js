import { Router } from "express";
import {
    getProducts,
    getProductById,
    getShirts,
    getAlbums,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, verifyRole(["superadmin", "admin"]), getProducts);
router.get('/shirts', getShirts);
router.get('/albums', getAlbums);
router.get('/:id', verifyToken, verifyRole(["superadmin", "admin"]), getProductById);
router.post('/', verifyToken, verifyRole(["superadmin", "admin"]), createProduct);
router.put('/:id', verifyToken, verifyRole(["superadmin", "admin"]), updateProduct);
router.delete('/:id', verifyToken, verifyRole(["superadmin", "admin"]), deleteProduct);

export const productRoutes = router;