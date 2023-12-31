const path = require("path");
const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://games-website.adaptable.app/', 'https://main--kjn01-connect4.netlify.app/', 'https://games-website-whhe.onrender.com/']
    }
});

io.on('connection', (socket) => {

    console.log(`User connected: ${socket.id}`);

    socket.on('joinGame', (data) => {

        if (io.sockets.adapter.rooms.get(data.game) === undefined || (io.sockets.adapter.rooms.get(data.game).size < 2 && !socket.rooms.has(data.game))) {
            socket.join(data.game);
            console.log(`${socket.id} joined: ${data.game}`);
            console.log(`Number of clients in game ${data.game}: ${io.sockets.adapter.rooms.get(data.game).size}`);
            if (io.sockets.adapter.rooms.get(data.game).size === 1) {
                socket.emit('assignColor', 'blue');
            }
            else if (io.sockets.adapter.rooms.get(data.game).size === 2) {
                socket.emit('assignColor', 'red');
                io.sockets.in(data.game).emit('startGame', data);
            }
        }
        else if (io.sockets.adapter.rooms.get(data.game) !== undefined && io.sockets.adapter.rooms.get(data.game).size === 2 && !socket.rooms.has(data.game)) {
            socket.emit('gameFull', data)
            console.log(`${socket.id} rejected from game: ${data.game}; game full`);
        }
    });

    socket.on('updateBoard', (data) => {
        socket.to(data.game).emit('recieveBoard', data);
        console.log(`${socket.id} moved on: ${data.game}`);
    });

    socket.on('rematch', (data) => {
        io.sockets.in(data.game).emit('startRematch', data);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});