var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dataService = require('../services/dataService');
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
    let redirect_url = req.query.redirect;
    res.render('login', {username:"", password:"", redirect: redirect_url});
});

router.post('/', function(req, res, next) {
    let redirect_url = req.body.redirect;
    let username = req.body.username;
    let password = req.body.password;

    console.log(username);
    console.log(password);



    dataService.checkHashPasswordByUsername(username)
        .then(result =>{
            console.log(result);

            if(result.hash == null){
                //username is invalid
                res.status(401);
                res.render('login', {username: username,
                    password: password,
                    redirect: redirect_url
                });
            }else{
                let compare = bcrypt.compareSync(password, result.hash);
                console.log(compare);
                if(!compare){
                    //password invalid
                    res.status(401);
                    res.render('login', {username: username,
                        password: password,
                        redirect: redirect_url
                    });
                }else{
                    // create a token
                    var token = jwt.sign({  usr: username }, "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c", {
                        expiresIn: '2h', // expires in 2 hours
                        header:{"alg": "HS256", "typ": "JWT"}
                    });
                    
                    res.json({ auth: true, token: token });
                }
            }
        });
});

module.exports = router;
