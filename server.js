var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser')
var http = require('http').Server(app);
var io = require('socket.io')(http);
const https = require('https');
const request = require('request');

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

app.use(express.static(__dirname + '/dist/angular-ngx'));
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))







var port = process.env.PORT || 8100;
app.listen(port);

console.log('server is running on port ',port);

app.get('*', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.sendFile(path.join(__dirname + '/dist/angular-ngx/index.html'));
});
