const getDB = require("../../bbdd/db");

const listaNotas = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { search, order, direction } = req.params;

    const validOrderFields = ["contenido", "fecha", "valoracion"];
    const validOrderDirection = ["DESC", "ASC"];

    const orderBy = validOrderFields.includes(order) ? order : "valoracion";
    const orderDirection = validOrderDirection.includes(direction)
      ? direction
      : "DESC";

    console.log(search);
    let resultados;
    // avg(ifnull(v.valoracion,0)) as valoracion
    if (search) {
      [resultados] = await connection.query(
        `
        select * from notas where contenido like "%?%" and id_usuario = ? order by fecha_creacion ${orderDirection};
        ;
                `,
        [search]
      );
    } else {
      [resultados] = await connection.query(`
                SELECT  n.id, n.contenido,n.fecha_creacion,n.fecha_modificacion
                FROM notas n
                left join valoraciones v on(n.id = v.id_nota)
                where n.id_usuario = ?
                group by n.id, n.contenido,n.fecha_creacion,n.fecha_modificacion,n.id_grupo, n.id_usuario
                order by ${orderBy} ${orderDirection};
            `);
    }
    console.log(resultados);
    res.send({
      status: "ok",
      data: resultados,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listaNotas;
