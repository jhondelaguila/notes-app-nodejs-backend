const getDB = require("../../bbdd/db");

const listaGruposUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUsuario } = req.usuarioAutorizado;

    const [grupos] = await connection.query(
      `select * from grupos where id_usuario = ?`,
      idUsuario
    );

    console.log(grupos);
    res.send({
      status: "ok",
      grupos,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listaGruposUsuario;
