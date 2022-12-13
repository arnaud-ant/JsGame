const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

mongoose.connect('mongodb://localhost/ChatSocket', {useNewUrlParser: true, useUnifiedTopology: true }, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log('Connecté à MongoDB');
  }
});

require('./models/user.model');
require('./models/chat.model');
var User = mongoose.model('user');
var Chat = mongoose.model('chat');

var now = new Date();
const port = 3000;
var users = [];
var connectedUsers = [];
var playersList = [];

class Player {
  constructor(soc){
      this.name = ""//connectedUsers[connectedUsers.indexOf(soc)].pseudo;
      this.char = "";
      this.socket = soc;
      this.x=0;
      this.y=0;
      this.left=false;
      this.right=false;
      this.up=false;
      this.down=false;
      this.width=32;
      this.height= 48;
      this.frameX= 0;
      this.frameY= 0;
      this.speed = 6;
      this.moving = false;
  }
  updatePos(){
    if (!this.left){
      this.moving = false;
    }
    
    if (!this.right)
    {
      this.moving = false;
    }

    if (!this.down)
    {
      this.moving=false;
    }
    if (!this.up)
    {
      this.moving=false;
    }

    if (this.left && this.x > 0){
      this.x -= this.speed;
      this.frameY = 1;
      this.moving = true;
    }
    
    if (this.right && this.x < 800 - this.width)
    {
      this.x += this.speed;
      this.frameY = 2;
      this.moving = true;
    }

    if (this.down && this.y < 600 - this.height)
    {
      this.y += this.speed;
      this.frameY = 0;
      this.moving=true;
    }
    if (this.up && this.y > 0)
    {
      this.y -= this.speed;
      this.frameY = 3;
      this.moving=true;
    }
  }
  
  changeFrame()
{
    if (this.frameX < 3 && this.moving) this.frameX++
    else this.frameX=0;
}
}

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.post('/login', (req, res) => {
  res.redirect('back');
});

app.post('/', function(request, response){
  if (request.body.user.name){
    username=request.body.user.name;
    char=request.body.char;

    User.find((err,users) =>
    {
      response.render('game.ejs', {users: users, username: username, char: char});
    });
  }
});

io.on("connection", function(socket) {
  var player = new Player(socket.id);
  playersList[socket.id] = player; 

  socket.on('keyPress', (data) => {
    if(data.inputId === 'left')
      player.left=data.state;
    if(data.inputId === 'right')
      player.right=data.state;
    if(data.inputId === 'up')
      player.up=data.state;
    if(data.inputId === 'down')
      player.down=data.state;
  });

  socket.on("pseudo", function ({pseudo: pseudo, char: char}){
    User.findOne({pseudo: pseudo}, (err, user) => {
      if (user){
        player.char=char;
        player.name = pseudo;
        socket.pseudo = pseudo;
        socket.broadcast.emit("newUser",pseudo);
        users.push(pseudo);
        console.log("Joueur(s) connecté(s) : " + users);
      } else {
        var user = new User();
        user.pseudo = pseudo;
        user.save();

        player.char=char;
        player.name = pseudo;
        socket.pseudo = pseudo;
        socket.broadcast.emit("newUser",pseudo);
        socket.broadcast.emit("newUserInDb", pseudo);
      }
      

      connectedUsers.push(socket);
      Chat.find({receiver: 'all'},(err,messages) => {
        socket.emit('oldMessages', messages);
      }).sort({$natural: -1}).limit(2);
    });
  });
  
  socket.on('oldWhispers', (pseudo) => {
    Chat.find({receiver: pseudo}, (err,messages) => {
      if(err) {
        return false;
      } else {
        socket.emit('oldWhispers', messages);
      }
    }).sort({$natural: -1}).limit(5);
  });

  socket.on('disconnect', () => {
    var index = connectedUsers.indexOf(socket);
    if (index > -1) {
      connectedUsers.splice(index, 1);
    }
    delete playersList[socket.id];
    var index2 = users.indexOf(socket.pseudo)
    if (index2 > -1) {
      users.splice(index2, 1);
    }
    socket.broadcast.emit('quitUser', socket.pseudo);
    console.log("Joueur(s) connecté(s) : " + users);
  });

  socket.on('newMessage', (message, receiver) =>{
    if (receiver === "all")
    {
      var chat = new Chat();
      chat.content = message +  "   - " + now.getHours() + ":" + now.getMinutes();
      chat.sender = socket.pseudo;
      chat.receiver = "all";
      chat.save();

      socket.broadcast.emit('newMessageAll',{message: message, pseudo: socket.pseudo});
    } else {

      User.findOne({pseudo: receiver}, (err,user) => {
      
        if (!user)
        {
          return false;
        } else {
          socketReceiver = connectedUsers.find(socket => socket.pseudo === user.pseudo)
          
          if (socketReceiver){
            socketReceiver.emit('whisper', {sender : socket.pseudo, message: message});
          }
        
          var chat = new Chat();
          chat.content = message +  "   - " + now.getHours() + ":" + now.getMinutes();
          chat.sender = socket.pseudo;
          chat.receiver = receiver;
          chat.save();  
        }
      });  
    }
    
  });

  socket.on('writting', (pseudo) => {
    socket.broadcast.emit('writting', pseudo);
  });

  socket.on('notwritting', () => {
    socket.broadcast.emit('notwritting');
  });

});

app.get('/', (req, res) => {
  res.render('login.ejs');
});



http.listen(port, () => {
  console.log(`Jeu de Télécom sur : http://localhost:${port}`)
});

setInterval(function() {
  var pack = [];
  for (var i in playersList){
    var player = playersList[i];
    player.updatePos();
    player.changeFrame();
    pack.push({
      char:player.char,
      x:player.x,
      y:player.y,
      name:player.name,
      width:player.width,
      height:player.height,
      frameX:player.frameX,
      frameY:player.frameY,
    });
  }
  for (var i in connectedUsers){
    var socket = connectedUsers[i];
    socket.emit('newPos', pack);
  }

},1000/30);