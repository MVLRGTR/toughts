const Tought = require('../models/Tought')
const User = require('../models/User')
const Comment = require('../models/Comment')
const { where } = require('sequelize')
const {Op} = require('sequelize')

module.exports = class CommentsController {

    static async AddComment(req, res) {
        const idtought = req.params.idtought
        const idUser = req.session.userid

        const UserToughtdb = await Tought.findOne({
            include: {
                model: User,
                attributes: ["id", "name"]
            },
            where: { id: idtought },
            attributes: ["id", "title", "createdAt", "updatedAt"],
            raw: true,
            nest: true
        })

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${day}-${month}-${year}`;
        }

        const UserTought = {
            id: UserToughtdb.id,
            title: UserToughtdb.title,
            createdAt: formatDate(new Date(UserToughtdb.createdAt)),
            updatedAt: formatDate(new Date(UserToughtdb.updatedAt)),
            dateupdate: UserToughtdb.createdAt.getTime() !== UserToughtdb.updatedAt.getTime(),
            User: UserToughtdb.User
        };


        console.log(`Valor de UserTought ${JSON.stringify(UserTought, null, 2)}}`)

        res.render('comment/commentadd', { UserTought, idUser })

    }

    static async AddCommentPost(req, res) {
        const commentAdd = {
            comment: req.body.comment,
            UserId: req.session.userid,
            ToughtId: req.body.toughtid
        }

        try {
            await Comment.create(commentAdd)
            req.flash('message', 'Comentário adicionado com sucesso !!!')
            req.session.save(() => {
                res.redirect(`/comments/${commentAdd.ToughtId}`)
            })
        } catch (erro) {
            res.status(500).send("Erro ao processar operação")
        }

    }

    static async ShowCommentsToughtId(req, res) {
        const idtought = req.params.idtought
        let search = ''
        let searchActive = false
        let order = 'desc'
        
        if(req.query.search){
            search =  req.query.search
            searchActive = true
        }

        if(req.query.order === 'old'){
            order = 'asc'
        }else{
            order = 'desc'
        }

        const ToughtCommentsdb = await Comment.findAll({
            include: {
                model: User,
                attributes: ["name"]
            },
            where: { 
                ToughtId: idtought,
                comment : {[Op.like] : `%${search}%`}
             },
            order :[['createdAt',order]],
            raw: true,
            nest: true
        })

        const UserToughtdb = await Tought.findOne({
            include: {
                model: User,
                attributes: ["id", "name"]
            },
            where: { id: idtought },
            attributes: ["id", "title", "createdAt", "updatedAt"],
            raw: true,
            nest: true
        })

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${day}-${month}-${year}`;
        }

        const UserTought = {
            id: UserToughtdb.id,
            title: UserToughtdb.title,
            createdAt: formatDate(new Date(UserToughtdb.createdAt)),
            updatedAt: formatDate(new Date(UserToughtdb.updatedAt)),
            dateupdate: UserToughtdb.createdAt.getTime() !== UserToughtdb.updatedAt.getTime(),
            User: UserToughtdb.User
        };

        const ToughtComments = ToughtCommentsdb.map((elemento) => {
            if (elemento.createdAt.getTime() === elemento.updatedAt.getTime()) {
                return {
                    id: elemento.id,
                    comment: elemento.comment,
                    createdAt: formatDate(new Date(elemento.createdAt)),
                    updatedAt: formatDate(new Date(elemento.updatedAt)),
                    dateupdate: false,
                    UserId: elemento.UserId,
                    User: elemento.User
                }
            } else {
                return {
                    id: elemento.id,
                    comment: elemento.comment,
                    createdAt: formatDate(new Date(elemento.createdAt)),
                    updatedAt: formatDate(new Date(elemento.updatedAt)),
                    dateupdate: false,
                    UserId: elemento.UserId,
                    User: elemento.User
                }
            }
        })

        let empty = true
        let commentsqti = ToughtComments.length
        if (ToughtComments.length > 0) {
            empty = false
        }

        console.log(`Valor do search : ${search}`)
        console.log(`Valor de comments ${JSON.stringify(ToughtComments, null, 2)}}`)
        console.log(`Valor de UserTought ${JSON.stringify(UserTought, null, 2)}}`)
        console.log(`Valor empty : ${empty}`)

        res.render('toughts/comments', { ToughtComments, UserTought, empty,commentsqti,search })
    }

    static async EditComment(req, res) {
        const idcomment = req.params.idcomment

        try {
            const CommentDb = await Comment.findOne({
                include: {
                    model: Tought,
                    attributes: ["id", "title"]
                },
                where: { id: idcomment },
                raw: true,
                nest: true
            })

            if (!CommentDb) {
                req.flash('message', 'Nenhum comentário com esse id encontrado !!!')
                req.session.save(() => {
                    res.redirect('/toughts/dashboard')
                })
                return
            }

            const ToughtDb = await Tought.findOne({
                include: {
                    model: User,
                    attributes: ["id", "name"]
                },
                where: { id: CommentDb.ToughtId },
                raw: true,
                nest: true
            })

            function formatDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');

                return `${day}-${month}-${year}`;
            }

            const CommentUser = {
                id: CommentDb.id,
                comment: CommentDb.comment,
                createdAt: formatDate(new Date(CommentDb.createdAt)),
                updatedAt: formatDate(new Date(CommentDb.updatedAt)),
                dateupdate: false,
                UserId: CommentDb.UserId,
                ToughtId: CommentDb.ToughtId,
                User: CommentDb.User
            }

            if (CommentDb.createdAt.getTime() != CommentDb.updatedAt.getTime()) {
                CommentUser.dateupdate = true
            }

            // console.log(`CommentDb ${JSON.stringify(CommentDb, null, 2)}}`)
            // console.log(`CommentUser ${JSON.stringify(CommentUser, null, 2)}}`)
            // console.log(`ToughtDb ${JSON.stringify(ToughtDb, null, 2)}}`)

            res.render('comment/editcomment', { CommentUser, ToughtDb })

        } catch (erro) {
            console.log(erro)
        }
    }

    static async EditCommentPost(req, res) {

        const id = req.body.commentid
        const comment = req.body.comment
        const UserId = req.session.userid
        
        try{
            await Comment.update({comment} , 
                {where:{id : id , UserId : UserId} }
            )
            req.flash('message', 'Comentário editado com sucesso !!!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        }catch(erro){
            console.log(erro)
        }

    }

    static async DeleteComment(req,res){
        const idcomment =  req.body.id
        const IdUserReq = req.session.userid

        try{
            await Comment.destroy({where : {id:idcomment , UserId : IdUserReq}})
            req.flash('message', 'Comentário Deletado com sucesso !!!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        }catch(erro){
            console.log(erro)
        }

    }

    static async SearchCommentsToughtId(req,res){
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
    }
}

