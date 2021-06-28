const getDB = require('../../bbdd/db');
const { formatDate,validate } = require('../../helpers');
const {esquemaNuevoGrupo} = require('../../esquemas');

const nuevoGrupo = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        //Validamos los datos
        await validate(esquemaNuevoGrupo, req.body);

        const { categoria, titulo} = req.body;
        const { idUsuario } = req.usuarioAutorizado;

        if (!categoria|| !titulo || !idUsuario) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const now = new Date();

        const [grupo] = await connection.query(
            `
            insert into grupos(categoria, titulo, fecha_creacion,fecha_modificacion,id_usuario)
            values(?,?,?,null,?);
            `,
            [categoria, titulo, formatDate(now),idUsuario]
        );
        const [idGrupo] = await connection.query(
            `
            select id from grupos where fecha_creacion = ?;
            `,[formatDate(now)]
            );

        await connection.query(
            `
            insert into grupos_usuarios(id_usuario,id_grupo,admin)
            values(?,?,true);
            `,[idUsuario,idGrupo[0].id]
            );

        const { insertId } = grupo;

        res.send({
            status: 'ok',
            data: {
                id: insertId,
                idUsuario,
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

module.exports = nuevoGrupo;
