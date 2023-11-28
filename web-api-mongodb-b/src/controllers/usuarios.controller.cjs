import bcrypt from 'bcrypt'
const saltosBycript = parseInt(process.env.SALTOS_BCRYPT);
import usuarioModel from '../models/usuario.model';
import uploadsHelper from '../helpers/uploads.helper';

// query string params
// /usuarios?page=1&limit=2

export async function  index (req, res) {
    try {
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        const usuarios = await UsuarioModel.find({ deleted: false }).skip(skip).limit(limit);

        let response = {
            message: "se obtuvieron correctamente los usuarios",
            data: usuarios
        }

        if (page && limit) {
            const totalUsuarios = await UsuarioModel.countDocuments({ deleted: false });
            const totalPages = Math.ceil(totalUsuarios / limit);

            response = {
                ...response,
                total: totalUsuarios,
                totalPages,
            }
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los usuarios",
            error: error.message
        })
    }
}

// /usuarios/:id
export async function  getById (req, res) {
    try {
        const usuarioId = req.params.id;
        const usuario = await usuarioModel.findById(usuarioId);

        if (!usuario) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "se obtuvo el usuario correctamente",
            usuario,
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el usuario",
            error: error.message
        })
    }
}

export async function  create (req, res) {
    try {
        let usuario = new UsuarioModel({
            nombre: req.body.nombre,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, saltosBycript),
            createdBy: req.usuario._id
        });

        await usuario.save();

        return res.status(201).json({
            mensaje: "usuario creado exitosamente!"
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "no se pudo crear el usuario",
            error: error.message
        });
    }
}

// /usuario/:id
export async function  updateParcial (req, res) {
    try {
        const usuarioId = req.params.id;

        if(req.body.id){
            delete req.body.id
        }

        const datosActualizar = {
            ...req.body,
            updated_at: new Date()
        };

        const usuarioActualizado = await usuarioModel.findByIdAndUpdate(usuarioId, datosActualizar);

        if (!usuarioActualizado) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "usuario actualizado exitosamente"
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: "no se pudo actualizar el usuario",
            error: error.message
        });
    }
}

export async function  updateCompleto (req, res) {
    try {
        const usuarioId = req.params.id;
        const datosActualizar = {
            nombre: req.body.nombre || null,
            email: req.body.email || null,
            password: req.body.password || null,
            updated_at: new Date()
        }

        const usuarioActualizado = await usuarioModel.findByIdAndUpdate(usuarioId, datosActualizar);

        if (!usuarioActualizado) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "usuario actualizado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "no se pudo actualizar el usuario",
            error: error.message
        });
    }
}

export async function  updateImagenPerfil (req, res) {
    try {
        const idUsuario = req.params.id;
        const usuarioEncontrado = await UsuarioModel.findById(idUsuario);

        if (!usuarioEncontrado) {
            return res.status(404).json({
                message: "el usuario no existe"
            })
        }

        const { b64, extension } = req.body;
        const nombreImagen = idUsuario + Date.now() + "." + extension;

        uploadsHelper.guardarArchivoB64(b64, nombreImagen);

        usuarioEncontrado.imagenPerfil = nombreImagen;
        await usuarioEncontrado.save()

        return res.status(200).json({
            message: "imagen de perfil actualizada exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al cargar la imagen",
            error: error.message
        })
    }
}

// usuarios/:id
export async function  deleteLogico (req, res) {
    try {
        const usuarioId = req.params.id;
        const usuarioEliminado = await usuarioModel.findByIdAndUpdate(usuarioId, { deleted: true, deleted_at: new Date() });

        if (!usuarioEliminado) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "usuario eliminado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "no se pudo eliminar el usuario",
            error: error.message
        });
    }
}

// usuarios/:id
export async function deleteFisico (req, res) {
    try {
        const usuarioId = req.params.id;
        const usuarioEliminado = await usuarioModel.findByIdAndDelete(usuarioId);

        if (!usuarioEliminado) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "usuario eliminado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "no se pudo eliminar el usuario",
            error: error.message
        });
    }
};
