const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const MailMessage = require('nodemailer/lib/mailer/mail-message')
const OAuth2 = google.auth.OAuth2

const sendMail = async (mail, code) => {

    const client = new OAuth2(
        process.env.GOOGLE_ID,
        process.env.GOOGLE_SECRET,
        process.env.GOOGLE_URL
    )

    client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH,
    })

    const accessToken = client.getAccessToken()

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_USER,
            type: 'OAuth2',
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH,
            accessToken: accessToken
        },

        tls: {
            rejectUnauthorized: false
        }
    })

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to: mail,
        subject: 'Sportacus verification mail',
        html: `
            <div>
            <h1>Hola, ${mail}!</h1>
            <h3>Estas un paso mas cerca de disfrutar de todos los beneficios de ser parte de Sportacus!</h3>
            <a href='http://localhost:4000/auth/verify/${code}'>Click para verificar tu mail</a>
            <h3>Sportacus</h3>
            </div>
        `
    }

    await transport.sendMail(mailOptions, (error, response) => {
        if(error){
            console.log(error)
        } else {
            console.log('OK')
        }
    })
}

module.exports = sendMail