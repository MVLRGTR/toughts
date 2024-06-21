const { where } = require('sequelize')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController{
    
    static AuthLogin(req,res){
        res.render('auth/login')
    }

    static async AuthLoginPost(req,res){
        const UserLogin = {
            email : req.body.email,
            password : req.body.password
        }

        const Userdb= await User.findOne({where:{email:UserLogin.email}})

        if(!Userdb){
            req.flash('message','Usuario ou senha incorreto !!!')
            res.render('auth/login')
            return
        }

        const password = bcrypt.compareSync(UserLogin.password,Userdb.password)

        if(password){
            req.session.userid = Userdb.id
            req.flash('message','Login realizado com sucesso')
            res.redirect('/')
        }
        else{
            req.flash('message','Usuario ou senha incorreto !!!')
            res.redirect('/login')
        }
        
    }

    static AuthRegister(req,res){
        res.render('auth/register')
    }

    static async AuthRegisterPost(req,res){
        
        const UserRegister = {
            name : req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword
        }

        //Validações de Password e Usuario existente

        if(UserRegister.password != UserRegister.confirmpassword){
            req.flash('message','As senhas não conferem , tente novamente ')
            res.render('auth/register')
            return
        }

        const CheckUserExist = await User.findOne({ where: {email:UserRegister.email}})

        if(CheckUserExist){
            console.log('Entrou aqui')
            req.flash('message','Já temos um Usuario com esté e-mail')
            res.render('auth/register')
            return
        }

        //Criptografia com bcrypt
        const salt = await bcrypt.genSalt(10)
        const HashPassword =  bcrypt.hashSync(UserRegister.password,salt)
        
        const UserPost={
            name : UserRegister.name,
            email : UserRegister.email,
            password : HashPassword
        }

        try{
            const newUser = await User.create(UserPost) 

            //Inicializando a sessão do Usuario newUser traz um retorno da ORM ao cadastrar UserPost no bd
            req.session.userid = newUser.id

            req.flash('message','Usuario criado com sucesso !!!')

            req.session.save(()=>{
                res.redirect('/')
            })

            
        }catch(erro){
            console.log(erro)
        }

    }

    static Logout (req,res){
        req.session.destroy()
        res.redirect('/login')
    }

}