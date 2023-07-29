const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Serve static files from various directories
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/scripts', express.static(__dirname));
app.use('/style', express.static(__dirname + '/style'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    io.emit('user connect', `User (${socket.id}) has connected`);

    socket.on('chat message', msg => {
        if (msg.length > 100) {
            socket.emit('messageError', 'Message should not exceed 100 characters.');
            return;
        }
        io.emit('chat message', msg);
    })
    socket.on('disconnect', () => {
        io.emit('user disconnect', `User (${socket.id}) has disconnected`);
    });
});

server.listen(3000, () => {
    console.log(`Server live at http://localhost:3000`);
});