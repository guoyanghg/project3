var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
let database = [];

MongoClient.connect(url, function(err, mongo) {
    if (err) throw err;
    database = mongo.db("BlogServer");
});

var checkHashPasswordByUsername = function (username) {
    return new Promise((resolve, reject)=>{
        const query ={
            "username": username
        };
        database.collection("Users").findOne(query,
            function(err, result){
                if(err){
                    reject(err);
                }else{
                    if(result == null) {
                        resolve({hash: null});
                    }else {
                        resolve({hash: result.password});
                    }
                }
        });
    })
};

var getPostByUsernameAndID = function (username, postid) {
    return new Promise((resolve, reject)=>{
        const query ={
            "postid": Number(postid),
            "username": username
        };
        database.collection("Posts").find(query)
            .toArray(function(err, post) {
                if(err){
                    reject(err);
                }else{
                    resolve({posts: post, totalNum: 1});
                }
            });
    })
};


var getPostByUsername = function (username, startid) {
    //Using pagination (5 posts for each)
    let size = 5;
    return new Promise((resolve, reject)=>{
        const query ={
            "username": username,
            "postid": {
                $gte: Number(startid)
            }
        };
        console.log(query);
        database.collection("Posts").find(query)
            .limit(size).toArray(function (err, posts) {
            database.collection("Posts").countDocuments(query, function (err, count) {
                if (err) {
                    reject(err);
                } else {
                    resolve({posts: posts, totalNum: count});
                }
            });
        });
    })
};

module.exports = {
    getPostByUsernameAndID: getPostByUsernameAndID,
    getPostByUsername: getPostByUsername,
    checkHashPasswordByUsername: checkHashPasswordByUsername
};