const getDB = require("../../bbdd/db");

const abandonarGrupo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idGrupo } = req.params;
    const { idUsuario } = req.usuarioAutorizado;

    const [grupo] = await connection.query(
      `select * from grupos where id = ?`,
      idGrupo
    );

    await connection.query(`delete from notas where id_grupo = ?`, idGrupo);
    await connection.query(
      `delete from grupos_usuarios where id_grupo = ? and id_usuario =?`,
      [idGrupo, idUsuario]
    );

    res.send({
      status: "ok",
      message: `Has abandonado el grupo ${grupo[0].titulo}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = abandonarGrupo;
