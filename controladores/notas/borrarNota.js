const getDB = require('../../bbdd/db');

const borrarNota = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {idNota} = req.params;
        const {idUsuario} = req.usuarioAutorizado;

        const [propietario] = await connection.query(
            `
           select id_usuario from notas where id = ?
            `,[idNota]
        );

        if(propietario[0].id_usuario !== idUsuario){
            const error = new Error('No tienes permisos para eliminar esta entrada');
            error.httpStatus = 401;
            throw error;
        }
        await connection.query('set foreign_key_checks=0;')

        await connection.query(`delete from notas where id = ?`,[idNota]);

        await connection.query('set foreign_key_checks=1;')

        res.send({
            status: 'ok',
            message: `El tema con id ${idNota} ha sido eliminada`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = borrarNota;