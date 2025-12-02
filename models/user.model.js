import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    email: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true, minlength: 3 },
    password: { type: String, required: true, trim: true, minlength: 6 },
    role: { type: String, required: true, enum: ["superadmin", "admin"] },
    activo: { type: Boolean, default: true }
}, { timestamps: true } );

export const User = mongoose.model("User", userSchema);