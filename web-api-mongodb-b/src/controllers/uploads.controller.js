const path = require('path');
const fs = require('fs');

const getArchivo = async (req, res) => {
    try {
        const nombre = req.params.nombreArchivo;
        const pathArchivo = path.join(__dirname, '../../uploads', nombre);

        if (!fs.existsSync(pathArchivo)) {
            return res.status(404).json({
                message: "el archivo no existe"
            });
        }

        return res.sendFile(pathArchivo);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el archivo",
            error: error.message
        })
    }
}

module.exports = {
    getArchivo
}