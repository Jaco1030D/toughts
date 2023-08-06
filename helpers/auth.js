module.exports.checkauth = function(req, res, next) {
    const Userid = req.session.userid

    if (!Userid) {
        res.redirect('/login')
    }

    next()
}