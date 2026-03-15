import mongoose from "mongoose";

export const ProductCategories = ['Camisetas', 'Discos'];

const productSchema = new mongoose.Schema ({
    productCode: { type: String, required: true, unique: true, trim: true, minlength: 8, match: /^[A-Z]{3}-\d{4}$/ },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ProductCategories },
    image: { type: String, required: true, trim: true }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);