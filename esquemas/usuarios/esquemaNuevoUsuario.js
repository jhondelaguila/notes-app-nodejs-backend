const Joi = require('joi');

const esquemaNuevoUsuario = Joi.object().keys({
    email: Joi.string().required().email().error((errors)=>{
        switch(errors[0].code){
            case 'any.required':
                return new Error('Se requiere email');
            default: 
                return new Error('El email no es válido');
        }
    }),
    contraseña: Joi.string().required().alphanum().min(8).max(50).error((errors)=>{
        switch(errors[0].code){
            case 'any.required':
                return new Error('Se requiere contraseña');
            default: 
                return new Error('La contraseña debe tener entre 8 y 50 caracteres');
        }
    }),
    alias: Joi.string().required().min(2).max(50).error((errors)=>{
        switch(errors[0].code){
            case 'any.required':
                return new Error('Se requiere alias');
            default: 
                return new Error('El alias debe tener entre 2 y 50 caracteres');
        }
    }),
});

module.exports = esquemaNuevoUsuario;