const express = require('express');
const app = express();
const port = process.env.port || 3000;

const server = app.listen(port, () => {
    console.log('Server running @' + port);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(socket.id);
});