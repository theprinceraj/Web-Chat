const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Serve static files from the "scripts" and "style" directories
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/style', express.static(__dirname + '/style'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log(`A user(${socket.id}) connected`);
    socket.on('chat message', message => {
        console.log(`${socket.id} sent: ${message}`);
    })
    socket.on('disconnect', () => {
        console.log(`User(${socket.id}) has disconnected`);
    });
});

server.listen(3000, () => {
    console.log(`Server live at http://localhost:3000`);
});