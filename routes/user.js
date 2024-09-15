const express  = require('express')
const router = express.Router()
const {User} = require('../models')
const bcrypt = require('bcrypt')
const {sign} = require('jsonwebtoken')
const Authmiddleware = require('../Middleware/Auth')
const dotenv = require('dotenv')
dotenv.config()



router.get('/', async (req,res) =>{
    const getallusers = await User.findAll()
    res.status(200).json(getallusers)
})
router.post('/register', async (req,res) =>{
    const {password,email, ...users} = req.body

    const hashpassword = await bcrypt.hash(password, 10)

    const existingemail = await User.findOne({where: {email}})

    if(existingemail){
        return res.status(409).json({error: 'Email já cadastrado!'})
    }

    const createnewuser = await User.create({
        ...users,
        email,
        password: hashpassword
    })

    res.status(201).json(createnewuser)
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Busca o usuário pelo e-mail
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Credenciais incorretas!" });
    }

    // Gera o token de acesso
    const accesstoken = sign({ email: user.email, id: user.id }, process.env.TOKEN_VERIFY_ACCESS);

    // Retorna o token e o nome do usuário
    res.json({ token: accesstoken, name: user.name });
});
router.get('/dashboard', Authmiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" })
    }
});



module.exports = router