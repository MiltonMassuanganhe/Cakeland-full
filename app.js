const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;

// application setup code goes here
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(morgan('tiny'));

// home page
app.get('/', (req, res) => {
    res.render('index')
});

// login routers
app.get('/login', (req, res) => {
    res.render('login')
});


app.post('/login', (req, res) => {
    console.log(req.body)
    res.json({ username: "imariom" })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});