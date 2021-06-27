const getDB = require('../../bbdd/db');

const editaUsuario = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const { idUsuario } = req.params;
        const { alias, email } = req.body;

        // Comprobamos si no somos dueños de este usuario.
        if (req.idUsuario !== Number(idUsuario)) {
            const error = new Error(
                'No tienes permisos para editar este usuario'
            );
            error.httpStatus = 403;
            throw error;
        }

        // Si no llega ningún dato lanzamos un error.
        if (!alias && !email) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }
        // Obtenemos el email del usuario actual.
        const [usuario] = await connection.query(
            `SELECT email, alias FROM usuarios WHERE id = ?`,
            [idUsuario]
        );

        /**
         * ###########
         * ## Email ##
         * ###########
         *
         * En caso de que haya email, comprobamos si es distinto al existente.
         *
         */
        if (email && email !== usuario[0].email) {
            // Comrpobamos que el nuevo email no este repetido.
            const [existeEmail] = await connection.query(
                `SELECT id FROM usuarios WHERE email = ?;`,
                [email]
            );
            if (existeEmail.length > 0) {
                const error = new Error(
                    'Ya existe un usuario con el email proporcionado en la base de datos'
                );
                error.httpStatus = 409;
                throw error;
            }
            // Si hemos llegado hasta aquí procederemos a actualizar el email del usuario.
            await connection.query(`UPDATE usuarios SET email = ?`, [
                email,
                idUsuario,
            ]);
        }

        /**
         * ##########
         * ## alias ##
         * ##########
         *
         * En caso de que haya alias, comprobamos si es distinto al existente.
         *
         */
        if (alias && usuario[0].alias !== alias) {
            await connection.query(
                `UPDATE usuarios SET alias = ?, WHERE id = ?`,
                [alias, idUsuario]
            );
        }

        res.send({
            status: 'ok',
            message: 'Datos de usuario actualizados',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editaUsuario;
