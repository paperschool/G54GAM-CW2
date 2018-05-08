
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

// server listening on port 3000
server.listen(process.env.PORT || 3000);

// app.use('/static', express.static(__dirname + '/public'));

// appending logger library to express app
app.use(logger('tiny'));

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
