require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const app = express();

const { PORT } = process.env;

const existeGrupo = require('./middlewares/existeGrupo');
const existeUsuario = require('./middlewares/existeUsuario');
const puedeEditarGrupo = require('./middlewares/puedeEditarGrupo');
const existeNota = require('./middlewares/existeNota');
const puedeEditarNota = require('./middlewares/puedeEditarNota');
const userAuth = require('./middlewares/userAuth');

const {
    listaNotas,
    infoNota,
    nuevaNota,
    valorarNota,
    editarNota,
    borrarNota,
    mediaValoracionNota,
} = require('./controladores/notas');

const {
    listaGrupos,
    infoGrupo,
    nuevoGrupo,
    valorarGrupo,
    editarGrupo,
    borrarGrupo,
    mediaValoracionGrupo,
} = require('./controladores/grupos');

const {
    obtenerUsuario,
    usuarioNuevo,
    validarUsuario,
    loginUsuario,
    editaUsuario,
    editaContraseña,
    recuperarContraseña,
    resetContraseña,
    borraUsuario,
} = require('./controladores/usuarios');

app.use(morgan('dev'));
app.use(express.json());

/**
 * #####################
 * ## Endpoints Notas ##
 * #####################
 */

app.get('/grupos/notas', listaNotas);
app.get('/temas/notas/:idNota', existeNota, infoNota);
app.post('/grupos/notas', nuevaNota);
app.post('/temas/notas/:idNota/valoracion', existeNota, valorarNota);
app.put('/temas/notas/:idNota', existeNota, puedeEditarNota, editarNota);
app.delete('/temas/notas/:idNota', existeNota, puedeEditarNota, borrarNota);
app.get(
    '/grupos/notas/:idNota/mediavaloracion',
    existeNota,
    mediaValoracionNota
);

/**
 * ######################
 * ## Endpoints Grupos ##
 * ######################
 */

app.get('/grupos', listaGrupos);
app.get('/grupos/:idGrupo', existeGrupo, infoGrupo);
app.post('/grupos', nuevoGrupo);
app.post('/grupos/:idGrupo/valoracion', existeGrupo, valorarGrupo);
app.put('/grupos/:idGrupo', existeGrupo, puedeEditarGrupo, editarGrupo);
app.delete('/grupos/:idGrupo', existeGrupo, puedeEditarGrupo, borrarGrupo);
app.get('/grupos/:idGrupo/mediavaloracion', existeGrupo, mediaValoracionGrupo);

/**
 * ########################
 * ## Endpoints Usuarios ##
 * ########################
 */
app.get('/Usuarios/:idUsuario', existeUsuario, obtenerUsuario);
//Crea un usuario nuevo "da error"
app.post('/Usuarios', usuarioNuevo);
// Validar usuario
app.get('/Usuarios/validacion/:codigoRegistro', validarUsuario);
//Login de usuario
app.post('/Usuarios/login', loginUsuario);
//Editar usuario
app.put('/Usuarios/:idUsuario', editaUsuario);
//Edita contraseña
app.put(
    '/Usuarios/:idUsuario/contraseña',
    userAuth,
    existeUsuario,
    editaContraseña
);
//Envia correo de recuperación
app.put('/Usuarios/contraseña/recuperarContraseña', recuperarContraseña);
// Resetea contraseña con codigo
app.put('/Usuarios/contraseña/reset', resetContraseña);
//Elimina usuario
app.delete('/Usuarios/:idUsuario', userAuth, existeUsuario, borraUsuario);

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
