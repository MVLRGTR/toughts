const Tought = require('../models/Tought')
const User = require('../models/User')
const Comment =  require('../models/Comment')

module.exports =  class CommentsController{

    static async AddComment(req,res){
        const idtought = req.params.idtought
        const idUser = req.session.userid

        const UserToughtdb = await Tought.findOne({
            include:{
                model:User,
                attributes:["id","name"]
            },
            where:{id : idtought},
            attributes:["id","title","createdAt","updatedAt"],
            raw:true,
            nest:true
        })

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const day = String(date.getDate()).padStart(2, '0'); 
          
            return `${day}-${month}-${year}`;
        }

        const UserTought = {
            id:UserToughtdb.id,
            title: UserToughtdb.title,
            createdAt: formatDate(new Date(UserToughtdb.createdAt)),
            updatedAt: formatDate(new Date(UserToughtdb.updatedAt)),
            dateupdate: UserToughtdb.createdAt.getTime() !== UserToughtdb.updatedAt.getTime(),
            User: UserToughtdb.User
        };


        console.log(`Valor de UserTought ${JSON.stringify(UserTought, null, 2)}}`)

        res.render('comment/commentadd',{UserTought,idUser})

    }

    static async AddCommentPost(req,res){
        const commentAdd = {
            comment : req.body.comment,
            UserId : req.body.userid,
            ToughtId : req.body.toughtid
        }

        try{
            await Comment.create(commentAdd)
            req.flash('message', 'Comentário adicionado com sucesso !!!')
            req.session.save(()=>{
                res.redirect(`/comments/${commentAdd.ToughtId}`)
            })
        }catch(erro){
            res.status(500).send("Erro ao processar operação")
        }

    }
    
    static async ShowCommentsToughtId (req,res){
        const idtought = req.params.idtought

        const ToughtCommentsdb = await Comment.findAll({
            include:{
                model:User,
                attributes:["name"]
            },
            where:{ToughtId : idtought},
            raw:true,
            nest:true
        })

        const UserToughtdb = await Tought.findOne({
            include:{
                model:User,
                attributes:["id","name"]
            },
            where:{id : idtought},
            attributes:["id","title","createdAt","updatedAt"],
            raw:true,
            nest:true
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

        const ToughtComments = ToughtCommentsdb.map((elemento)=>{
            if(elemento.createdAt.getTime()===elemento.updatedAt.getTime()){
                return {
                    id: elemento.id,
                    comment: elemento.comment,
                    createdAt: formatDate(new Date(elemento.createdAt)),
                    updatedAt: formatDate(new Date(elemento.updatedAt)),
                    dateupdate:false,
                    UserId: elemento.UserId,
                    User: elemento.User
                }
            }else{
                return {
                    id: elemento.id,
                    comment: elemento.comment,
                    createdAt: formatDate(new Date(elemento.createdAt)),
                    updatedAt: formatDate(new Date(elemento.updatedAt)),
                    dateupdate:false,
                    UserId: elemento.UserId,
                    User: elemento.User
                }
            }
        })

        let empty = true

        if(ToughtComments.length > 0){
            empty = false
        }

        console.log(`Valor de comments ${JSON.stringify(ToughtComments, null, 2)}}`)
        console.log(`Valor de UserTought ${JSON.stringify(UserTought, null, 2)}}`)
        console.log(`Valor empty : ${empty}`)

        res.render('toughts/comments',{ToughtComments,UserTought,empty})
    }
}

