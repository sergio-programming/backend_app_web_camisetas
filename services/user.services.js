import { User, UserRoles } from "../models/user.model";

export const getUsersService = async() => {
    return User.find().sort({ createdAt: -1 }).lean().exec();
};

export const getUserByIdService = async(id) => {
    return User.findById(id).lean().exec();
};

export const getUserByEmailService = async(email) => {
    return User.findOne({ email }).lean().exec();
};

export const getUsersByRoleService = async(role) => {
    return User.find({ role }).sort({ createdAt: -1 }).lean().exec();
};

export const createUserService = async(body) => {
    const user = await User.create(body);
    return user.toObject();
}

export const updateUserService = async(id, body) => {
    return User.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true }
    )
    .lean()
    .exec();
};

export const cancelUserService = async(id) => {
    return User.findByIdAndUpdate(
        id,
        { $set: { isActive: false } },
        { new: true }
    )
    .lean()
    .exec();
};

export const activateUserService = async(id) => {
    return User.findByIdAndUpdate(
        id,
        { $set: { isActive: true } },
        { new: true }
    )
    .lean()
    .exec();
};

export const deleteUserService = async(id) => {
    return User.findByIdAndDelete(id).lean().exec();
}

export const validateCreateUserInput = async(body) => {
    const { fullName, email, password, role } = body;

    if (!fullName || !email || !password || !role) {
        throw new AppError('Los campos requeridos son obligatorios', 400);
    }

    if (fullName.length < 3) {
        throw new AppError('El nombre debe tener mínimo 3 caracteres', 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new AppError('El email debe tener un formato válido', 400);
    }

    if (password.length < 6) {
        throw new AppError('El password debe tener mínimo 6 caracteres', 400);
    }

    if (!UserRoles.includes(role)) {
        throw new AppError('Debe asignar un rol válido', 400);
    }

    const user = await getUserByEmailService(email);

    if (user) {
        throw new AppError('Ya existe un usuario con ese email', 409);
    }

    return { fullName, email, password, role };
};

export const validateUpdateUserInput = async(body) => {
    if (Object.keys(body).length === 0) {
        throw new AppError('Debe enviar al menos un campo para actualizar', 400);       
    }

    if (body.fullName && body.fullName.length < 3) {
        throw new AppError('El nombre debe tener mínimo 3 caracteres', 400);
    }

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        throw new AppError('El email debe tener un formato válido', 400);
    }

    if (body.role && !UserRoles.includes(body.role)) {
        throw new AppError('Debe asignar un rol válido', 400);
    }

    if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
        throw new AppError('El valor debe ser booleano', 400);
    }

    return body;
}  

