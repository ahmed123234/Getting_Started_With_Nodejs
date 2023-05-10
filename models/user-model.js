const mongoose = require('mongoose');
const { isEmail , isStrongPassword } = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema =mongoose.Schema;

// add custom error messages

const userSchema = new Schema({
    email: {
        type: String,
        // custom error if email is not found(deticted)
        required: [true, 'Please enter an email address'],
        unique: [true, 'Email adress ai already used'],
        lowercase: true,
        // validate the email address
        // here I will use a 3rdparty validate message called validator
        validate : [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a valid password'],
        minlength: [6, 'Minimum password length is 6 charcters'] ,
        validate: [isStrongPassword, 'Password is not strong']   
    },
    token: String
});


// fire a function after doc saved in db using hook
// after svaed event occures then I want to fire a function
userSchema.post('save', function(doc, next) {
    console.log('new user was created & saved', doc);
    next();
});

// fire a function before doc saved in db using hook
// Note: you need to call next method for any type of  middleware and mongoose hooks
userSchema.pre('save', async function(next) {
    // this refers for the local user's instance that has been created and will be saved in the db (created but not saved yet) 
    console.log('new user about to be craeted & saved', this);

    // inorder to hash password, I will use 3rd party package called bcrypt
    // const saltRounds = 10;

    // this.password = await bcrypt.hash(this.password, saltRounds);

    // another way:
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


// create static method to login the user

userSchema.statics.login = async function(email, password) {
    // this here refer to the user model
    const user = await this.findOne({ email });

    if (user) {
        // bcrybt compare method will take into it's account to hash the textplain password and then compare it with the user hashed password
        const auth = await bcrypt.compare(password, user.password);
    
        if (auth) {
            return user;
        } 
        throw Error ('incorrect password');

    } 
    throw Error ('incorrect email'); // this email will be handled bey the auth controller
}


const User = mongoose.model('User', userSchema);

module.exports = User;