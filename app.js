var express = require('express');
var multer  =   require('multer');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var bcrypt = require('bcrypt');
var request = require('request');
var mysql = require('mysql');

var routes = require('./routes/index');
var users = require('./routes/users');

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routes);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


app.use(function(req, res, next){
  res.io = io;
  next();
});


http.listen(process.env.PORT || 3000, function(){
//  console.log('listening on **:'+process.env.PORT);
// console.log('listening on **:'+port);
// console.log('listening on **$:'+port2);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"secretpass123456"}));
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
app.use(flash());
app.use(expressValidator());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/uploads', express.static(process.cwd() + '/uploads'));

app.use('/', routes);
app.use('/users', users);
//app.use('/customers', customers);
//app.use('/admin_users', admin_users);

//passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(methodOverride(function(req, res){
 if (req.body && typeof req.body == 'object' && '_method' in req.body) 
   { 
      var method = req.body._method;
      delete req.body._method;
      return method;
    } 
  }));

var con = mysql.createConnection({
    host: "sl-us-south-1-portal.9.dblayer.com",
    user: "admin",
    password: "MASVNZFGWSPQVWIJ",
    port:36143,
    database: "compose"
});


con.connect(function(error){
   if(!!error){
       console.log(error);
       
   }
   else{
       console.log('Connecteded');
   }
});


app.post("/login", passport.authenticate('local', {

    successRedirect: '/',

    failureRedirect: '/login',

    failureFlash: true

}), function(req, res, info){
    
    res.render('/',{'message' :req.flash('message')});

});

app.get('/', isAuthenticated,function(req,res){
    
    res.render('error');

});



//------------------------- REST API -------------------------------

app.post('/api/v1/registerUser',function(req,res){
    
     // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


     var user_list = req.body;
     var user_name = user_list.name;
     var user_email = user_list.email;
     var user_password = user_list.password;
     
     bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user_password, salt, function(err, hash) {
            // Store hash in your password DB.
            
             con.query("INSERT INTO exp_users(user_name,user_email,user_pass) values ('"+user_name+"','"+user_email+"','"+hash+"')",function(error,rows,fields){
            if(!!error){
                console.log('Error in the query1 '+error);
                res.send("error1="+error);
            }
            else{
            }
        });
                   
            var respose = 
                    {
                    status: "1",
                    message: "User has been registered"
                    };
            res.status(200).send(respose);
        });
        });

});

app.post('/api/v1/loginUser',function(req,res){
    
     // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


     var user_list = req.body;
     var user_email = user_list.email;
     var user_password = user_list.password;
     
      
     con.query("SELECT * FROM exp_users where user_email = '"+user_email+"'",function(error,rows,fields){
       if(!!error){
           console.log('Error in the query1 '+error);
           res.send("error1="+error);
       }
       else{
           var getPass = rows[0].user_pass;
           bcrypt.compare(user_password, getPass, function(err, result) {
                if(result) {
                 // Passwords match
                 var respose = 
                    {
                    status: "1",
                    message: "Access granted"
                    };
                    
                 res.status(200).send(respose);
                } else {
                 // Passwords don't match
                 var respose = 
                    {
                    status: "0",
                    message: "Username or password is incorrect"
                    };
                 res.status(200).send(respose);
                } 
              });
       }
   });

});

app.get('/api/v1/getUserList',function(req,res){
    
     // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

            
    con.query("SELECT user_name,user_email FROM exp_users",function(error,rows,fields){
        if(!!error){
            console.log('Error in the query1 '+error);
            res.send("error1="+error);
        }
        else{
            res.status(200).send(rows);
        }
   });
                   
        
            
       

});



//-------------------------REST API------------------------------------

 
 
passport.use('local', new LocalStrategy({

  usernameField: 'username',

  passwordField: 'password',

  passReqToCallback: true //passback entire req to call back
} , function (req, username, password, done){


      if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }

      var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';

      con.query("select * from c_users where username = ?", [username], function(err, rows){

          console.log("errrr1-"+err); //console.log(rows);

        if (err) return done(req.flash('message',err));

        if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }

//        salt = salt+''+password;
//
//        var encPassword = crypto.createHash('sha1').update(salt).digest('hex');

        var encPassword = password;
        var dbPassword  = rows[0].password;

        if(!(dbPassword === encPassword)){

            return done(null, false, req.flash('message','Invalid username or password.'));

         }

         
//         console.log("rowwww = "+JSON.stringify(rows[0]));
        return done(null, rows[0]);

      });

    }

));

passport.serializeUser(function(user, done){
//    console.log("rowwwwss = "+JSON.stringify(user));
    done(null, user);

});

passport.deserializeUser(function(user, done){
    done(null, user);
    
});


function isAuthenticated(req, res, next) {

  if (req.isAuthenticated())

    return next();

  res.redirect('/api-doc');

}

 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//http.listen(3000, function(){
//  console.log('listening on *:3000');
//});
//app.listen(1337);

//module.exports = app;
module.exports = {app: app, server: http};
