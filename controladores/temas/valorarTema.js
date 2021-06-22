const getDB = require('../../bbdd/db');

const valorarTema = async (req,res,next)=>{
    let connection;

    try {
        connection = await getDB();

        // const {idUsuario} = req.userAuth;
        const {idTema} = req.params;
        const{valoracion, idUsuario, idNota} = req.body;
        
        if(valoracion < 1 || valoracion > 5){
            const error = new Error('El voto debe estar entre 1 y 5');
            error.httpStatus = 400;
            throw error;
        }

        const [propietario] = await connection.query(
            `
            select id_usuario from temas where id = ?;
            `,[idTema]
        );
        
        if (propietario[0].id_usuario === idUsuario) {
            const error = new Error('No puedes votar tu propia entrada');
            error.httpStatus = 403;
            throw error;
        }

        const [yaHaVotado] = await connection.query(
            `
            select id_usuario, id_tema from valoraciones where id_usuario = ? and id_tema = ?;
            `,[idUsuario,idTema]
        );

        if(yaHaVotado.length > 0){
            const error = new Error('Ya votaste esta entrada anteriormente');
            error.httpStatus = 403;
            throw error;
        }
        
        await connection.query(
            `
           insert into valoraciones (id_usuario,id_tema,id_nota, valoracion)
           values (?,?,?,?);
            `,[idUsuario,idTema,idNota,valoracion]
        );

        const [nuevaMedia] = await connection.query(
            `
            select avg(valoracion) as valoracion
            from valoraciones
            where id_tema = ?; 
            `,[idTema]
        );

        res.send({
            status: 'ok',
            data: {
                valoracion: nuevaMedia[0].valoracion,
            }
        });
    } catch (error) {
        next(error);
    }finally{
        if(connection) connection.release();
    }
};

module.exports = valorarTema;