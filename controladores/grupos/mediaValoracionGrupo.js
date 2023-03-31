const getDB = require('../../bbdd/db');

const mediaValoracionGrupo = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {idGrupo} = req.params;

        const [media] = await connection.query(
            `
            select avg(valoracion) as valoracion
            from valoraciones
            where id_grupo = ?; 
            `,[idGrupo]
            );

            res.send({
                status: 'ok',
                data: {
                "media valoracion": media[0].valoracion,
                },
            });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = mediaValoracionGrupo;