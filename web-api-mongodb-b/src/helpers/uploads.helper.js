const path = require('path');
const fs = require('fs');

const guardarArchivoB64 = (archivoB64, nombre) => {
    const imagen = Buffer.from(archivoB64, 'base64');
    const pathImagen = path.join(__dirname, '../../uploads', nombre);

    fs.writeFileSync(pathImagen, imagen);
} 

module.exports = {
    guardarArchivoB64
}