const getDB = require("../../bbdd/db");

const obtenerNotasUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUsuario } = req.usuarioAutorizado;

    const [notas] = await connection.query(
      `
           select * from notas where id_usuario = ?;
            `,
      [idUsuario]
    );

    res.send({
      status: "ok",
      notas,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = obtenerNotasUsuario;
