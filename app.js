const express = require('express');
const app = express();
const port = process.env.port || 3000;

const server = app.listen(port, () => {
    console.log('Server running @' + port);
});

const io = require('socket.io')(server);

// Counter variable
var cntr = 119;

// Variable which represents if counter was already started by one user
// will be used to prevent other users to make conflicts in cntr value
var startCounter = false;

// Will be used in similiar fashion as start, it will represent the start of number draw
var startRound = false;

// End of number draw
var finished = false;

// Array of drawn numbers
var brojevi = [];


// Creating and shuffling numbers
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

// Send counter value, statement will get value from start var, so some part of code will
// not be done depending on it
var send_counter = (statement) => {
    if(!statement)
        startCounter = !startCounter;
    
    var cntrInt = setInterval(() => {
        if(cntr <= 0){
            clearInterval(cntrInt);
        }
        io.emit('COUNTER', cntr);
        
        if(!statement)
            cntr--;
    }, 1000);
}

// Sending numbers
var send_numbers = (statement) => {
    if(!statement){
        startRound = !startRound;
        for(let i = 0; i < 35; i++){
            setTimeout(() => {
                let data = brojevi.slice(0, i + 1);
                io.emit('NUMBER', data);
            }, 3000 + i * 3000);
        }
    }
}

// After connecting to this server from outside
io.on('connection', (socket) => {
    console.log(socket.id);
    
    socket.on('START_COUNTER', () => {
        send_counter(startCounter);
    })

    socket.on('START_ROUND', () => {
        send_numbers(startRound);
    })
});