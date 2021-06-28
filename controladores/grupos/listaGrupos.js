const getDB = require('../../bbdd/db');

const listaGrupos = async (req, res, next) =>{
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
            [resultados] = await connection.query(
                `
                SELECT  t.id, t.categoria, t.titulo, t.fecha_creacion, t.fecha_modificacion, avg(ifnull(v.valoracion,0)) as valoracion
                FROM grupos t
                left join valoraciones v on(t.id = v.id_grupo)
                where t.titulo like ?
                group by t.id, t.privada, t.categoria, t.titulo, t.fecha_creacion,t.fecha_modificacion
                order by ${orderBy} ${orderDirection};
                `,
                [`%${search}%`]
            );
        } else {
            [resultados] = await connection.query(`
                SELECT  t.id, t.categoria, t.titulo, t.fecha_creacion, t.fecha_modificacion, avg(ifnull(v.valoracion,0)) as valoracion
                FROM grupos t
                left join valoraciones v on(t.id = v.id_grupo)
                group by t.id, t.categoria, t.titulo, t.fecha_creacion,t.fecha_modificacion
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

module.exports = listaGrupos;

