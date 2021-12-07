const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio();
io.listen(5000);

app.use(express.json());


// Run when client connects
const connection = io.on('connection', socket => {
  console.log("New WS Connection onpend!!!");
  // socket.emit("message", "Welcome to Socket");

  // emit message
  // socket.emit("message", "Connection Started!!!");
});

app.post('/communication', (req, res) => {
  console.log("Request Body:");
  console.log(req.body);

  connection.emit('message', req.body);
  
  res.status(201).send("Request Completed");
  res.end();
});

const PORT = process.env.PORT || 3002;

server.listen(PORT);
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

