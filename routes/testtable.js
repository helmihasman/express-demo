exports.list = function(req, res){

  req.getConnection(function(err,connection){   
      var query = connection.query('SELECT * FROM users',function(err,rows){
        if(err)
          console.log("Error Selecting : %s ",err );

        res.render('admin_users',{page_title:"Admin Users",data:rows});
      });
  });
};