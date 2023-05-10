const jwt = require('jsonwebtoken');
const  { SECRET } = process.env;
const User  = require('../models/user-model');


// create verify jwt middle ware to protect routes
module.exports.verify_jwt = (req, res, next) => {
    const jwt_cookie = req.cookies.jwt;

    // const token = jwt.decode(jwt_cookie);
    
    if (jwt_cookie) {
        jwt.verify(jwt_cookie, SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('login');
            } else {
                console.log(decodedToken);
                next();
            }
        });

    } else {
        res.redirect('login');
    }


    /** the above code can be done in this way also
     *  try {
            const token = jwt.verify(jwt_cookie, secret);
            console.log(token);

            next(); 
        } catch(err) {
            console.log(err);
            // res.render('login', {title: 'Login'});
            res.redirect('login');
        }
     * 
     */
   
}

// check the current user details
module.exports.checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {

        const decodedToken = jwt.verify(token, SECRET);

        if (decodedToken) {
            const user = await User.findById(decodedToken.user_id).select('email');
            console.log("email is"  + user.email);
            // inject the user email into views using locals
            res.locals.email = user.email;

        } else {

            res.locals.email = null;
        }
    } else {

        res.locals.email = null;
    }
    // calll the next middleware
    next();

/**
 * Another way to check user
 * 
 *  jwt.verify(token, secret, async (err, decodedToken) => {

            if(err)  {
                res.locals.email = null;
                console.log(err);
                next();
            }

            else {
                const user = await User.findById(decodedToken.user_id).select('email');
                console.log("email is"  + user.email);
                // inject the user email into views using locals
                res.locals.email = user.email;
                next();
            }
        });
 * 
 * 
 * 
 */
   
}