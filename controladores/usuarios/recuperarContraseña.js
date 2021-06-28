const getDB = require('../../bbdd/db');
const { generaCadenaAleatoria, sendMail } = require('../../helpers');

const recuperarContraseña = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email } = req.body;

        if (!email) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Comrpobamos si existe el email.
        const [usuario] = await connection.query(
            `SELECT id FROM usuarios WHERE email = ?;`,
            [email]
        );

        if (usuario.length < 1) {
            const error = new Error(`No existe ningún usuario con ese email`);
            error.httpStatus = 404;
            throw error;
        }

        // Generamos un código de recuperación.
        const codigoRecuperacion = generaCadenaAleatoria(20);

        // Creamos el body con el mensaje.
        const emailBody = `
            Se solicitó un cambio de contraseña para el usuario registrado con este email en la app Wmark.

            El código de recuperación es: ${codigoRecuperacion}

            Si no has sido tu por favor, ignora este email.

            ¡Gracias!
        `;

        // Enviamos el email.
        await sendMail({
            to: email,
            subject: 'Cambio de contraseña en Wmark',
            body: emailBody,
        });

        // Agregamos el código de recuperación al usuario con dicho email.
        await connection.query(
            `UPDATE usuarios SET codigoRecuperacion = ? WHERE email = ?;`,
            [codigoRecuperacion, email]
        );

        res.send({
            status: 'ok',
            message: 'Email enviado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = recuperarContraseña;
