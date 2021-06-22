const getDB = require('../../bbdd/db');

const infoTema = async (req,res,next) => {

    let connection;

    try {
        connection = await getDB();

        const {idTema} = req.params;
        
        const [tema] = await connection.query(
            `
            SELECT  t.id, t.privada, t.categoria, t.titulo, t.fecha_creacion, t.fecha_modificacion, t.id_usuario, avg(ifnull(v.valoracion,0)) as valoracion
            FROM temas t
            left join valoraciones v on(t.id = v.id_tema)
            where t.id = ?;
            `,[idTema]
        );

        res.send({
            status: 'ok',
            data: tema,
        });
    } catch (error) {
        next(error);
    }finally{
        if(connection) connection.release();
    }
};

module.exports = infoTema;