const obtenerUsuario = require('./obtenerUsuario');
const usuarioNuevo = require('./usuarioNuevo');
const validarUsuario = require('./validarUsuario');
const loginUsuario = require('./loginUsuario');
const editaUsuario = require('./editaUsuario');
const editaContraseña = require('./editaContraseña');
const recuperarContraseña = require('./recuperarContraseña');
const resetContraseña = require('./resetContraseña');
const borraUsuario = require('./borraUsuario');

module.exports = {
    obtenerUsuario,
    usuarioNuevo,
    validarUsuario,
    loginUsuario,
    editaUsuario,
    editaContraseña,
    recuperarContraseña,
    resetContraseña,
    borraUsuario,
};
