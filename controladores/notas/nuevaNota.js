const getDB = require("../../bbdd/db");
const { formatDate } = require("../../helpers");

const nuevaNota = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { contenido, idGrupo } = req.body;
    const { idUsuario } = req.usuarioAutorizado;

    if (!contenido || !idGrupo || !idUsuario) {
      const error = new Error("Faltan campos");
      error.httpStatus = 400;
      throw error;
    }

    const now = new Date();

    const [nota] = await connection.query(
      `
            insert into notas(contenido, fecha_creacion, fecha_modificacion,id_grupo, id_usuario)
            values(?,?,null,?,?)
            `,
      [contenido, now, idGrupo, idUsuario]
    );

    const { insertId } = nota;

    const [createdNote] = await connection.query(
      `SELECT * FROM notas WHERE id = ?`,
      insertId
    );

    res.send({
      status: "ok",
      data: createdNote[0],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = nuevaNota;
