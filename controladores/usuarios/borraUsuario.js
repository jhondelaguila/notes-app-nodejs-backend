const getDB = require('../../bbdd/db');

const borraUsuario = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUsuario } = req.params;

        // Comprobamos que idUser no sea 1 (el administrador).
        if (Number(idUsuario) === 1) {
            const error = new Error(
                'El administrador principal no puede ser eliminado'
            );
            error.httpStatus = 403;
            throw error;
        }

        // Comprobamos si el usuario que intenta borrar no es el propio usuario

        if (req.userAuth.idUsuario !== Number(idUsuario)) {
            const error = new Error(
                'No tienes permisos para eliminar a este usuario'
            );
            error.httpStatus = 401;
            throw error;
        }

        // Hacemos un update en la tabla de usuarios.
        await connection.query(
            `
                UPDATE usuarios
                SET contraseña = ?, alias = "[deleted]", activo = 0, deleted = 1, 
                WHERE id = ?;
            `,
            [generateRandomString(40), idUsuario]
        );

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

module.exports = borraUsuario;
