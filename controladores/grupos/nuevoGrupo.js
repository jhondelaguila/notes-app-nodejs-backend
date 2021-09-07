const getDB = require("../../bbdd/db");
const { validate, formatDate } = require("../../helpers");
const { esquemaNuevoGrupo } = require("../../esquemas/grupos");

const nuevoGrupo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //Validamos los datos
    await validate(esquemaNuevoGrupo, req.body);

    const { titulo } = req.body;
    const { idUsuario } = req.usuarioAutorizado;

    if (!titulo || !idUsuario) {
      const error = new Error("Faltan campos");
      error.httpStatus = 400;
      throw error;
    }

    const now = new Date();

    const [grupo] = await connection.query(
      `
            insert into grupos( titulo, fecha_creacion,fecha_modificacion,id_usuario)
            values(?,?,null,?);
            `,
      [titulo, formatDate(now), idUsuario]
    );
    const [idGrupo] = await connection.query(
      `
            select id from grupos where fecha_creacion = ?;
            `,
      [formatDate(now)]
    );

    // console.log("idgrupo:", idGrupo[0].id);
    await connection.query(
      `
            insert into grupos_usuarios(id_usuario,id_grupo,admin)
            values(?,?,true);
            `,
      [idUsuario, idGrupo[0].id]
    );

    const { insertId } = grupo;

    const [createdGroup] = await connection.query(
      `SELECT * FROM grupos WHERE id_usuario = ? and id = ?`,
      [idUsuario, insertId]
    );

    res.send({
      status: "ok",
      data: createdGroup[0],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = nuevoGrupo;
