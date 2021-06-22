const getDB = require('../../bbdd/db');
const { formatDate } = require('../../helpers');

const nuevoTema = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { privada, categoria, titulo, idUsuario } = req.body;

        if (!privada || !titulo || !idUsuario) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const now = new Date();

        const [tema] = await connection.query(
            `
            insert into temas(privada, categoria, titulo, fecha_creacion, fecha_modificacion, id_usuario)
            values(?,?,?,?,null,?)
            `,
            [privada, categoria, titulo, formatDate(now), idUsuario]
        );

        const { insertId } = tema;

        res.send({
            status: 'ok',
            data: {
                id: insertId,
                idUsuario,
                privada,
                categoria,
                titulo,
                fecha_creacción: now,
                valoracion: 0,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = nuevoTema;
