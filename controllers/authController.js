const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const { SECRET } = process.env;


// evaluate the error object and return a new useful object to the user
const handleErrors = (err) => {
    // error code is not found for most osf errors bit it is with some of them like unique error
    console.log(err.message, err.code);

    // create error object
    const errorMessage = {email: '', password: ''};

    // duplicate error collection

    if (err.code === 11000) {
        errorMessage.email = 'Email is already registerd';
        return errorMessage;
    }


    // validation errors
    if(err.message.includes('User validation failed')) {

        // get all the different values inside the errors object
        // iterate over each value in the array
        Object.values(err.errors).forEach(({ properties }/**distructure the properties from error object */) => {
            console.log(properties);

            errorMessage[properties.path] = properties.message;
            
        });
    }

    if(err.message === 'incorrect password') {
        errorMessage['password'] = 'That password is incorrect'
    }

    if(err.message === 'incorrect email') {
        errorMessage['email'] = 'That email is not registerd';
    }

    return errorMessage;
}


module.exports.generate_jwt = (user) => {

    const token = jwt.sign({user_id: user._id, email: user.email}, SECRET, {expiresIn: "2h"});

    user.token = token;
}


const generate_jwt_II = (id) => {

    const token = jwt.sign({user_id: id}, SECRET, {expiresIn: "2h"});

    return token;
}


module.exports.signup_get = (req, res) => {
    res.render('signup', {title: 'Sign up'});
}


module.exports.signup_post = async (req, res) => {
    const {email, password} = req.body;

    console.log(req.body);

    try{
       const user = new User({ email,password });
       const user_ = await user.save();

       const token  = generate_jwt_II(user_._id);

       res.cookie('jwt', token, {maxAge: 1000 * 60 * 60 * 2, httpOnly: true});

        res.status(201).send({user: user_._id});

    }catch(err) {
        const error = handleErrors(err);
        res.status(400).json({error});
    }
}


module.exports.login_get = (req, res) => {
    res.render('login', {title: 'Log in'});
}


module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        console.log(user);

        const token = generate_jwt_II(user._id);
        res.cookie('jwt', token, {maxAge: 1000 * 60 * 60 * 2, httpOnly: true});
        
        res.status(200).json({user: user._id});
        
     

    } catch(err) {
        const error = handleErrors(err);
        res.status(400).json({error});
    }
}


module.exports.logout = (req, res) => {
    res.cookie('jwt', '', {httpOnly: true, maxAge: 1}); //maxAge in ms
    
    // res.render('login', {title: 'Login'});
    res.redirect('/');
}



// TODO
// how to hash password using mongoose hooks;
// because the database is compremised you have not to store a plain password in it, insted hash it.

// So, when the db will be compremised, the uses password still be protected and hashed

// populer hashing packeage called  bycrybt or another called mongoose-hook


// protect resource(routes) based on the authuntication status of users;



   // const user = await User.findOne({email});

        // if (user) {
        //     const result = await bycrybt.compare(password, user.password);
        
        //     if (result == true) {
        //         const token = generate_jwt_II(user._id);
        //         res.cookie('jwt', token, {maxAge: 1000 * 60 * 60 * 2, httpOnly: true});
        //         res.status(200).json({user: user._id});

        //     }  else {
        //         res.status(400).json({error: {password: 'incorrect password'}});
        //     }

        // }  else { 
        //     res.status(400).json({error: {email: `There is no such user with email ${email}`}});
        // }
