const getDB = require('../../bbdd/db');

const resetContraseña = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { codigoRecuperacion, nuevaContraseña } = req.body;

        if (!codigoRecuperacion || !nuevaContraseña) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }
        // Obtenemos el usuario que tenga ese código de recuperación.
        const [usuario] = await connection.query(
            `SELECT id FROM usuarios WHERE codigoRecuperacion = ?;`,
            [codigoRecuperacion]
        );

        if (usuario.length < 1) {
            const error = new Error('Código de recuperación incorrecto');
            error.httpStatus = 404;
            throw error;
        }
        // Actualizamos la contraseña del usuario que tenga ese código de recuperación.
        await connection.query(
            `UPDATE usuarios SET contraseña = SHA2(?, 512), codigoRecuperacion = NULL, WHERE id = ?;`,
            [nuevaContraseña, user[0].id]
        );

        res.send({
            status: 'ok',
            message: 'Contraseña actualizada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = resetContraseña;
