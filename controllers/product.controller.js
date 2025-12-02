import { Product } from "../models/product.model.js";

export const getProducts = async (req, res) => {
    try {
        
        const products = await Product.find();

        if (products.length === 0) {
            return res.status(400).json({ message : 'No se encuentran productos registrados actualmente' });
        }

        return res.status(200).json(products);

    } catch (error) {
        console.error('Error al obtener los productos: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const getProductById = async (req, res) => {
    try {
        
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message : 'No se encuentra un producto registrado con ese id' });
        }

        return res.status(200).json(product);

    } catch (error) {
        console.error('Error al obtener el producto: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const getShirts = async (req, res) => {
    try {
        
        const shirts = await Product.find({ categoria : 'Camisetas' });

        if (!shirts) {
            return res.status(404).json({ message : 'No se encuentran productos registrados en la categoria Camisetas ' });
        }

        return res.status(200).json(shirts);

    } catch (error) {
        console.error('Error al obtener las camisetas: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const getAlbums = async (req, res) => {
    try {
        
        const albums = await Product.find({ categoria : 'Discos' });

        if (!albums) {
            return res.status(404).json({ message : 'No se encuentran productos registrados en la categoria Discos ' });
        }

        return res.status(200).json(albums);

    } catch (error) {
        console.error('Error al obtener los discos: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const createProduct = async (req, res) => {
    try {
        
        const { codigo, descripcion, precio, categoria, imagen } = req.body;

        if (!codigo || !descripcion || !precio || !categoria || !imagen ) {
            return res.status(400).json({ message : 'Los campos requeridos son obligatorios' });
        }

        if (codigo < 6) {
            return res.status(400).json({ message : 'El código debe tener una longitud mínima de 6 caracteres' });
        }

        if (precio < 0) {
            return res.status(400).json({ message : 'No se permiten valores negativos para el precio' });
        }

        if (categoria !== "Camisetas" && categoria !== "Discos") {
            return res.status(400).json({ message : 'La categoría enviada no es válida' });
        }

        const productByCode = await Product.findOne({ codigo : codigo });

        if (productByCode) {
            return res.status(409).json({ message : `Ya existe un producto registrado con el codigo ${codigo}` });
        }

        const newProduct = new Product ({
            codigo,
            descripcion,
            precio,
            categoria,
            imagen
        });

        const createdProduct = await newProduct.save();

        return res.status(201).json({
            message : 'El producto se ha creado correctamente',
            product : createdProduct
        });

    } catch (error) {
        console.error('Error al crear el producto: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { codigo, descripcion, precio, categoria, imagen } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message : 'No se encuentra un producto registrado con ese id' });
        }

        if (codigo !== undefined && codigo !== product.codigo) {
            if (codigo < 6) {
                return res.status(400).json({ message : 'El código debe tener una longitud mínima de 6 caracteres' });
            }
            const productByCode = await Product.findOne({ codigo : codigo });
            if (productByCode) {
                return res.status(409).json({ message : `Ya existe un producto registrado con el codigo ${codigo}` });
            }
        }

        if (precio !== undefined && precio < 0) {
            return res.status(400).json({ message : 'No se permiten valores negativos para el precio' });
        }

        if (categoria !== undefined && !["Camisetas", "Discos"].includes(categoria)) {
            return res.status(400).json({ message : 'La categoría enviada no es válida' });
        }

        if (codigo !== undefined) product.codigo = codigo;
        if (descripcion !== undefined) product.descripcion = descripcion;
        if (precio !== undefined) product.precio = precio;
        if (categoria !== undefined) product.categoria = categoria;
        if (imagen !== undefined) product.imagen = imagen;

        await product.save();

        return res.status(200).json({
            message : 'El producto se ha actualizado correctamente',
            product: product
        });

    } catch (error) {
        console.error('Error al actualizar el producto: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message : 'No se encuentra un producto registrado con ese id' });
        }

        await product.deleteOne();

        return res.status(200).json({ message : 'El producto se ha eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar el producto: ', error);
        return res.status(500).json({ message : 'Error interno del servidor' });
    }
};