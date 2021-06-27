const getDB = require('../../bbdd/db');

const listaNotas = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {search, order, direction } = req.query;

        const validOrderFields = ['contenido','fecha','valoracion'];
        const validOrderDirection = ['DESC','ASC'];

        const orderBy = validOrderFields.includes(order) ? order : 'valoracion';
        const orderDirection = validOrderDirection.includes(direction) ? direction: 'ASC';

        let resultados;

        if (search) {
            [resultados] = await connection.query(
                `
                SELECT  n.id, n.contenido,n.fecha_creacion,n.fecha_modificacion,n.id_grupo, n.id_usuario, avg(ifnull(v.valoracion,0)) as valoracion
                FROM notas n
                left join valoraciones v on(n.id = v.id_nota)
                where n.contenido = ?
                group by n.id, n.contenido,n.fecha_creacion,n.fecha_modificacion,n.id_grupo, n.id_usuario
                order by ${orderBy} ${orderDirection};
                `,
                [`%${search}%`]
            );
        } else {
            [resultados] = await connection.query(`
                SELECT  n.id, n.contenido,n.fecha_creacion,n.fecha_modificacion,n.id_grupo, n.id_usuario, avg(ifnull(v.valoracion,0)) as valoracion
                FROM notas n
                left join valoraciones v on(n.id = v.id_nota)
                group by n.id, n.contenido,n.fecha_creacion,n.fecha_modificacion,n.id_grupo, n.id_usuario
                order by ${orderBy} ${orderDirection};
            `);
        }

        res.send({
            status: 'ok',
            data: resultados,
        });

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = listaNotas;