const { savePhoto, deletePhoto } = require("../../helpers");
const getDB = require("../../bbdd/db");

const cargarImagenAvatar = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    const { idUsuario } = req.usuarioAutorizado;

    const [usuario] = await connection.query(
      `SELECT email, alias, avatar FROM usuarios WHERE id = ?`,
      [idUsuario]
    );

    if (usuario.length === 0) throw new Error("El usuario no existe");

    if (req.files && req.files.avatar) {
      if (usuario[0].avatar) {
        await deletePhoto(usuario[0].avatar);
      }

      const avatarName = await savePhoto(req.files.avatar);

      await connection.query(
        `
                update usuarios set avatar = ? where id = ?;
                `,
        [avatarName, idUsuario]
      );

      res.send({
        avatar: avatarName,
      });
    } else {
      throw new Error("No se subio ningun fichero");
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = cargarImagenAvatar;
