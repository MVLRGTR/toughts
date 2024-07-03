const { where } = require('sequelize')
const User = require('../models/User')
const Token = require('../models/Token')
const bcrypt = require('bcryptjs')
const LoginAuth = require('../helpers/LoginAuth')

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
        // const Userdb = await User.findOne({ where: { email: UserLogin.email } })
        // console.log(`UserDb : ${JSON.stringify(Userdb, null, 2)}`)

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

        // if(!Userdb){
        //     req.flash('message','Usuario ou senha incorreto !!!')
        //     res.render('auth/login')
        //     return
        // }

        // const password = bcrypt.compareSync(UserLogin.password,Userdb.password)

        // if(password){

        //     const TokenPrimary = await User.findOne({
        //         where:{id:Userdb.id},
        //         attributes:["primarylogin"]
        //     })

        //     if(TokenPrimary.primarylogin===false){
        //         req.flash('message','Para primeiro login Forneça o token enviado par o seu E-mail')
        //         res.redirect('/loginprimary')
        //         return
        //     }else{
        //         req.session.userid = Userdb.id
        //         req.flash('message','Login realizado com sucesso')
        //         res.redirect('/')
        //         return
        //     }

        // }
        // else{
        //     req.flash('message','Usuario ou senha incorreto !!!')
        //     res.redirect('/login')
        // }
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

        const Userdb = await User.findOne({ where: { email: CheckLogin.email } })
        const password = bcrypt.compareSync(CheckLogin.password, Userdb.password)
        if (!Userdb || !password) {
            req.flash('message', 'Usuario ou senha incorreto !!!')
            res.render('auth/loginprimary')
            return
        }
        if (CheckLogin.token === 0) {
            console.log('entrou')
            req.flash('message', 'O valor do token não pode ser nulo !!!')
            res.render('auth/loginprimary')
            return
        }

        const TokenValueUser = await Token.findOne({
            where: { UserId: Userdb.id },
        })

        const primarylogin = true

        if (!CheckPrimaryLogin.primarylogin) {
            if (CheckLogin.token === TokenValueUser.token) {
                User.update(
                    { primarylogin },
                    { where: { id: Userdb.id } }
                )
                req.session.userid = Userdb.id
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
            console.log(`Valor do token gerado : ${TokenPrimaryLogin}`)
            Token.create(TokenUser)

            //Inicializando a sessão do Usuario newUser traz um retorno da ORM ao cadastrar UserPost no bd

            // req.session.userid = newUser.id
            // req.flash('message','Usuario criado com sucesso !!!')
            // req.session.save(()=>{
            //     res.redirect('/')
            // })

            req.flash('message', 'Usuario criado com sucesso !!! , Por favor verifique seu E-mail para validar seu Usuario')
            res.redirect('/login')

        } catch (erro) {
            console.log(erro)
        }

    }

    static Logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

}