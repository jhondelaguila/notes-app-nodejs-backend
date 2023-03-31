const getDB = require("../../bbdd/db");

const editaContraseña = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUsuario } = req.usuarioAutorizado;
    const { password, newPassword } = req.body;

    // Comprobamos si no somos dueños de este usuario.
    if (req.usuarioAutorizado.idUsuario !== Number(idUsuario)) {
      const error = new Error("No tienes permisos para editar este usuario");
      error.httpStatus = 403;
      throw error;
    }

    // Comprobamos que la contraseña tenga al menos 8 caracteres,
    // de lo contrario...
    if (newPassword.length < 8) {
      const error = new Error(
        "La nueva contraseña debe tener un mínimo de 8 caracteres"
      );
      error.httpStatus = 400;
      throw error;
    }

    // Comprobamos si la contraseña antigua es correcta.
    const [usuario] = await connection.query(
      `SELECT contraseña FROM usuarios WHERE id = ? AND contraseña = SHA2(?, 512);`,
      [idUsuario, password]
    );
    console.log(usuario);

    if (usuario.length < 1) {
      const error = new Error("Contraseña incorrecta");
      error.httpStatus = 401;
      throw error;
    }

    // Guardamos la nueva contraseña.
    await connection.query(
      `UPDATE usuarios SET contraseña = SHA2(?, 512) WHERE id = ?;`,
      [newPassword, idUsuario]
    );

    res.send({
      status: "ok",
      message: "Contraseña actualizada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editaContraseña;
