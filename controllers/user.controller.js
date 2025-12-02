import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
    try {
        
        const users = await User.find();

        if (users.length === 0) {
            return res.status(404).json({ message : 'No se encuentra usuarios registrados actualmente' });
        }

        return res.status(200).json(users);

    } catch (error) {
        console.error('Error al obtener los usuarios: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const getUserById = async (req, res) => {
    try {
        
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message : 'No se encuentra un usuario registrado con ese id' });
        }

        const { password: _, ...userResponse } = user.toObject();
        return res.status(200).json(userResponse);

    } catch (error) {
        console.error('Error al obtener el usuario: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const createUser = async (req, res) => {
    try {

        const saltRounds = 10;
        const { email, nombre, password, role } = req.body;

        if (!email || !nombre || !password || !role) {
            return res.status(400).json({ message : 'Los campos requeridos son obligatorios' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message : 'El email debe tener un formato válido' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message : 'La contraseña debe tener una longitud mínima de 6 caracteres' });
        }

        if (role !== "superadmin" && role !== "admin") {
            return res.status(400).json({ message : "El rol enviado no es válido" });
        }

        const userByEmail = await User.findOne({ email : email });
        
        if (userByEmail) {
            return res.status(409).json({ message : `Ya existe un usuario registrado con el email ${email}` })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User ({
            email,
            nombre,
            password: hashedPassword,
            role
        });

        const createdUser = await newUser.save();
        const { password: _, ...userResponse } = createdUser.toObject();

        return res.status(201).json({
            message : 'El usuario se ha creado correctamente',
            user : userResponse
        });

    } catch (error) {   
        console.error('Error al crear el usuario: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const updateUser = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { email, nombre, role, activo } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message : 'No se encuentra un usuario registrado con ese id' });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message : 'El email debe tener un formato válido' });
        }

        if (role && (role !== "superadmin" && role !== "admin")) {
            return res.status(400).json({ message : 'El rol enviado no es válido' });
        }

        if (activo !== undefined && typeof activo !== "boolean") {
            return res.status(400).json({ message : 'El atributo "activo" debe ser booleano (true/false)' });
        }

        if (email !== undefined) user.email = email;
        if (nombre !== undefined) user.nombre = nombre;
        if (role !== undefined) user.role = role;
        if (activo !== undefined) user.activo = activo;

        await user.save();
        const { password: _, ...userResponse } = user.toObject();

        return res.status(200).json({
            message : 'El usuario se ha actualizado correctamente',
            user : userResponse
        });

    } catch (error) {
        console.error('Error al actualizar el usuario: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message : 'No se encuentra un usuario registrado con ese id' });
        }

        await user.deleteOne();

        return res.status(200).json({ message : 'El usuario se ha eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar el usuario: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};