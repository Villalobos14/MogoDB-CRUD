require('dotenv').config();
require('./src/configs/db.config');

const express = require('express');
const app = express();
const PORT = process.env.PORT;

const usuariosRouter = require('./src/routes/usuarios.route');
const uploadsRouter = require('./src/routes/uploads.route');
const authRouter = require('./src/routes/auth.route');

app.use(express.json());
app.use('/usuarios', usuariosRouter);
app.use('/uploads', uploadsRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log("API escuchando en el puerto " + PORT);
});