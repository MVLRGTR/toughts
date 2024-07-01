const Tought = require('../models/Tought')
const User = require('../models/User')
const {Op} = require('sequelize')

module.exports = class ToughtsController {

    static async ShowAllToughts(req, res) {
        
        let search =''
        let order ='desc'

        if(req.query.search){
            search = req.query.search
        }

        if(req.query.order === 'old'){
            order = 'asc'
        }else{
            order = 'desc'
        }

        // const ToughtsAll = await Tought.findAll({
        //     include: {
        //         model: User,
        //         attributes: ['id', 'name', 'email']
        //     },
        //     raw: true,
        //     nest: true
        // });

        const Toughts = await Tought.findAll({
            include: User,
            where:{
                title:{[Op.like] : `%${search}%`}
            },
            order :[['createdAt',order]],
            raw : true,
            nest : true
        })

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const day = String(date.getDate()).padStart(2, '0'); 
          
            return `${day}-${month}-${year}`;
        }
        
        console.log(`Toughts ${JSON.stringify(Toughts, null, 2)}}`)

        const ToughtsAll = Toughts.map((elemento)=>{
            if(elemento.createdAt.getTime()===elemento.updatedAt.getTime()){
                return {
                    id: elemento.id,
                    title: elemento.title,
                    createdAt: formatDate(new Date(elemento.createdAt)),
                    updatedAt: formatDate(new Date(elemento.updatedAt)),
                    dateupdate:false,
                    UserId: elemento.UserId,
                    User: elemento.User
                }
            }else{
                return {
                    id: elemento.id,
                    title: elemento.title,
                    createdAt: formatDate(new Date(elemento.createdAt)),
                    updatedAt :formatDate(new Date(elemento.updatedAt)),
                    dateupdate:true,
                    UserId: elemento.UserId,
                    User: elemento.User
                }
            }
        })

        console.log(`ToughtsUpdateDate ${JSON.stringify(ToughtsAll, null, 2)}}`)

        let toughtsqti = ToughtsAll.length

        if(toughtsqti === 0){
            toughtsqti = false
        }

        res.render('toughts/home',{ToughtsAll,search,toughtsqti})
    }

    static async Dashboard(req, res) {
        const Userid = req.session.userid

        const UserDb = await User.findOne({
            where: { id: Userid, },
            include: Tought,
            plain: true,
        })

        if (!UserDb) {
            res.redirect('/login')
        }

        // console.log(`UserDb : ${JSON.stringify(UserDb, null, 2)}`)

        const ToughtsUser = UserDb.Toughts.map((result) => result.dataValues)

        let emptyToughts =  false

        if(ToughtsUser.length === 0 ){
            emptyToughts = true
        }
       
        res.render('toughts/dashboard', { ToughtsUser ,emptyToughts})
    }

    static AddToughts(req, res) {
        res.render('toughts/addtoughts')
    }

    static async AddToughtsPost(req, res) {

        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }


        try {
            await Tought.create(tought)
            req.flash('message', 'Pensamento criado com sucesso !!!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (erro) {
            console.log(erro)
        }

    }

    static async EditToughts(req, res) {
        const idtought = req.params.idtought

        try {

            const tought = await Tought.findOne({ raw: true, where: { id: idtought } })
            console.log(`Tought ${tought}`)
            if (!tought) {
                req.flash('message', 'Nenhum pensamento com esse id encontrado !!!')
                req.session.save(() => {
                    res.redirect('/toughts/dashboard')
                })
                return
            }
            res.render('toughts/edittought', { tought })

        } catch (erro) {
            console.log(erro)
        }  

    }

    static async EditToughtsSave(req, res) {
        const title = req.body.title
        const id = req.body.id
        const IdUserReq = req.body.iduser

        try {
            await Tought.update({ title }, { where: { id: id, UserId: IdUserReq } })
            req.flash('message', 'Pensamento editado com sucesso !!!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (erro) {
            console.log(erro)
        }


    }

    static async DeleteTought(req, res) {
        const ToughtUserId = req.body.id
        const IdUserReq = req.body.iduser

        try {
            await Tought.destroy({ where: { id: ToughtUserId, UserId: IdUserReq } })
            req.flash('message', 'Pensamento Deletado com sucesso !!!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (erro) {
            console.log(erro)
        }
    }

}