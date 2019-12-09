// Setup basic express server
let express = require('express');
let app = express();
let path = require('path');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 80;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, '../dist')));

// Chatroom

let numUsers = 0;
let users = [];
let messageList = [];
let groupTitle = '群聊';

io.on('connection', (socket) => {
  let addedUser = false;

  socket.on('clear msg', (num) => {
    let max = messageList.length - 1;
    try {
      num = parseInt(num);
      num = num < 0 ? 0 : num;
      num = num > max ? max : num;
    } catch (error) {
      num = max;
    }
    messageList.splice(0, num);
    socket.broadcast.emit('clear msg', {
      messageList
    });
    socket.emit('clear msg', {
      messageList
    });
  });

  socket.on('set title', (title) => {
    groupTitle = title;
    socket.emit('set title', {
      title,
      username: socket.username
    });
    socket.broadcast.emit('set title', {
      title,
      username: socket.username
    });
  });

  socket.on('get users', () => {
    socket.emit('user list', {
      users: users
    });
    socket.broadcast.emit('user list', {
      users: users
    });
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    let time = Date.now();
    messageList.push({
      text: data,
      time,
      user: {
        nickName: socket.username
      }
    });
    if (messageList.length > 100) {
      messageList.splice(0, messageList.length - 100);
    }
    // we tell the client to execute 'new message'
    socket.emit('new message', {
      username: socket.username,
      message: data,
      time
    });
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
      time
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    users.push(username);
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
      users: users,
      title: groupTitle,
      messageList: messageList
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      users: users
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      let index = users.indexOf(socket.username);
      if (index !== -1) {
        users.splice(index, 1);
      }

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers,
        users: users
      });
    }
  });
});
