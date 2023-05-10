const express = require('express');
const Blog = require('../models/blog');

// create router instance of Router object
const router = express.Router();

// Blog routes

router.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt : -1}) // sort desc
    .then((result) => {

        res.render('index', {title: 'Home', blogs: result});
    })
    .catch((err) => console.log(err));
});

router.use(express.urlencoded());

//create blog
router.post('/', (req, res) => {
    Blog.create(
        req.body
    ).then((result) => {
        console.log(result);
        res.redirect('/');
    })
    .catch((err) => console.log(err));
});

// rendering create page
router.get('/create', (req, res) => {
    
    res.render('create', {title: 'Create'});
})



// show blog:
router.get('/:id', (req, res) => {
    
    Blog.findById(req.params.id).then((result) => {
        console.log(result);
        res.render('details', {blog: result, title: 'Blog Details'});
    })
    .catch((err) => console.log(err));
});

// delete blog:
router.delete('/:id', (req, res) => {
    
    Blog.deleteOne({_id: req.params.id}).then((result) => {
        console.log(result);
        res.json({redirect: '/'});
    })
    .catch((err) => console.log(err));
});


module.exports = router;





















// app.get('/blogs', (req, res) => {
//     Blog.find().sort({createdAt : -1}) // sort desc
//     .then((result) => {

//         res.render('index', {title: 'Home', blogs: result});
//     })
//     .catch((err) => console.log(err));
// });

// // app.use(bodyParser.urlencoded());
// app.use(express.urlencoded());
// //create blog
// app.post('/blogs', (req, res) => {
//     Blog.create(
//         // {
//         // title: req.body.title,
//         // snippet: req.body.snippet,
//         // body: req.body.body
//         // }
//         req.body
//     ).then((result) => {
//         console.log(result);
//         // res.send({message: "created"});
//         res.redirect('/blogs');
//     })
//     .catch((err) => console.log(err));
// });

// // show blog:
// app.get('/blogs/:id', (req, res) => {
    
//     Blog.findById(req.params.id).then((result) => {
//         console.log(result);
//         // res.send(result);
//         res.render('details', {blog: result, title: 'Blog Details'});
//     })
//     .catch((err) => console.log(err));
// });

// // delete blog:
// app.delete('/blogs/:id', (req, res) => {
    
//     Blog.deleteOne({_id: req.params.id}).then((result) => {
//         console.log(result);
//         res.json({redirect: '/blogs'});
//     })
//     .catch((err) => console.log(err));
// });