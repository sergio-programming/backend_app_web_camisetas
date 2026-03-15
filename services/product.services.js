import { get } from 'mongoose';
import { AppError } from '../helpers/app.error.js';
import { Product, ProductCategories } from "../models/product.model";

const isValidCode = (code) => /^[A-Z]{3}-\d{4}$/.test(code);
const verifyCode = async(id, code) => {
    const productByid = Product.findById(id);
    const productByCode = Product.findOne({ productCode: code });
    if (productByid._id !== productByCode._id) {
        return true;
    }
    return false;
}

export const getProductsService = async() => {
    return Product.find().sort({ createdAt: -1 }).lean().exec();
};

export const getProductByIdService = async(id) => {
    return Product.findById(id).lean().exec();
};

export const getProductByCodeService = async(productCode) => {
    return Product.findOne({ productCode }).lean().exec();
}

export const getProductsByCategoryService = async(category) => {
    return Product.find({ category }).sort({ createdAt: -1 }).lean().exec();
};

export const createProductService = async(body) => {
    const product = await Product.create(body);
    return product.toObject();
};

export const updateProductService = async(id, body) => {
    return Product.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true }
    )
    .lean()
    .exec();
};

export const deleteProductService = async(id) => {
    return Product.findByIdAndDelete(id).lean().exec();
};

export const validateCreateProductInput = async(body) => {
    const { productCode, description, price, category, image } = body;

    if (!productCode || !description || price === undefined || !category || !image) {
        throw new AppError('Todos los campos son requeridos', 400);
    }

    if (!isValidCode(productCode)) {
        throw new AppError('El código debe tener un formato válido', 400);
    }

    if (description.length < 10 && description.length > 100) {
        throw new AppError('La descripción debe tener 10 y 100 caracteres', 400);
    }

    if (price < 0) {
        throw new AppError('El precio no puede ser negativo', 400);
    }

    if (!ProductCategories.includes(category)) {
        throw new AppError('Debe seleccionar una categoría válida', 400);
    }

    const product = await getProductByCodeService(body.productCode);

    if (product) {
        throw new AppError('Ya existe un producto con este código', 409);
    }

    return body;
};

export const validateUpdateProductInput = async(id, body) => {
    if (Object.keys(body).length === 0) {
        throw new AppError('Debe enviar al menos un campo para actualizar', 400);
    }

    if (body.productCode) {
        if (!isValidCode(body.productCode)) {
            throw new AppError('El código debe tener un formato válido', 400); 
        }
        const existingProduct = await getProductByCodeService(body.productCode);
        if (existingProduct && existingProduct._id.toString() !== id) {
            throw new AppError('Ya existe otro producto con este código', 409);
        }            
    }

    if (body.description.length < 10 && body.description.length > 100) {
        throw new AppError('La descripción debe tener 10 y 100 caracteres', 400);
    }

    if (body.price !== undefined && body.price < 0) {
        throw new AppError('El precio no puede ser negativo', 400);
    }

    if (body.category && !ProductCategories.includes(body.category)) {
        throw new AppError('Debe seleccionar una categoría válida', 400);
    }

    return body;    
};