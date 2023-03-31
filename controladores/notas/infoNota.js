const getDB = require("../../bbdd/db");

const infoNota = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idNota } = req.params;

    const [nota] = await connection.query(
      `
            SELECT  n.id,n.titulo, n.contenido,n.fecha_creacion,n.fecha_modificacion,n.id_grupo, n.id_usuario, avg(ifnull(v.valoracion,0)) as valoracion
            FROM notas n
            left join valoraciones v on(n.id = v.id_nota)
            where n.id = ?
            `,
      [idNota]
    );

    console.log(nota);
    res.send({
      status: "ok",
      nota,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = infoNota;
