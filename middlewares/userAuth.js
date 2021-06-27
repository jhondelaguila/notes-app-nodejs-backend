const getDB = require('../bbdd/db');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            const error = new Error('Falta la cabecera de autenticación');
            error.httpStatus = 401;
            throw error;
        }

        let tokenInfo;

        try {
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (error) {
            const err = new Error('Token no válido');
            err.httpStatus = 401;
            throw err;
        }

        // Creamos la propiedad "userAuth" en la request.
        req.userAuth = tokenInfo;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = userAuth;
