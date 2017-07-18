var express = require("express");
var path = require("path");
var jwt = require("jsonwebtoken");
var jwtSecret = "helloTaro"
var app = express();
var bodyParser = require('body-parser');
//
var socketioJwt = require('socketio-jwt');
var socketIo = require('socket.io')
//
var BJModule = require('./blackJack2.js')
//
var game = new BJModule.BlackJack();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
//

app.get('/', function(req,res){
  res.render("index");
});

app.get('/exit',function(req,res){
  console.log("exited")
  req.session.destroy();
  res.redirect('/');
});

app.post('/login', function(req,res){
  console.log(req.body.name)
  var profile = {
   name: req.body.name,
   id: 1
 };

 var token = jwt.sign(profile, jwtSecret, { expiresIn: 60*5 });
 res.json({token: token});
});

var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});

//      Socket Stuff

var sio = socketIo.listen(server);
sio.use(socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}));

sio.sockets.on('connection', function (socket) {
    console.log(socket.id, "connected")
    console.log(socket.decoded_token.name, 'connected');
    console.log(game.playersList, "are currently connected")
    newPlayer = new BJModule.Player(socket.decoded_token.name, `${socket.id}`);
    // newPlayer.money = Math.floor(Math.random()*100 + 1000); //testing money
    socket.emit("new_user", {newPlayer: newPlayer, other_players: game.playersList })
    socket.broadcast.emit("other_player", {newPlayer: newPlayer })
    game.addPlayer(newPlayer);
     //socket.on('event');
     socket.on("msg", function(data){
       console.log("someone sent me this")
     })

     socket.on("disconnect", function(){
       for(var idx in game.playersList){
         if(game.playersList[idx]['id'] == socket.id){
           game.playersList.splice(idx,1);
           socket.broadcast.emit("player_left", {delete_player_id : `${socket.id}`})
         }
       }
       console.log(socket.id, 'disconnected')
     })

     socket.on("start_round", function(){
       sio.emit("betting_phase")
     });

     socket.on("placing_bet", function(data){
       for (let i in game.playersList){
         if(game.playersList[i].id == socket.id){
           console.log("player found, placing his bet now")
           game.playersList[i].betting(data.bet_amount)
           console.log(`player has ${game.playersList[i].money} money left`)
           socket.broadcast.emit("someone_placed_a_bet", {betInfo : {id: socket.id, other_players_bet: game.playersList[i].currBet, other_players_money: game.playersList[i].money}})
         }
       }
      //  console.log(`what is data? ${data}`)
      //  console.log(`user ${socket.id} placed a bet`)
     })

});
