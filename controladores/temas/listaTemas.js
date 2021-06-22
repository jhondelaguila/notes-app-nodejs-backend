const getDB = require('../../bbdd/db');

const listaTemas = async (req, res, next) =>{
    let connection;

    try {
        connection = await getDB();

        const {search, order, direction } = req.query;

        const validOrderFields = ['titulo','fecha','valoracion'];
        const validOrderDirection = ['DESC','ASC'];

        const orderBy = validOrderFields.includes(order) ? order : 'valoracion';
        const orderDirection = validOrderDirection.includes(direction) ? direction: 'ASC';
        
        let resultados;

        if (search) {
            [results] = await connection.query(
                `
                SELECT  t.id, t.privada, t.categoria, t.titulo, t.fecha_creacion, t.fecha_modificacion t.id_usuario, avg(ifnull(v.valoracion,0)) as valoracion
                FROM temas t
                left join valoraciones v on(t.id = v.id_tema)
                where t.titulo like ?
                group by t.id, t.privada, t.categoria, t.titulo, t.fecha_creacion,t.fecha_modificacion, t.id_usuario
                order by ${orderBy} ${orderDirection};
                `,
                [`%${search}%`]
            );
        } else {
            [results] = await connection.query(`
                SELECT  t.id, t.privada, t.categoria, t.titulo, t.fecha_creacion,t.fecha_modificacion, t.id_usuario, avg(ifnull(v.valoracion,0)) as valoracion
                FROM temas t
                left join valoraciones v on(t.id = v.id_tema)
                group by t.id, t.privada, t.categoria, t.titulo, t.fecha_creacion,t.fecha_modificacion, t.id_usuario
                order by ${orderBy} ${orderDirection};
            `);
        }

        res.send({
            status: 'ok',
            data: results,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = listaTemas;

