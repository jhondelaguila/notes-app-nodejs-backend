const getDB = require('../../bbdd/db');
const { formatDate } = require('../../helpers');

const nuevaNota = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { contenido, idGrupo , idUsuario } = req.body;

        if (!contenido || !idGrupo || !idUsuario) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const now = new Date();

        const [nota] = await connection.query(
            `
            insert into notas(contenido, fecha_creacion, fecha_modificacion,id_grupo, id_usuario)
            values(?,?,null,?,?)
            `,
            [contenido, formatDate(now),idGrupo, idUsuario]
        );

        const { insertId } = nota;

        res.send({
            status: 'ok',
            data: {
                id: insertId,
                idUsuario,
                contenido,
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

module.exports = nuevaNota;