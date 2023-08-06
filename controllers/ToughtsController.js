const Tought = require("../models/tought");
const User = require("../models/users");
const {Op} = require('sequelize')

module.exports = class ToughtsController{
    static async showtoughts(req, res){

        let search = ''

        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if (req.query.order === 'old') {
            order = 'ASC'
        } else{
            order = 'DESC'
        }

        const toughtData = await Tought.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` },
              },
            order: [['createdAt', order]]
        })

        const toughts = toughtData.map((result) => result.get({plain: true}))

        let toughtsqty = toughts.length
        if (toughtsqty === 0) {
            toughtsqty = false
        }

        res.render('toughts/home', {toughts, search, toughtsqty})
    }
    
    static async dashboard(req, res){
        const UserId = req.session.userid
        const user = await User.findOne({
            where: {
                id: UserId
            },
            include: Tought,
            plain: true,
        })

        if (!user) {
            res.redirect('/toughts')
        }

        const toughts = user.Toughts.map((result) => result.dataValues)

        let emptytought = false
        if (toughts.length === 0) {
            emptytought = true
        }
        res.render('toughts/dashboard', {toughts, emptytought})
    }
    static createTought(req, res){
        res.render('toughts/create')
    }
    static async createToughtSave(req, res){ //reposta do banco
        const tought = {
            title: req.body.title,
            UserId: req.session.userid

        }
        try {
            await Tought.create(tought)

            req.flash('message', 'pensamento criado com sucesso')
            req.session.save(() =>{
                res.redirect('/tought/dashboard')
            })
        } catch (err) {
            console.log(err)
        }
    }
    static async RemoveTought(req, res){
        const id = req.body.id
        const UserId = req.session.userid

        try {
            await Tought.destroy({
                where: {
                    id: id,
                    UserId: UserId
                }
            })
            req.flash('message', 'pensamento removido com sucesso')
            req.session.save(() =>{
                res.redirect('/tought/dashboard')
            })
        } catch (err) {
            console.log(err)
        }
    }
    static async updatetought(req, res){
        const id = req.params.id

        const tought = await Tought.findOne({where: {id: id}, raw:true})

        res.render('toughts/edit', {tought})
    }
    static async updatetoughtSave(req, res){
        const id = req.body.id

        const tought = {
            title: req.body.title
        }

        try {
            await Tought.update(tought, {where: {id: id}})
            req.flash('message', 'pensamento atualizado com sucesso')
            req.session.save(() =>{
                res.redirect('/tought/dashboard')
            })
        } catch (error) {
            
        }
    }
}