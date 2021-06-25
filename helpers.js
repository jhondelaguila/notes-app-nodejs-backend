const { format } = require('date-fns');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');


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


module.exports = {
    formatDate,
    generaCadenaAleatoria,
    sendMail,
};
