const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.resolve(__dirname, '../frontend/build')));

app.get("/api", (req, res) => {
    res.json({message: "hello"});
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});