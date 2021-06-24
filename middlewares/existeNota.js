const getDB = require('../bbdd/db');

const existeNota = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {idNota} = req.params;

        const [nota] = await connection.query(
            `
            select id from notas where id = ?;
            `,[idNota]
        );

        if(nota.length < 1){
            const error = new Error('Entrada no encontrada');
            error.httpStatus = 404;
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = existeNota;