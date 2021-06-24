const getDB = require('../../bbdd/db');
const jwt = require('jsonwebtoken');

const loginUsuario = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, contraseña } = req.body;
        if (!email || !contraseña) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }
        const [usuario] = await connection.query(
            `SELECT id, role, active FROM usuarios WHERE email = ? AND contraseña = SHA2(?, 512);`,
            [email, contraseña]
        );

        // Si no existe el usuario...
        if (usuario.length < 1) {
            const error = new Error('Email o contraseña incorrectos');
            error.httpStatus = 401;
            throw error;
        }

        // Si existe pero no está activo...
        if (!usuario[0].active) {
            const error = new Error('Usuario pendiente de validar');
            error.httpStatus = 401;
            throw error;
        }
        // Creamos un objeto con información que le pasaremos al token.
        const tokenInfo = {
            idUsuario: usuario[0].id,
            role: usuario[0].role,
        };
        // Creamos el token.
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '5d',
        });

        res.send({
            status: 'ok',
            data: {
                token,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = loginUsuario;
