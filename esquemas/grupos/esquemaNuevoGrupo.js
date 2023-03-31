const Joi = require("joi");

const esquemaNuevoGrupo = Joi.object().keys({
  titulo: Joi.string()
    .required()
    .min(2)
    .max(50)
    .error((errors) => {
      switch (errors[0].code) {
        case "any.required":
          return new Error("Se requiere titulo");
        default:
          return new Error("La categoria debe tener entre 2 y 50 caracteres");
      }
    }),
});

module.exports = esquemaNuevoGrupo;
