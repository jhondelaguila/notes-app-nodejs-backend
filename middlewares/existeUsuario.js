const getDB = require('../bbdd/db');

const existeUsuario = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { idUsuario } = req.params;

        const [usuario] = await connection.query(
            `select id from usuarios where id = ?;`,
            [idUsuario]
        );

        if (usuario.length < 1) {
            const error = new Error('Usuario no encontrado');
            error.httpStatus = 404;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = existeUsuario;
