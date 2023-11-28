const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', usuariosController.index);
router.get('/:id', usuariosController.getById);
router.post('/', usuariosController.create);
router.delete('/:id', usuariosController.delete);
router.patch('/:id', usuariosController.updateParcial);
router.put('/:id', usuariosController.updateCompleto);
router.put('/:id/imagen-perfil', usuariosController.updateImagenPerfil);

module.exports = router;