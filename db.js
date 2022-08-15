require('dotenv').config;
const mongoose = require('mongoose');
const express = require('express');

const app = express();

//Credentials
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS


//db Connection
//mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.7koseo4.mongodb.net/?retryWrites=true&w=majority`)
mongoose.connect('mongodb://127.0.0.1:27017/Cakelandy')
.then(() => {
    app.listen(3000)
    console.log('Connected to DB')
})
.catch((err) => console.log(err))

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