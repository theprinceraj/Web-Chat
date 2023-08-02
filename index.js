const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Serve static files from various directories
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = {}; // To store usernames and corresponding socket IDs

io.on('connection', socket => {
    io.emit('user connect', `User (${socket.id}) has connected`);

    socket.on('setUsername', (username) => {
        if (!users[username]) {
            // Username available
            users[username] = socket.id;
            socket.emit('usernameSet', username); // Notify the user that the username is set
        } else socket.emit('usernameTaken', username); //Username already taken
    });

    socket.on('chat message', (message) => {
        // Find username assosciated with socket
        const username = Object.keys(users).find(name => users[name] === socket.id);
        if (username) {
            if (message.length > 100) {
                socket.emit('messageError', 'Message should not exceed 100 characters.');
                return;
            }
            io.emit('message', { username, message });
        }
    })

    socket.on('disconnect', () => {
        io.emit('user disconnect', `User (${socket.id}) has disconnected`);
    });
});

server.listen(3000, () => {
    console.log(`Server live at http://localhost:3000`);
});