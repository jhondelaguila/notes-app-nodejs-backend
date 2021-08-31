const getDB = require("../bbdd/db");

const existeGrupo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idGrupo } = req.params;

    const [grupo] = await connection.query(
      `
            select id from grupos where id = ?;
            `,
      [idGrupo]
    );

    if (grupo.length < 1) {
      const error = new Error("Entrada no encontrada");
      error.httpStatus = 404;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = existeGrupo;
