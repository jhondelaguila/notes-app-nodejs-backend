const getDB = require("../../bbdd/db");

const cambiarContraseña = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { codigoRecuperacion, newPassword } = req.body;

    if (!codigoRecuperacion || !newPassword) {
      const error = new Error("Faltan campos");
      error.httpStatus = 400;
      throw error;
    }

    const [usuario] = await connection.query(
      `
            select id from usuarios where codigoRecuperacion = ?;
            `,
      [codigoRecuperacion]
    );

    if (usuario.length < 1) {
      const error = new Error("Código de recuperación incorrecto");
      error.httpStatus = 404;
      throw error;
    }

    await connection.query(
      `
            update usuarios set contraseña = SHA2(?,512), codigoRecuperacion = null where id = ?;
            `,
      [newPassword, usuario[0].id]
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

module.exports = cambiarContraseña;
