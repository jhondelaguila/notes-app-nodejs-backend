const getDB = require('../../bbdd/db');

const borrarTema = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {idTema} = req.params;
        const {idUsuario} = req.body;

        const [propietario] = await connection.query(
            `
           select id_usuario from temas where id = ?
            `,[idTema]
        );

        if(propietario[0].id_usuario !== idUsuario){
            const error = new Error('No tienes permisos para eliminar esta entrada');
            error.httpStatus = 401;
            throw error;
        }

        await connection.query(`delete from temas where id = ?`,[idTema]);

        res.send({
            status: 'ok',
            message: `El tema con id ${idTema} ha sido eliminada`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = borrarTema;