var mongoose   = require('mongoose');
var User       = require('../app/models/user');
var Post       = require('../app/models/post');
module.exports = function(app, passport) {  
    app.get('/', function(req, res) {
        res.render('index.handlebars');
    });
     
    app.get('/login', function(req, res) {
        res.render('login.handlebars', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/user-page', 
        failureRedirect : '/login', 
        failureFlash    : true 
    }));
        
    app.get('/user-page',isLoggedIn, function (req, res) {
        console.log("This is the query param", req.query.page);
        var pageNumber          = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageSize          = 5;
        req.session.ps          = null;
        req.session.name        = {};
        User.findOne({"_id":req.session.passport.user}, function (err,user) {
            name = user.local.name;
            req.session.name    = {"name":user.local.name}
            req.session.avatar  = user.avatar
            req.session.ps      = user.mail.length;
        })     
        var myQuery             = Post
                                      .find({})
                                      .sort({'_id':-1})
                                      .limit(pageSize)
                                      .skip(pageSize * (pageNumber - 1));
        myQuery.exec(function (err, posts) {
            Post.count({}, function(err, count) {
                var realcount   = [];
                var num         = Math.ceil(count/pageSize); 
                for (var i = 0; i < num; i++) {
                    realcount.push(i+1);
                }
                if (!err) {
                    res.render('user-page', {
                        numpost  : req.session.ps,
                        posts    : posts,
                        name     : req.session.name.name,
                        userID   : req.session.passport.user,
                        avatar   : req.session.avatar,
                        count    : realcount 
                   });
               }
            });   
        }); 
    });

    app.get('/blogSearch',isLoggedIn, function(req,res){
        console.log("This is the query param", req.query.page);//pagination querystring test
        var pageNumber = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageSize = 5;
        User.findOne({"_id":req.session.passport.user}, function (err,user) {
            req.session.ps      = user.mail.length;
        }) 
        var myQuery    = Post
                             .find({"name":req.session.holder})
                             .sort({'_id':-1})
                             .limit(pageSize)
                             .skip(pageSize * (pageNumber - 1));
       myQuery.exec(function (err, posts) {
           Post.count({"name":req.session.holder}, function(err, count) {
               var realcount  = [];
               var num        = Math.ceil(count/pageSize);
                   for (var i = 0; i < num; i++) {
                      realcount.push(i+1);
                   }
                       console.log("the count is"+count)
                   if (!err) {
                       res.render('user-page', {
                           numpost    : req.session.ps,
                           posts      : posts,
                           name       : req.session.name.name,
                           userID     : req.session.passport.user,
                           avatar     : req.session.avatar,
                           count      : realcount 
                       });
                   }
           });   
        });
    });

    app.post('/data/user-post',isLoggedIn,function (req,res){
        var date    = new Date();
        var year    = date.getFullYear()
        var month   = date.getMonth() + 1
        var day     = date.getDate()
        var hours   = date.getHours()
        var min     = date.getMinutes()
        var sec     = date.getSeconds()
        Post.create({
            createdOn   : month+"/"+day+"/"+year+" - "+" "+hours+":"+min+":"+sec,
            avatar      :req.session.avatar,
            post        : req.body.post,
            name        : req.session.name.name
        }, function(err, post){
              console.log('it worked')
                  console.log("This is the query param", req.query.page);
                  var pageNumber          = req.query.page ? parseInt(req.query.page, 10) : 1;
                  const pageSize          = 5;
                  req.session.ps          = null;
                  req.session.name        = {};
                  User.findOne({"_id":req.session.passport.user}, function (err,user) {
                      name = user.local.name;
                      req.session.name    = {"name":user.local.name}
                      req.session.avatar  = user.avatar
                      req.session.ps      = user.mail.length;
                 })     
            var myQuery             = Post
                                          .find({})
                                          .sort({'_id':-1})
                                          .limit(pageSize)
                                          .skip(pageSize * (pageNumber - 1));
            myQuery.exec(function (err, posts) {
                Post.count({}, function(err, count) {
                    console.log(req.body)
                    var realcount   = [];
                    var num         = Math.ceil(count/pageSize); 
                    for (var i = 0; i < num; i++) {
                        realcount.push(i+1);
                    }
                    if (!err) {
                        console.log(req.query, 'the request query was')
                        res.json({
                         posts:posts
                        });
                    }
                });   
            });
        });
    });

    app.post('/blogSearch',isLoggedIn,function (req, res) {
        console.log("This is the query param ", req.query.page);
        console.log("This is the params req.param ", req.params);
        var pageNumber      = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageSize      = 5;
        req.session.holder  = req.body.search;
        User.findOne({"_id":req.session.passport.user}, function (err,user) {
            req.session.ps      = user.mail.length;
        }) 
        var myQuery         = Post
                                  .find({"name":req.body.search})
                                  .sort({'_id':-1})
                                  .limit(pageSize)
                                  .skip(pageSize * (pageNumber - 1));
        myQuery.exec(function (err, posts) {
            Post.count({"name":req.body.search}, function(err, count) {               
                var realcount  = [];
                var num        = Math.ceil(count/pageSize); 
                    for (var i = 0; i < num; i++) {
                        realcount.push(i+1);
                    }
                    if (!err) {
                        res.render('user-page', {
                            numpost   : req.session.ps,
                            posts     : posts,
                            name      :req.session.name.name,
                            userID    :req.session.passport.user,
                            avatar    :req.session.avatar,
                            count     :realcount
                        });
                    }
            });   
        });
    });
        
    app.post('/avatar',isLoggedIn,function (req, res) {
        var insert                 = "";
        req.session.avatar         = "";
        User.findOne({"_id":req.session.passport.user}, function (err,user) {
            req.session.ps         = user.mail.length;
        }) 
        User.findOne({"_id":req.body.id},function(err,user){
            user.avatar            = req.body.hiddenavatar;
            user.save(function(err,user){
                req.session.avatar = user.avatar
                res.redirect("/user-page") 

            })  
        })  
    })

    app.get('/mail',isLoggedIn,function (req, res) {
        var insert                = "";
        User.findOne({"_id":req.session.passport.user}, function (err,user) {
            req.session.ps        = user.mail.length;
        }) 
        User.find({},function(err,post){
            insert                = post;
            res.render('mail', {
                numpost     : req.session.ps,
                mail        : insert,
                name        : req.session.name.name,
                userID      : req.session.passport.user
            })
        })   
    })

    app.post('/sentmail',isLoggedIn,function (req, res) {
        var date      = new Date();
        var year      = date.getFullYear()
        var month     = date.getMonth() + 1
        var day       = date.getDate()
        var hours     = date.getHours()
        var min       = date.getMinutes()
        var sec       = date.getSeconds()
        User.findOne({"_id":req.session.passport.user}, function (err,user) {
            req.session.ps      = user.mail.length;
        }) 
        User.findOne({_id : req.body.id},function(err, user) {
            if(!err){
                user.mail.push("Message From "
                                              +req.session.name.name
                                              +" sent "+ month+"/"+day+"/"+year+" - "
                                              +" "+hours+":"+min+":"+sec+" -" 
                                              +req.body.message);
                user.save(function(err,user){
                    res.render('thankyou', {
                        numpost     : req.session.ps,
                        name        :req.session.name.name,
                        userID      :req.session.passport.user
                    });           
                })
            };
        });
    })

    app.post('/checkmail',isLoggedIn,function (req, res) {
        User.findOne({"_id":req.session.passport.user}, function (err,user) {
            req.session.ps      = user.mail.length;
        }) 
        User.findOne({'_id' : req.body.id},function(err, user) {  
            if(!err){
                res.render('mailbox', {
                    numpost     : req.session.ps,
                    messages    : user,
                    name        : req.session.name.name,
                    userID      : req.session.passport.user
                });
            };
        });
    })

    app.post('/postmenu',isLoggedIn,function (req, res) {
        User.findOne({"_id":req.session.passport.user}, function (err,user) {
            req.session.ps      = user.mail.length;
        }) 
        User.findOne({"_id" : req.body.id},function(err, user) {
            if(!err){
                user.mail.push(req.body.message);
                user.save(function(err,user){
                    insert = user;
                    res.render('postoffice', {
                        numpost     : req.session.ps,
                        mail        : insert,
                        name        : req.session.name.name,
                        userID      : req.session.passport.user
                    });   
                })
            };
        });   
    })

    app.post('/clearmail',isLoggedIn,function (req, res) {
        User.findByIdAndUpdate({'_id' : req.body.delete },{"$unset" : {"mail" : 1}},
            function (err,user){
                if (!err){
                    req.session.ps  = 0;
                    res.render('mailbox', {
                        numpost     : req.session.ps,
                        message     : "Deleted",
                        name        : req.session.name.name,
                        userID      : req.session.passport.user
                    });
                }
            }   
        )   
    })

    app.post('/delete',isLoggedIn,function (req, res) {
        Post.findOneAndRemove({'_id' : req.body.deleted},function(err){
            res.redirect("/user-page")    
        });
    })

    app.post('/update',isLoggedIn,function (req, res) {
        Post.findOne({'_id' : req.body.id},function(err, post2) {
            if(!err){
                post2.comments.push(req.session.name.name+" comments: "+req.body.update);
                post2.save(function(err,post3){
                    res.redirect("/user-page")    
                })
            };
        });
    })

    app.post('/postupdate',isLoggedIn,function (req, res) {
        Post.findOne({'_id' : req.body.id},function(err, user) {
            if(!err){
                user.post = req.body.input;
                user.save(function(err,user){
                    res.redirect("/user-page")
                })    
            };
        });
    });
        
    app.get('/signup', function(req, res) {
        res.render('signup.handlebars', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/user-page', 
        failureRedirect : '/signup', 
        failureFlash    : true 
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        User.findOne({"_id":req.session.passport.user}, function (err,user) {
            req.session.ps      = user.mail.length;
        }) 
        var myQuery = Post.find({'name':req.session.name.name});
        myQuery.sort({'_id':-1});
        myQuery.exec(function (err, post) {
            if (!err) {
                res.render('profile', {
                    numpost   :  req.session.ps,
                    post      :  post,
                    userID    :  req.session.passport.user,
                    user      :  req.user
                });
            }   
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

function isLoggedIn(req, res, next) {
if (req.isAuthenticated())
    return next();
    res.redirect('/');
}

























