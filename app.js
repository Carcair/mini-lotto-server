const express = require('express');
const app = express();
const port = process.env.port || 3000;

const server = app.listen(port, () => {
    console.log('Server running @' + port);
});

const io = require('socket.io')(server);

// cntr predstavlja brojac prije početka runde
var cntr = 120;

// start je povezana sa početkom odbrojavanja (false ako nije započeto, true ako jeste)
var start = false;

// Niz kuglica
var brojevi = [];

var shuffle = () => {
    let temp = [];
    for(let i = 1; i <= 45; i++){
        temp.push(i);
    }
    for(let i = 0; i < temp.length; i++){
        let j = Math.floor(Math.random() * 44 + 1);
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    brojevi = temp;
}
shuffle();

io.on('connection', (socket) => {
    console.log(socket.id);
    
    if(!start){
        start = !start;
        socket.on('START_COUNTER', () => {
            var cntrInt = setInterval(() => {
                if(cntr <= 0){
                    io.emit('NUMBERS', brojevi);
                    clearInterval(cntrInt);
                }
                io.emit('COUNTER', cntr);
                cntr--;
            }, 1000);
        });
    } else {
        socket.on('START_COUNTER', () => {
            let cntrIntTemp = setInterval(() => {
                if(cntr == 0){
                    clearInterval(cntrIntTemp);
                }
                io.emit('COUNTER', cntr);
            }, 1000);
        });
    }
    
});