import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log("Conectado a la base de datos MongoDB");
    } catch (error) {
        console.error("Error al conectar con la base de datos: ", error);
        process.exit(1); // Cerramos el proceso si no se puede conectar (evita que la app siga corriendo sin DB)
    }
}