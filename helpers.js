const { format } = require('date-fns');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const sharp = require('sharp');
const uuid = require('uuid');
const { ensureDir, unlink } = require('fs-extra');
const path = require('path');
const { esquemaNuevoGrupo } = require('./esquemas');

const { UPLOADS_DIRECTORY } = process.env;
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);


function formatDate(date) {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
}

// Generamos una cadena de caracteres aleatoria.

function generaCadenaAleatoria(length) {
    return crypto.randomBytes(length).toString('hex');
}
//asignamos el ApiKey a Sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//enviar email.
async function sendMail({ to, subject, body }) {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_FROM,
            subject,
            text: body,
            html: `
                <div>
                    <h1>${subject}</h1>
                    <p>${body}</p>
                </div>
            `,
        };
        await sgMail.send(msg);
    } catch (error) {
        throw new Error('Error enviando email');
    }
};

async function savePhoto(image) {
    // Comprobamos que el directorio de subida de imágenes existe.
    await ensureDir(uploadsDir);

    // Leer la imagen con sharp.
    const sharpImage = sharp(image.data);

    // Comprobamos que la imagen no tenga un tamaño mayor que "X" píxeles de ancho.
    // Para ello obtenemos los metadatos de la imagen.
    const imageInfo = await sharpImage.metadata();

    // Definimos el ancho máximo.
    const IMAGE_MAX_WIDTH = 1000;

    // Si la imagen supera el ancho máximo definido anteriormente redimensionamos la
    // imagen.
    if (imageInfo.width > IMAGE_MAX_WIDTH) {
        sharpImage.resize(IMAGE_MAX_WIDTH);
    }

    // Generamos un nombre único para la imagen.
    const savedImageName = `${uuid.v4()}.jpg`;

    // Unimos el directorio de imagenes con el nombre de la imagen.
    const imagePath = path.join(uploadsDir, savedImageName);

    // Guardamos la imagen en el directorio de imágenes.
    await sharpImage.toFile(imagePath);

    // Retornamos el nombre del fichero.
    return savedImageName;
}

async function deletePhoto(photoName) {
    const photoPath = path.join(uploadsDir, photoName);
    await unlink(photoPath);
}

async function validate(esquema, data){
    try {
        await esquema.validateAsync(data);
    } catch (error) {
        error.httpStatus = 400;
        throw error;
    }
}


module.exports = {
    formatDate,
    generaCadenaAleatoria,
    sendMail,
    savePhoto,
    deletePhoto,
    validate,
};


