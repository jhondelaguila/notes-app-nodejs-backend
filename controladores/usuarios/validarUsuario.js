const getDB = require('../../bbdd/db');

const validarUsuario = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { CodigoRegistro } = req.body;

        // Comprobamos si hay algún usuario pendiente de validar con ese código.
        const [usuario] = await connection.query(
            `SELECT id FROM usuarios WHERE codigo_registro = ?;`,
            [CodigoRegistro]
        );
        
        if (usuario.length < 1) {
            const error = new Error(
                'No hay usuarios pendientes de validar con este código'
            );
            error.httpStatus = 404;
            throw error;
        }
        // Activamos el usuario y eliminamos el código.
        await connection.query(
            `UPDATE usuarios SET activo = true, codigo_registro = NULL WHERE codigo_registro = ?;`,
            [CodigoRegistro]
        );

        res.send({
            status: 'ok',
            message: 'Usuario verificado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = validarUsuario;
