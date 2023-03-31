const getDB = require("../../bbdd/db");
const { sendMail } = require("../../helpers");

const invitarCodigoGrupo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { email } = req.body;
    const { idGrupo } = req.params;
    const { idUsuario } = req.usuarioAutorizado;

    if (!email) {
      const error = new Error("Falta email");
      error.httpStatus = 400;
      throw error;
    }

    const [admin] = await connection.query(
      `select admin from grupos_usuarios where id_usuario = ? and id_grupo = ?`,
      [idUsuario, idGrupo]
    );

    console.log(admin[0].admin);
    if (admin[0].admin === 0) {
      const error = new Error(`No puedes invitar a gente a este grupo`);
      error.httpStatus = 404;
      throw error;
    }

    const [user] = await connection.query(
      `select * from usuarios where id = ?`,
      idUsuario
    );
    if (user.length === 0) {
      const error = new Error(`No existe ningún usuario con ese id`);
      error.httpStatus = 404;
      throw error;
    }

    const [group] = await connection.query(
      `select * from grupos where id=?;`,
      idGrupo
    );

    if (group.length === 0) {
      const error = new Error(`No existe ningún grupo con ese id`);
      error.httpStatus = 404;
      throw error;
    }

    const [invitaciones] = await connection.query(
      `select codigo_invitacion from invitaciones where id_grupo = ?;`,
      idGrupo
    );

    if (invitaciones.length === 0) {
      const error = new Error(
        `No existe ningún codigo de invitacion de este grupo `
      );
      error.httpStatus = 404;
      throw error;
    }

    // Comrpobamos si existe el email.
    const [usuario] = await connection.query(
      `SELECT * FROM usuarios WHERE email = ?;`,
      [email]
    );

    if (usuario.length === 0) {
      const error = new Error(`No existe ningún usuario con ese email`);
      error.httpStatus = 404;
      throw error;
    }

    const emailBody = `
            ${user[0].alias} te invita a formar parte del grupo ${group[0].titulo}.
            Si quieres entrar ingresa el siguiente codigo en el apartado INGRESAR GRUPO.

            El código de ingreso es: ${invitaciones[0].codigo_invitacion}

            ¡Gracias!
        `;

    // Enviamos el email.
    await sendMail({
      to: email,
      subject: `${user[0].alias} te invita al grupo ${group[0].titulo}`,
      body: emailBody,
    });

    res.send({
      status: "ok",
      message: "Email enviado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = invitarCodigoGrupo;
