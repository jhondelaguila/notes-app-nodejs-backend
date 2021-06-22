const getDB = require('../bbdd/db');

const existeTema = async (req,res,next)=>{

    let connection;

    try {
        connection = await getDB();    

        const {idTema} = req.params;

        const [tema] = await connection.query(
            `
            select id from temas where id = ?;
            `,[idTema]
        );

        if(tema.length < 1){
            const error = new Error('Entrada no encontrada');
            error.httpStatus = 404;
            throw error;
        }
        next();

    } catch (error) {
        next(error);
    }finally{
        if(connection) connection.release();
    }
};

module.exports = existeTema;