const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model');
const jwt = require('jsonwebtoken');
const secretJWT = process.env.SECRET_JWT;

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Verifica si existen los field en el body de peticion.
        if(!email.trim() ||!password.trim()){
            res.status(400).json({
                message:"Missing fields."
            })
        }

        const usuarioEncontrado = await Usuario.findOne({email});

        if (!usuarioEncontrado) {
            return res.status(200).json({
                message: "email o contraseña incorrecta"
            });
        }

        const passwordCorrecta = bcrypt.compareSync(password, usuarioEncontrado.password)

        if (!passwordCorrecta) {
            return res.status(200).json({
                message: "email o contraseña incorrecta"
            });
        }

        const payload = {
            usuario: {
                _id: usuarioEncontrado._id
            }
        }

        const token = jwt.sign(payload, secretJWT, {expiresIn: '1h'});

        return res.status(200).json({
            message: "acceso concedido",
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: "error al intentar loguearse",
            error: error.message
        })
    }
}

module.exports = {
    login
}