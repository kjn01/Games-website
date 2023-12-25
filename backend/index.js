const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static(path.resolve(__dirname, '../frontend/build')));

let board = [[0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0]];

app.get("/api/updateBoard", (req, res) => {
    board = req.query.board;
    console.log(board);
    res.send(board);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});