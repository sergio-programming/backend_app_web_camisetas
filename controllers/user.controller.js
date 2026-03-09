import { AppError } from '../helpers/app.error.js';
import { hashPassword } from '../helpers/password.helpers.js';
import {
    getUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService,
    cancelUserService,
    activateUserService,
    validateCreateUserInput,
    validateUpdateUserInput
} from '../services/user.services.js';


export const getUsers = async (req, res, next) => {
    try {
        const users = await getUsersService();

        res.status(200).json(users);

    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        
        const { id } = req.params;
        const user = await getUserByIdService(id);

        if (!user) {
            return res.status(200).json(null)
        }

        const { password: _, ...userResponse } = user;
        res.status(200).json(userResponse);

    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {

        const validatedData = await validateCreateUserInput(req.body);

        const hashedPassword = hashPassword(validatedData.password);

        const newUser = await createUserService({
            ...validatedData,
            password: hashedPassword
        });

        const { password: _, ...userResponse } = newUser;

        res.status(201).json({
            message : 'El usuario se ha creado correctamente',
            user : userResponse
        });

    } catch (error) {   
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        
        const { id } = req.params;
        
        const validatedData = await validateUpdateUserInput(req.body);

        if (validatedData.password && validatedData.password !== '') {
            validatedData.password = await hashPassword(validatedData.password);
        } else {
            delete validatedData.password;
        }

        const updatedUser = await updateUserService(id, validatedData);

        if (!updatedUser) {
            return next(new AppError(
                'No se pudo actualizar: usuario no encontrado',
                404
            ));
        }

        const { password: _, ...userResponse } = updatedUser;

        res.status(200).json({
            message : 'El usuario se ha actualizado correctamente',
            user : userResponse
        });

    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        
        const { id } = req.params;
        
        const deletedUser = await deleteUserService(id);

        if (!user) {
            return next(new AppError(
                'No se pudo eliminar: usuario no encontrado',
                404
            ));
        }

        const { password:_, ...userResponse } = deletedUser;

        res.status(200).json({ 
            message : 'El usuario se ha eliminado correctamente',
            user: userResponse
        });

    } catch (error) {
        next(error);
    }
};

export const cancelUser = async(req, res, next) => {
    try {
        const { id } = req.params;

        const cancelledUser = await cancelUserService(id);

        if (!cancelledUser) {
            return next(new AppError(
                'No se pudo cancelar: usuario no encontrado',
                404
            ));
        }

        const { password:_, ...userResponse } = cancelledUser;

        res.status(200).json({
            message: 'El usuario se ha cancelado correctamente',
            user: userResponse
        })

    } catch (error) {
        next(error);
    }
};

export const activateUser = async(req, res, next) => {
    try {
        const { id } = req.params;

        const activatedUser = await activateUserService(id);

        if (!activatedUser) {
            return next(new AppError(
                'No se pudo activar: usuario no encontrado',
                404
            ));
        }

        const { password:_, ...userResponse } = activatedUser;

        res.status(200).json({
            message: 'El usuario se ha activado correctamente',
            user: userResponse
        })

    } catch (error) {
        next(error);
    }
};