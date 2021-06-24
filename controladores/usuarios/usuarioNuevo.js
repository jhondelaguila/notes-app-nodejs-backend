const getDB = require('../../bbdd/db');

const { generaCadenaAleatoria, sendMail } = require('../../helpers');

const usuarioNuevo = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, contraseña } = req.body;

        if (!email || !contraseña) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        //Comprobamos si existe el email
        const [usuario] = await connection.query(
            `SELECT id FROM usuarios WHERE email = ?;`,
            [email]
        );

        if (usuario.length > 0) {
            const error = new Error(
                'Ya existe un usuario con ese email en la base de datos'
            );
            error.httpStatus = 409;
            throw error;
        }
        // creamos código de registro de un solo uso.
        const CodigoRegistro = generaCadenaAleatoria(40);

        // Mensaje que enviaremos al usuario.
        const emailBody = `
            Te acabas de registrar en Wmark
            Pulsa en este link para verificar tu cuenta: ${process.env.PUBLIC_HOST}/Usuarios/validacion/${CodigoRegistro}
        `;
        // Enviamos el mensaje.
        await sendMail({
            to: email,
            subject: 'Activa tu usuario de Wmark',
            body: emailBody,
        });
        // Guardamos al usuario en la base de datos junto al código de registro.
        await connection.query(
            `INSERT INTO usuarios (email, contraseña, codigoRegistro,) VALUES (?, SHA2(?, 512), ?, ?);`
        );

        res.send({
            status: 'ok',
            data: 'Usuario registrado, comprueba tu email para activarlo',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = usuarioNuevo;
