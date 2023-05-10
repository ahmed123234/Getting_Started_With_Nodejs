require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const pat = require('path');
const authRoutes = require('./routes/authRoute');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const {verify_jwt, checkUser} = require('./middleware/authMiddlewares');


//express app
// create an instance of express app
const app = express();

app.use(express.json());
app.use(express.urlencoded());

// create a middleware for incoming cookie data using cookie parser 3rd party package
app.use(cookieParser()) // now we can access cookie method on the response object

// register view engine
app.set('view engine', 'ejs');

// serving static content to become public on the browser
app.use(express.static('static'));

app.use(morgan('dev'));

// insetd you can do the above snippet using the folleing snippet
app.get('*', checkUser);


// // create a get route for '/' endpoint
app.get('/', (req, res) => {
    res.render('home', {title: 'Home'});
});


app.get('/smoothies', verify_jwt, (req, res) => {

    res.render('smoothies', {title: 'smoothies'});
});


app.use(authRoutes);

// 404 page with express
app.use('', (req, res) => {
    res.status(404).render('404', {title: 'Not Found'});
});


module.exports = app;













// app.get('/set-cookies', (req, res) => {
//     // res.setHeader('Set-Cookie', 'newuser=true');
//     // using cookie method insted of set the set-cookie header
//     res.cookie('newuser', true, {
//         maxAge: 1000 * 60 * 60 * 24, // one day (set the session expieration date )
//         httpOnly: true // this cookie will be used with the http protocol only and can't displayed on the frontend (ex: console.log() on browser)
//     })
//     res.send('you got the cookies');
// });



// app.get('/read-cookies', (req, res) => {
//     const cookies = req.cookies;
//     console.log(cookies);
//     res.json(cookies.newuser);
// });