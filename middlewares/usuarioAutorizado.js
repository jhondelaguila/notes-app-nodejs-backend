const getDB = require("../bbdd/db");
const jwt = require("jsonwebtoken");

const usuarioAutorizado = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const { authorization } = req.headers;

    if (!authorization) {
      const error = new Error("Falta la cabecera de autenticación");
      error.httpStatus = 401;
      throw error;
    }

    let tokenInfo;

    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    } catch (err) {
      const error = new Error("Token no válido");
      err.httpStatus = 401;
      throw error;
    }

    // Creamos la propiedad "usuarioAutorizado" en la request.
    req.usuarioAutorizado = tokenInfo;
    console.log(tokenInfo);

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = usuarioAutorizado;
