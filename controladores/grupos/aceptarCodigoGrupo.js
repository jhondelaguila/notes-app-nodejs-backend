const getDB = require("../../bbdd/db");

const aceptarCodigoGrupo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { codigoGrupo } = req.body;
    const { idUsuario } = req.params;

    if (!codigoGrupo) {
      const error = new Error("Ingresa el codigo de invitacion");
      error.httpStatus = 400;
      throw error;
    }

    const [grupo] = await connection.query(
      `select * from invitaciones where codigo_invitacion = ?`,
      codigoGrupo
    );

    let [nuevoGrupo] = await connection.query(
      `select * from grupos where id = ?`,
      grupo[0].id_grupo
    );
    if (grupo.length === 0) {
      const error = new Error("Codigo incorrecto");
      error.httpStatus = 400;
      throw error;
    }

    const [usuario] = await connection.query(
      `select * from usuarios where id = ?`,
      idUsuario
    );
    console.log(usuario[0].id, grupo[0].id);

    await connection.query(
      `insert into grupos_usuarios(id_usuario,id_grupo)
      values (?,?);`,
      [usuario[0].id, grupo[0].id_grupo]
    );
    console.log("llego hasta aqui2");
    const [isAdmin] = await connection.query(
      `select * from grupos_usuarios where id_grupo = ? and id_usuario = ?`,
      [grupo[0].id_grupo, idUsuario]
    );

    console.log(isAdmin);

    nuevoGrupo = [{ ...nuevoGrupo[0], admin: isAdmin[0].admin }];

    console.log(nuevoGrupo);
    res.send({
      status: "ok",
      nuevoGrupo: nuevoGrupo[0],
      message: "Invitacion aceptada con éxito",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = aceptarCodigoGrupo;
