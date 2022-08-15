require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer')



//init App & Middleware
const app = express();
const upload = multer();
app.use(bodyParser.urlencoded({ extended: false }))

//Config JSON Response
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(upload.array());

//Models
const User = require('./models/User');
// const Role = require('./models/Role')


//db COnnection
//const db = require('./db')

//Credentials
// const dbUser = process.env.DB_USER
// const dbPass = process.env.DB_PASS


// //db Connection
mongoose.connect('mongodb://127.0.0.1:27017/Cakelandy')
// mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.7koseo4.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3000)
    console.log('Connected to DB')
})
.catch((err) => console.log(err))

//Open Route - Public Route
app.get('/', (req, res) => {
    res.render('index')
});

// login routers
app.get('/login', (req, res) => {
    res.render('login')
});

//Signup
app.get('/signup', (req, res) => {
    res.render('signup')
})


//Private Route
// app.get('/user/:id', checkToken, async (req, res) => {

//     const id = req.params.id 

//     //Check if User exists
//     const user = await User.findById(id, '-password')

//     if (!user) {
//         res.status(404).json({msg: "Usuário não encontrado!"})
//     }

//     res.status(200).json({user})
// })

function checkToken(req, res, next) {
    
    const authHeader = res.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({msg: 'Acesso Negado!'})
    }
    try {
        const secret = process.env.secret
        jwt.verify(token, secret)
        next()
    }
    catch(error){
        res.status(400).json({msg: 'Token invalid'})
    }
}

//Register User
app.post('/signup', async (req, res) => {
    console.log(req.body);
    const {name, surname, username, password, confirmpassword, email, telephone, type} = req.body

     // Create Password
    console.log(password);
    const passwordHash = bcrypt.hashSync(password, 10)

    if (password != confirmpassword) {
        return res.status (402).json({msg: 'Password does not match'})
    }

    //Create User
    const user = new User({
        name,
        surname, 
        username,
        password: passwordHash,
        email,
        telephone,
        type,
    })
    try{
        await user.save()
        res.render('login')
        
    }
    catch(error) {
        console.log(error)

        res
        .status(500)
        .json({
            msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'})
    }
})

//Login User
app.post ('/login', async (req, res) => {
    console.log(req.body)
    const {username, password} = req.body

    if(!username){
        return res.status(402).json({msg: 'O Utilizador é obrigatório!'})
    }
    if(!password){
        return res.status(402).json({msg: 'A palavra-passe é orbigatória!'})
    }

    //Check if user exists
    const user = await User.findOne({username: username})

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }

    //Check if password match
    const checkPassword = await bcrypt.compare(password, user.password)
    
    if(!checkPassword) {
        return res.status(402).json({msg: 'Senha inválida'})
    }

    try {
        const secret = process.env.secret

        const token = jwt.sign(
            {
                id: user.__id,
            },
            secret,
        )
        // res.status(200).json({msg: 'Autenticação realizada com sucesso'})
        return res.render('index')
    }
    catch (error) {
        console.log(error)
    }
})
