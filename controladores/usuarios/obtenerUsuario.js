const getDB = require('../../bbdd/db');

const obtenerUsuario = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { idUsuario } = req.params;
        const [usuario] = await connection.query(
            `select id, email, contraseña, alias, avatar from usuarios where id =?;`,
            [idUsuario]
        );

        const infoUsuario = {
            alias: usuario[0].alias,
            avatar: usuario[0].avatar,
        };

        if (usuario[0].id === req.usuarioAutorizado.idUsuario) {
            infoUsuario.email = usuario[0].email;
            infoUsuario.contraseña = usuario[0].contraseña;
        }

        res.send({
            status: 'ok',
            data: infoUsuario,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = obtenerUsuario;
