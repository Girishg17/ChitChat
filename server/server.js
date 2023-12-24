const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const users = {}; // Mapping of usernames to socket IDs

io.on('connection', (socket) => {
  // User login
  socket.on('login', (username) => {
    console.log(`${username} logged in with socket ID: ${socket.id}`);
    // Associate the username with the socket ID
    io.emit('user_list', Object.keys(users));
    users[username] = socket.id;
  });

  // Private message
  socket.on('private_message', ({ recipient, message }) => {
    console.log('private_message event received', recipient, message);
    const recipientSocketId = users[recipient];
    console.log('recipientSocketId', recipientSocketId, 'users', users, 'recipient', recipient, 'message', message, 'socket.id', socket.id, 'users[recipient]', users[recipient]);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive_private_message', {
        sender: socket.id,
        message,
      });
    } else {
      console.log(`User ${recipient} is not online.`);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const disconnectedUser = Object.keys(users).find((key) => users[key] === socket.id);
    if (disconnectedUser) {
      console.log(`${disconnectedUser} with socket ID ${socket.id} disconnected.`);
      delete users[disconnectedUser];
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
