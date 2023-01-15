const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/algcom', {'useNewUrlParser': true})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    })

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());


app.use((req, res, next) => {
    res.locals.currentUser = req.session.user_id;
    // console.log(res.locals.currentUser)
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

const requireLogin = (req, res, next) => {
    if(!req.session.user_id) {
        return res.redirect('login');
    }
    next();
}

app.get('/', (req, res) => {
    res.render('pages/home');
})

app.get('/algorithm', (req, res) => {
    res.render('pages/algorithm');
})

app.get('/profile', requireLogin, (req, res) => {
    res.render('pages/profile');
})

app.get('/signup', (req, res) => {
    res.render('pages/signup');
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})

app.get('/logout', requireLogin, (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})

app.post('/signup', async (req, res) => {
    const { password, username } = req.body;
    const user = new User({ username, password });
    // TODO: vilidate
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if(foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/');
    } else {
        res.redirect('/login')
    }
})

app.get('*', (req, res) => {
    res.render('pages/error');
})

 
app.listen(3000, () => {
    console.log("Example app listening on port 3000");
})