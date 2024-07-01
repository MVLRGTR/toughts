const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
require('dotenv').config()

const ToughtRouter = require('./routes/ToughtRouter')
const ToughtController = require('./controllers/ToughtController')
const AuthRoutes = require('./routes/AuthRoutes')
const CommentRouter = require('./routes/CommentRoutes')

//Models
const tought = require('./models/Tought')
const user = require('./models/User')
const comment = require('./models/Comment')

//Configuração express url e json
const app = express()
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

//public path
app.use('/public',express.static('public'))

//handlebars configuração padrão
const hbs = exphbs.create({
    partialsDir : ['views/partials']
})
app.engine('handlebars',hbs.engine)
app.set('view engine' , 'handlebars')

const db =  require('./db/connection')

//session middleware
app.use(
    session({
        name:'session',
        secret:'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store : new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(),'sessions') //falo aonde será gravado os arquivos temp das sessões
        }),
        cookie:{
            secure:false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

//flash messages
app.use(flash())

//set session
app.use((req,res,next)=>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})

//Routes
app.get('/',ToughtController.ShowAllToughts)
app.use('/toughts',ToughtRouter)
app.use('/',AuthRoutes)
app.use('/comments',CommentRouter)



//adicionar {force:true} dentro do sync para resetar o bacno de dados
db.sync().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`App rodando na porta : ${process.env.PORT}`)
    })
}).catch(
    (erro)=>{
        console.log(`Erro ao conectar ao banco : ${erro}`)
    }
)