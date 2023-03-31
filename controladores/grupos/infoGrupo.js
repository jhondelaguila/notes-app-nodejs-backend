const getDB = require('../../bbdd/db');

const infoGrupo = async (req,res,next) => {

    let connection;

    try {
        connection = await getDB();

        const {idGrupo} = req.params;
        
        const [grupo] = await connection.query(
            `
            SELECT  t.id, t.categoria, t.titulo, t.fecha_creacion, t.fecha_modificacion, avg(ifnull(v.valoracion,0)) as valoracion
            FROM grupos t
            left join valoraciones v on(t.id = v.id_grupo)
            where t.id = ?;
            `,[idGrupo]
        );

        res.send({
            status: 'ok',
            data: grupo,
        });
    } catch (error) {
        next(error);
    }finally{
        if(connection) connection.release();
    }
};

module.exports = infoGrupo;