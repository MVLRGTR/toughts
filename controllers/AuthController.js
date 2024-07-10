const User = require('../models/User')
const Token = require('../models/Token')
const LoginAuth = require('../helpers/LoginAuth')
const SendEmail =  require('../service/email/EmailSend')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const { where } = require('sequelize')


module.exports = class AuthController {

    static AuthLogin(req, res) {
        res.render('auth/login')
    }

    static async AuthLoginPost(req, res) {
        const UserLogin = {
            email: req.body.email,
            password: req.body.password
        }

        const ValidationLogin = await LoginAuth.LoginAuthentication(UserLogin.email, UserLogin.password)
        console.log(`Validationlogin : ${JSON.stringify(ValidationLogin, null, 2)}`)

        if (ValidationLogin.validation) {
            const TokenPrimary = await User.findOne({
                where: { id: ValidationLogin.Userdb.id },
                attributes: ["primarylogin"]
            })
            if(TokenPrimary.primarylogin===false){
                req.flash('message','Para primeiro login Forneça o token enviado par o seu E-mail')
                res.redirect('/loginprimary')
                return
            }else{
                req.session.userid = ValidationLogin.Userdb.id
                req.flash('message','Login realizado com sucesso')
                res.redirect('/')
                return
            }

        } else {
            req.flash('message', 'Usuario ou senha incorreto !!!')
            res.render('auth/login')
            return
        }
    }

    static AuthLoginPrimary(req, res) {
        res.render('auth/loginprimary')

    }

    static async AuthLoginPrimaryPost(req, res) {
        const CheckLogin = {
            email: req.body.email,
            password: req.body.password,
            token: Number(req.body.token)
        }
        const CheckPrimaryLogin = await User.findOne({
            where: { email: CheckLogin.email },
            attributes: ["primarylogin"]
        })

        const ValidationLogin = await LoginAuth.LoginAuthentication(CheckLogin.email,CheckLogin.password)
        
        if (!ValidationLogin.validation) {
            req.flash('message', 'Usuario ou senha incorreto !!!')
            res.render('auth/loginprimary')
            return
        }
        if (CheckLogin.token === 0) {
            req.flash('message', 'O valor do token não pode ser nulo !!!')
            res.render('auth/loginprimary')
            return
        }

        const TokenValueUser = await Token.findOne({
            where: { UserId: ValidationLogin.Userdb.id },
        })

        const primarylogin = true

        if (!CheckPrimaryLogin.primarylogin) {
            if (CheckLogin.token === TokenValueUser.token) {
                User.update(
                    { primarylogin },
                    { where: { id: ValidationLogin.Userdb.id } }
                )
                req.session.userid = ValidationLogin.Userdb.id
                req.flash('message', 'Login realizado com sucesso')
                res.redirect('/')
                return
            } else {
                req.flash('message', 'Token fornecido incorreto !!!')
                res.render('auth/loginprimary')
            }
        } else {
            req.flash('message', 'Sua conta já foi checada  !!!')
            res.render('auth/login')
        }
    }

    static AuthRegister(req, res) {
        res.render('auth/register')
    }

    static async AuthRegisterPost(req, res) {

        // Gerando um número aleatorio para token de 4 digitos

        function GenerateRandomFourDigitNumber() {
            return Math.floor(1000 + Math.random() * 9000);
        }

        const UserRegister = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword
        }

        //Validações de Password e Usuario existente

        if (UserRegister.password != UserRegister.confirmpassword) {
            req.flash('message', 'As senhas não conferem , tente novamente ')
            res.render('auth/register')
            return
        }

        const CheckUserExist = await User.findOne({ where: { email: UserRegister.email } })

        if (CheckUserExist) {
            req.flash('message', 'Já temos um Usuario com esté e-mail')
            res.render('auth/register')
            return
        }

        //Criptografia com bcrypt
        const salt = await bcrypt.genSalt(10)
        const HashPassword = bcrypt.hashSync(UserRegister.password, salt)

        const UserPost = {
            name: UserRegister.name,
            email: UserRegister.email,
            password: HashPassword
        }

        try {
            const newUser = await User.create(UserPost)
            const TokenPrimaryLogin = GenerateRandomFourDigitNumber()
            const TokenUser = {
                token: TokenPrimaryLogin,
                UserId: newUser.id
            }

            Token.create(TokenUser)

            if(process.env.USE_EMAIL){
                SendEmail.EmailPrimaryLogin(UserPost.email,TokenPrimaryLogin)
            }

            req.flash('message', 'Usuario criado com sucesso !!! , Por favor verifique seu E-mail para validar seu Usuario')
            res.redirect('/loginprimary')

        } catch (erro) {
            console.log(erro)
        }

    }

    static ForgotPassword(req,res){
        res.render('auth/forgotpassword')
    }

    static async ForgotPasswordPost(req,res){
        const email = req.body.email

        function GenerateRandomFourDigitNumber() {
            return Math.floor(1000 + Math.random() * 9000);
        }

        const UserDb = await User.findOne({
            where:{email:email},
            attributes:["id","name","email"]
        })

        if(!UserDb){
            req.flash('message', 'Nenhuma conta encontrada com o e-mail fornecido !!!')
            return  res.redirect('/forgotpassword')
        }

        const token = GenerateRandomFourDigitNumber()

        await Token.update(
            {token},
            {where :{UserId:UserDb.id}}
        )

        if(process.env.USE_EMAIL){
            SendEmail.EmailForgotPassword(UserDb.email,token)
        }

        req.flash('message', 'Verifique no seu e-mail instruções para recuperção da sua conta')
        res.redirect('/forgotpasswordcheck')
    }

    static ForgotPasswordCheck(req,res){
        res.render('auth/forgotpasswordcheck')
    }

    static async ForgotPasswordCheckPost(req,res){

        console.log('entrou na controller CheckPost')

        const UserCredentials = {
            email : req.body.email,
            token : req.body.token,
            password : req.body.password,
            confirmpassword : req.body.confirmpassword
        }
        
        const UserDb = await User.findOne({
            where : {email:UserCredentials.email},
            attributes : ["id","name","email"]
        })

        if(!UserDb){
            req.flash('message', 'E-mail incorreto , por favor verifique sua entrada')
            return res.redirect('/forgotpasswordcheck')
        }

        const TokenUser = await Token.findOne({
            where : {UserId:UserDb.id}
        })

        if(TokenUser.token != UserCredentials.token){
            req.flash('message', 'Token incorreto , por favor verifique sua entrada')
            return res.redirect('/forgotpasswordcheck')
        }

        if(UserCredentials.password != UserCredentials.confirmpassword){
            req.flash('message', 'Confirmação de senha incorreto , por favor verifique sua entrada')
            return res.redirect('/forgotpasswordcheck')
        }

        console.log(`UserCredentials ${JSON.stringify(UserCredentials, null, 2)}}`)
        console.log(`UsertDb ${JSON.stringify(UserDb, null, 2)}}`)
        console.log(`TokenUser ${JSON.stringify(TokenUser, null, 2)}}`)

        const salt = await bcrypt.genSalt(10)
        const password = bcrypt.hashSync(UserCredentials.password, salt)

        await User.update(
            {password},
            {where :{id : UserDb.id}, email : UserCredentials.email}
        )

        req.flash('message', 'Senha recuperada com sucesso !!!')
        res.redirect('/login')

    }

    static Logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

    

}