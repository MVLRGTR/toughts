//Midlleware de autenticação
module.exports.CheckAuth = function(req,res,next){
    const UserId = req.session.userid
    if(!UserId){
        req.flash('message', 'Você precisa estar logado para realizar essa operação !!!')
        res.redirect('/login')
    }
    next()
}