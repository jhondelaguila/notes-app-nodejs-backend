const getDB = require("../../bbdd/db");
const { formatDate } = require("../../helpers");

const aceptarCodigoGrupo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { codigoGrupo } = req.body;

    if (!codigoGrupo) {
      const error = new Error("Ingresa el codigo de invitacion");
      error.httpStatus = 400;
      throw error;
    }

    const [grupo] = await connection.query(
      `select * from grupos where codigo_invitacion = ?`,
      codigoGrupo
    );

    if (grupo.length === 0) {
      const error = new Error("Codigo incorrecto");
      error.httpStatus = 400;
      throw error;
    }

    const [usuario] = await connection.query(
      `select * from usuarios where codigo_grupo = ?;`,
      codigoGrupo
    );

    if (usuario.length === 0) {
      const error = new Error("Codigo incorrecto");
      error.httpStatus = 400;
      throw error;
    }

    const now = new Date();
    console.log(usuario[0].alias, formatDate(now), grupo[0].id, usuario[0].id);

    await connection.query(
      `insert into notas(titulo, contenido, fecha_creacion, fecha_modificacion,id_grupo, id_usuario)
      values(?,?,?,null,?,?);`[
        (usuario[0].alias,
        usuario[0].alias,
        formatDate(now),
        grupo[0].id,
        usuario[0].id)
      ]
    );
    console.log("llego hasta aqui");
    await connection.query(
      `insert into grupos_usuarios(id_usuario,id_grupo)
      values (?,?);`,
      [usuario[0].id, grupo[0].id]
    );

    await connection.query(
      `update grupos set codigo_invitacion = null where id = ?`,
      grupo[0].id
    );

    await connection.query(
      `update usuarios set codigo_grupo = null where id = ?`,
      usuario[0].id
    );

    res.send({
      status: "ok",
      message: "Invitación aceptada con éxito",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = aceptarCodigoGrupo;
