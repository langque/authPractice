require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const encKey = process.env.secret;
userSchema.plugin(encrypt, {
    secret: encKey,
    encryptedFields: ['password']
});

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    res.render('home');
})

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        email: username,
        password: password
    })
    newUser.save((err) => {
        if (!err) {
            res.render('secrets');
        } else {
            res.send('Register is unsuccessful');
        }
    })

});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, userProfile) => {
        if (!err) {
            if (userProfile.password === password) {
                res.render('secrets');
            } else {
                res.send('Password not match');
            }
        } else {
            res.send('Email not exist');
        }
    })
});





app.listen(port, () => {
    console.log('Server started at port ' + port);
});
