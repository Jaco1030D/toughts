const User = require("../models/users")
const bcrypt = require("bcryptjs")

module.exports = class authController {
    static login(req, res){
        res.render('auth/login')
    }
    static async loginPost(req, res){
        const {email, password} = req.body

        const user = await User.findOne({where: {email: email}})

        if (!user) {
            req.flash('message', 'Usuario não encontrado')
            res.render('auth/login')

            return 
            
        }

        const passwordMatch = bcrypt.compareSync(password, user.senha)
        
        if (!passwordMatch) {
            req.flash('message', 'A senha se encontra errada, tente novamente')
            res.render('auth/login')

            return 
            
        }
        req.session.userid = user.id

            req.flash('message', 'Logado com sucesso')

            req.session.save(() =>{
                res.redirect('/')

            })
    }
    static register(req, res){
        res.render('auth/register')
    }
    static async registerPost(req, res){
        const {name, email, password, confirmpassword } = req.body

        //senhas iguais
        if ( password != confirmpassword ) {
            req.flash('message', 'As senhas são diferentes tente novamente')
            res.render('auth/register')

            return 
        }
        //se ususario ja existe
        const checkUserExist = await User.findOne({where: {email: email}})

        if ( checkUserExist ) {
            req.flash('message', 'O email ja existe')
            res.render('auth/register')

            return 
        }

        //criar usuario no banco
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            senha: hashedPassword
        }
        try {
            //criou o bagi no banco de dados
            const CreatedId = await User.create(user)

            req.session.userid = CreatedId.id

            req.flash('message', 'Usuario criado corretamente')

            req.session.save(() =>{
                res.redirect('/')

            })
        } catch (err) {
            console.log(err);
        }
    }
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/')
    }
}