import mongoose from "mongoose";

const productSchema = new mongoose.Schema ({
    codigo: { type: String, required: true, unique: true, trim: true, minlength: 6 },
    descripcion: { type: String, required: true, trim: true, maxlength: 100 },
    precio: { type: Number, required: true, min: 0 },
    categoria: { type: String, required: true, enum: ["Camisetas", "Discos"] },
    imagen: { type: String, required: true, trim: true }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);