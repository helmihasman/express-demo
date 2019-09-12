var express = require('express');
var router = express.Router();
var connection = require('../app.js');
var request = require("request");
var bodyParser = require('body-parser');

//var mysql = require("mysql");
//var app_ex = require('express')();
//var http = require('http').Server(app_ex);
//var io = require('socket.io')(http);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//var con = mysql.createConnection({
//    host: "us-cdbr-iron-east-04.cleardb.net",
//    user: "b753688ff4397b",
//    password: "a2c32182",
//    database: "ad_4a07813f131a943"
//});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/dashboard_1', function(req, res, next) {
  res.render('dashboard_1', { title: 'Dashboard 1' });
});

router.get('/blankpage', function(req, res, next) {
  res.render('blankpage', { title: 'Express' });
});

//router.get('/dashboard', function(req, res, next) {
//  res.render('dashboard', { title: 'Dashboard' });
//});

//router.get('/environment', function(req, res, next) {
//  res.render('environment', { title: 'Environment' });
//});


//router.get('/assets_add', function(req, res, next) {
//  res.render('assets_add', { title: 'Add Assets' });
//});

router.get('/admin_users_add', function(req, res, next) {
  res.render('admin_users_add', { title: 'Add Admin Users' });
});

//router.get('/admin_department', function(req, res, next) {
//  res.render('admin_department', { title: 'Admin Department' });
//});

router.get('/admin_department_add', function(req, res, next) {
  res.render('admin_department_add', { title: 'Add Admin Department' });
});

router.get('/admin_zone_add', function(req, res, next) {
  res.render('admin_zone_add', { title: 'Add Admin Zone' });
});

router.get('/admin_linen_add', function(req, res, next) {
  res.render('admin_linen_add', { title: 'Add Admin Zone' });
});

//router.get('/admin_assets', function(req, res, next) {
//  res.render('admin_assets', { title: 'Admin Assets' });
//});

//router.get('/admin_assets_add', function(req, res, next) {
//  res.render('admin_assets_add', { title: 'Add Admin Assets' });
//});


//router.get('/admin_gateway_add', function(req, res, next) {
//  res.render('admin_gateway_add', { title: 'Add Admin Gateway' });
//});

router.get('/report', function(req, res, next) {
  res.render('report', { title: 'Report' });
});

router.get('/report_home_asset', function(req, res, next) {
  res.render('report_home_asset', { title: 'Report' });
});

router.get('/report_home_linen', function(req, res, next) {
  res.render('report_home_linen_nhealth', { title: 'Report' });
});

router.get('/admin_photo', function(req, res, next) {
  res.render('admin_photo', { title: 'Report' });
});

module.exports = router;
