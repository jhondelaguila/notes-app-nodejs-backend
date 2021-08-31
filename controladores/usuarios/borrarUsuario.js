const getDB = require('../../bbdd/db');
const {
    generaCadenaAleatoria,
    deletePhoto,
} = require('../../helpers');

const borrarUsuario = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {idUsuario} = req.params;

        // if(Number(idUsuario) === 1){
        //     const error = new Error('El administrador principal no puede ser eliminado');
        //     error.httpStatus = 403;
        //     throw error;
        // }

        if(req.usuarioAutorizado.idUsuario !== Number(idUsuario)){
            const error = new Error('No tienes permisos para eliminar este usuario');
            error.httpStatus = 401;
            throw error;
        }
        console.log(1);
        // Obtenemos el nombre del avatar.
        const [usuario] = await connection.query(
            `SELECT avatar FROM usuarios WHERE id = ?;`,
            [idUsuario]
        );

        // Si el usuario tiene avatar lo borramos del disco.
        if (usuario[0].avatar) {
           await deletePhoto(usuario[0].avatar);
        }
        console.log(2);
        await connection.query(
            `
            update usuarios
            set contraseña = ?, alias = "[deleted]", avatar = null, activo = 0, borrado = 1
            where id = ?;
            `,[generaCadenaAleatoria(40), idUsuario]
        );
        console.log(3);
        res.send({
            status: 'ok',
            message: 'Usuario eliminado',
        });

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = borrarUsuario;