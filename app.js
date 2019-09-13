var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var mysql = require('mysql');

var routes = require('./routes/index');
var users = require('./routes/users');

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

var app = express();
var http = require('http').Server(app);

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routes);

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);
app.use('/users', users);


var con = mysql.createConnection({
    host: "sl-us-south-1-portal.9.dblayer.com",
    user: "admin",
    password: "MASVNZFGWSPQVWIJ",
    port:36143,
    database: "compose"
});

app.get('/',function(req,res){
    
     res.redirect('/api-doc');

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
