import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async() => {
    // Si tenemos una conexión la reutilizamos
    if (isConnected) {
        return mongoose.connection;
    }

    const mongoUri = process.env.MONGOURI;

    // Listener de conexión exitosa
    mongoose.connection.once('connected', () => {
        console.log('Conectado a Mongo DB');
    });

    // Listener de error de conexión
    mongoose.connection.on('error', err => {
        console.log('Error al conectar a Mongo DB:' , err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Desconectado a Mongo DB');
    });

    await mongoose.connect(mongoUri, {
        autoIndex: true,
        maxPoolSize: 10,
    })

    isConnected = true;
    return mongoose.connection;



}