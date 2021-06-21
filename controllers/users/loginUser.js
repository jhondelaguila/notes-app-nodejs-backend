const getDB = require('../../bbdd/db');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            `SELECT id, role, active FROM users WHERE email = ? AND password = SHA2(?, 512);`,
            [email, password]
        );

        console.log(email, password);
        console.log(user);

        // Si no existe el usuario...
        if (user.length < 1) {
            const error = new Error('Email o contraseña incorrectos');
            error.httpStatus = 401;
            throw error;
        }

        // Si existe pero no está activo...
        if (!user[0].active) {
            const error = new Error('Usuario pendiente de validar');
            error.httpStatus = 401;
            throw error;
        }

        // Creamos un objeto con información que le pasaremos al token.
        const tokenInfo = {
            idUser: user[0].id,
            role: user[0].role,
        };

        // Creamos el token.
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '7d',
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

module.exports = loginUser;
