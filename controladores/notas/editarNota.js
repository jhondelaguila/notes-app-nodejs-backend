const getDB = require('../../bbdd/db');
const {formatDate} = require('../../helpers');

const editarNota = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {idNota} = req.params;
        const {contenido, idUsuario} = req.body;

        const [propietario] = await connection.query(
            `
            select id_usuario from notas where id = ?;
            `,[idNota]
        );

        if(propietario[0].id_usuario !== idUsuario){
            const error = new Error('No puedes editar esta nota');
            error.httpStatus = 401;
            throw error;
        }

        if(!contenido){
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const now = new Date();

        await connection.query(
            `
            update notas set contenido = ?, fecha_modificacion = ? where id = ?;
            `,[contenido,formatDate(now), idNota]
        );

        res.send({
            status: 'ok',
            data: {
                id: idNota,
                contenido: contenido,
                fecha_modificacion: now,
            }
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editarNota;