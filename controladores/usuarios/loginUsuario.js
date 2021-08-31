const getDB = require('../../bbdd/db');
const jwt = require('jsonwebtoken');

const loginUsuario = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email,  password } = req.body;
        if (!email || !password) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }
        const [usuario] = await connection.query(
            `SELECT id, activo FROM usuarios WHERE email = ? AND contraseña = SHA2(?, 512);`,
            [email, password]
        );

        // Si no existe el usuario...
        if (usuario.length < 1) {
            const error = new Error('Email o contraseña incorrectos');
            error.httpStatus = 401;
            throw error;
        }

        // Si existe pero no está activo...
        if (usuario[0].active === 0) {
            const error = new Error('Usuario pendiente de validar');
            error.httpStatus = 401;
            throw error;
        }
        // Creamos un objeto con información que le pasaremos al token.
        const tokenInfo = {
            idUsuario: usuario[0].id
        };
        // Creamos el token.
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '5d',
        });
        res.send({
            status: 'ok',
            data: {
                id: usuario[0].id,
                email,
                password,
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
