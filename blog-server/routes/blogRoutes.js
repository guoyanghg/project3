var express = require('express');
var router = express.Router();
var dataService = require('../services/dataService');

/* GET users listing. */
router.get('/:username/:postid', function(req, res, next) {

    const username = req.params.username;
    const postid = req.params.postid;

    dataService.getPostByUsernameAndID(username, postid)
        .then(result =>{
            console.log(result);
            res.render('blog', {
                posts: result.posts,
                totalNum: result.totalNum,
                title: "Posts"
            });
        });
});

router.get('/:username', function(req, res, next) {

    const username = req.params.username;
    let startid = req.query.start;
    if(startid === undefined){
        startid = '1';
    }

    dataService.getPostByUsername(username, startid)
        .then(result =>{
            console.log(result);
            var nextid = result.posts[result.posts.length-1].postid + 1;

            res.render('blog', {
                posts: result.posts,
                totalNum: result.totalNum,
                title: "Posts",
                nextid: nextid,
                username: username
            });
        });
});



module.exports = router;