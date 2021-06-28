const obtenerUsuario = require('./obtenerUsuario');
const usuarioNuevo = require('./usuarioNuevo');
const validarUsuario = require('./validarUsuario');
const loginUsuario = require('./loginUsuario');
const editaUsuario = require('./editaUsuario');
const editaContraseña = require('./editaContraseña');
const recuperarContraseña = require('./recuperarContraseña');
const cambiarContraseña = require('./cambiarContraseña');
const borrarUsuario = require('./borrarUsuario');

module.exports = {
    obtenerUsuario,
    usuarioNuevo,
    validarUsuario,
    loginUsuario,
    editaUsuario,
    editaContraseña,
    recuperarContraseña,
    cambiarContraseña,
    borrarUsuario,
};
