var express = require('express');
var router = express.Router();
 
/* GET Customer page. */
 
router.get('/', function(req, res, next) {
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM users',function(err,rows)
        {
            if(err)
                var errornya  = ("Error Selecting : %s ",err );
            req.flash('msg_error', errornya);   
            res.render('admin_users',{title:"Admin Users",data:rows});
        });
     });
});
module.exports = router;