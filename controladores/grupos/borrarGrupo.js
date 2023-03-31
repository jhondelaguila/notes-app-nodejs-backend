const { contentType } = require("mime-types");
const getDB = require("../../bbdd/db");

const borrarGrupo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idGrupo } = req.params;
    const { idUsuario } = req.usuarioAutorizado;

    const [propietario] = await connection.query(
      `
           select admin from grupos_usuarios where id_grupo = ? and id_usuario = ?
            `,
      [idGrupo, idUsuario]
    );
    console.log(idGrupo, idUsuario);
    console.log(propietario);

    if (propietario[0].admin === 0) {
      const error = new Error("No tienes permisos para eliminar esta entrada");
      error.httpStatus = 401;
      throw error;
    }
    // await connection.query("set foreign_key_checks=0;");

    await connection.query(
      `delete from grupos_usuarios where id_grupo=?`,
      idGrupo
    );

    await connection.query(
      `delete from invitaciones where id_grupo = ?`,
      idGrupo
    );

    await connection.query(`delete from notas where id_grupo = ?`, idGrupo);

    await connection.query(`delete from grupos where id = ?`, [idGrupo]);

    // await connection.query("set foreign_key_checks=1;");

    res.send({
      status: "ok",
      message: `El grupo con id ${idGrupo} ha sido eliminado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = borrarGrupo;
