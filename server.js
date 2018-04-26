
// requiring the web framework express library
var express = require('express');

// creating an app object from the constructor
var app = express();

// file system library
var fs = require('fs');

// path module?
var path = require('path');

// creating a http server using the express framework
var server = require('http').createServer(app);

// requiring socket.io's listen call back
var io = require('socket.io').listen(server);

// logging middleware
var logger = require("morgan");

// array of users
var users = [];

// array of connections
var connections = [];

// game code references

var game = null;

// constants for path finding
var ROOT_DIRECTORY = process.cwd();
var PUBLIC_DIRECTORY = process.cwd() + '/public';
var TESTBED_DIRECTORY = process.cwd() + '/testbed';
var SERVER_DIRECTORY = process.cwd() + "/server";
var CLIENT_DIRECTORY = process.cwd() + "/client";
var UTILITY_DIRECTORY = process.cwd() + "/utility";
var EDITOR_DIRECTORY = process.cwd() + "/level-editor";
var GAME_DIRECTORY = SERVER_DIRECTORY + "/game";

// server listening on port 3000
server.listen(process.env.PORT || 3000);

// app.use('/static', express.static(__dirname + '/public'));

// appending logger library to express app
app.use(logger('tiny'));

// app.use(express.static('.'));

app.get('/editor',function(req,res){


  console.log("USER : Local User Accessed Level Editor: " + req.connection.remoteAddress);

  app.use(express.static(EDITOR_DIRECTORY));

  res.sendFile(EDITOR_DIRECTORY + '/editor.html');

});

// app.get('/testbed',function(req,res){
//
//   console.log("USER : Local User Accessed Level Editor: " + req.connection.remoteAddress);
//   app.use(express.static(TESTBED_DIRECTORY));
//   res.sendFile(TESTBED_DIRECTORY + '/index.html');
//
// });

app.get('/testbed/behaviour',function(req,res){
  var DIRECTORY = TESTBED_DIRECTORY + '/behaviour';
  app.use(express.static(DIRECTORY));
  res.sendFile(DIRECTORY+'/index.html');
});

app.get('/testbed/supercover',function(req,res){
  var DIRECTORY = TESTBED_DIRECTORY + '/supercover';
  app.use(express.static(DIRECTORY));
  res.sendFile(DIRECTORY+'/index.html');
});

app.get('/',function(req,res){

  app.use(express.static(PUBLIC_DIRECTORY));

  // checking if connecting ip is from local machine or remote
  if(isLocal(req.connection.remoteAddress)){
    console.log("USER : Local User Accessed Game: " + req.connection.remoteAddress);
  } else {
    console.log("USER : Remote User Accessed Game: " + req.connection.remoteAddress);
  }

  // sending local webpage
  res.sendFile(PUBLIC_DIRECTORY + '/index.html');

});

console.log("Server Running...");

// main on connection function
io.sockets.on('connection', function(socket){

  // adding socket connection to connections array
  connections.push(socket);

  game.addPlayer(socket);

  // console.log('Connected: %s sockets connected',connections.length)
  console.log("User Connected @ ",socket.request.connection.remoteAddress);

  // providing socket on disconnection behaviour
  socket.on('disconnect',function(data){
    // disconnect case, splicing socket connection from array
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected: %s sockts connected',connections.length)

  });


});

function isLocal(ip){
  return ip === "::ffff:127.0.0.1" || ip === "::1" || ip === "127.0.0.1"
}
