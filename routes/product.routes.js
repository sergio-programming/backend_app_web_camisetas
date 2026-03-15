import { Router } from "express";
import {
    getProducts,
    getProduct,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware.js';
import { ProductCategories } from "../models/product.model.js";

export const productRoutes = Router();

productRoutes.get('/', verifyToken, verifyRole(ProductCategories), getProducts);
productRoutes.get('/category/:category', verifyToken, verifyRole(ProductCategories), getProductsByCategory);
productRoutes.get('/:id', verifyToken, verifyRole(ProductCategories), getProduct);
productRoutes.post('/', verifyToken, verifyRole(ProductCategories), createProduct);
productRoutes.put('/:id', verifyToken, verifyRole(ProductCategories), updateProduct);
productRoutes.delete('/:id', verifyToken, verifyRole(ProductCategories), deleteProduct);