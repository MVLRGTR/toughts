const nodemailer =require('nodemailer')
require('dotenv').config()

const transport = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: process.env.PORT_EMAIL,
    secure: false,
    auth:{
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD_EMAIL
    }
})

async function main (to, subject , body){
    try{
        const info = await transport.sendMail({
            from: process.env.FROM_EMAIL,
            to,
            subject,
            html:body
        })
        return info.messageId
    }
    catch(erro){
        console.log(`Erro no envio do e-mail : ${erro}`)
    }
}


module.exports = main