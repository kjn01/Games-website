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
        origin: ['http://localhost:3000', 'https://main--kjn01-connect4.netlify.app/']
    }
});

io.on('connection', (socket) => {

    console.log(`User connected: ${socket.id}`);

    socket.on('joinGame', (data) => {
        socket.join(data);
        console.log(`${socket.id} joined: ${data.game}`);
    });

    socket.on('updateBoard', (data) => {
        socket.to(data.game).emit('recieveBoard', data);
        console.log(`${socket.id} moved`);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// let board = [[0, 0, 0, 0, 0, 0, 0],
//              [0, 0, 0, 0, 0, 0, 0],
//              [0, 0, 0, 0, 0, 0, 0],
//              [0, 0, 0, 0, 0, 0, 0],
//              [0, 0, 0, 0, 0, 0, 0],
//              [0, 0, 0, 0, 0, 0, 0]];

// app.get("/api/updateBoard", (req, res) => {
//     board = req.query.board;
//     console.log(board);
//     res.send(board);
// });

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });