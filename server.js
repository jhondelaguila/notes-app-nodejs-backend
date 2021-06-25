require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const app = express();

const { PORT } = process.env;

const existeTema = require('./middlewares/existeTema');
const existeUsuario = require('./middlewares/existeUsuario'); 
const puedeEditarTema = require('./middlewares/puedeEditarTema');
const existeNota = require('./middlewares/existeNota');
const puedeEditarNota = require('./middlewares/puedeEditarNota');

const {
    listaNotas, 
    infoNota,
    nuevaNota,
    valorarNota,
    editarNota,
    borrarNota,
} = require('./controladores/notas');

const {
    listaTemas, 
    infoTema, 
    nuevoTema, 
    valorarTema, 
    editarTema, 
    borrarTema,
} = require('./controladores/temas');

const {
    obtenerUsuario,
    usuarioNuevo,
    validarUsuario,
    loginUsuario,
} = require('./controladores/usuarios');

app.use(morgan('dev'));
app.use(express.json());

/**
 * #####################
 * ## Endpoints Notas ##
 * #####################
 */

 app.get('/temas/notas', listaNotas);
 app.get('/temas/notas/:idNota',existeNota,infoNota );
 app.post('/temas/notas', nuevaNota);
 app.post('/temas/notas/:idNota/valoracion',existeNota, valorarNota);
 app.put('/temas/notas/:idNota',existeNota, puedeEditarNota, editarNota);
 app.delete('/temas/notas/:idNota',existeNota, puedeEditarNota, borrarNota );

/**
 * #####################
 * ## Endpoints Temas ##
 * #####################
 */

app.get('/temas', listaTemas);
app.get('/temas/:idTema', existeTema, infoTema);
app.post('/temas', nuevoTema);
app.post('/temas/:idTema/valoracion', existeTema, valorarTema);
app.put('/temas/:idTema',existeTema, puedeEditarTema, editarTema);
app.delete('/temas/:idTema', existeTema, puedeEditarTema, borrarTema);


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
