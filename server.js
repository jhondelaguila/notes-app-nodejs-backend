require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { PORT } = process.env;

const app = express();

const existeTema = require('./middlewares/existeTema');
//Importamos controladores de usuarios
const existeUsuario = require('./middlewares/existeUsuario');

const {
    listaTemas,
    infoTema,
    nuevoTema,
    valorarTema,
    editarTema,
} = require('./controladores/temas');

const {
    obtenerUsuario,
    usuarioNuevo,
    validaUsuario,
    loginUsuario,
} = require('./controladores/usuarios');

app.use(morgan('dev'));
app.use(express.json());

/**
 * ########################
 * ## Endpoints Temas ##
 * ########################
 */

app.get('/temas', listaTemas);
app.get('/temas/:idTema', existeTema, infoTema);
app.post('/temas', nuevoTema);
app.post('/temas/:idTema/valoracion', existeTema, valorarTema);
app.put('/temas/:idTema', existeTema, editarTema);
/**
 * ########################
 * ## Endpoints Usuarios ##
 * ########################
 */
app.get('/Usuarios/:idUsuario', existeUsuario, obtenerUsuario);
//Crea un usuario nuevo "da error"
app.post('/Usuarios', usuarioNuevo);
// Validar usuario
app.get('/Usuarios/validacion/:CodigoRegistro', validaUsuario);
//Login de usuario
app.post('/Usuarios/login', loginUsuario);

/**
 * #######################
 * ## Error & Not Found ##
 * #######################
 */

app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
