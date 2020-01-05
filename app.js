const express = require('express');
const app = express();
const port = process.env.port || 3000;

const server = app.listen(port, () => {
    console.log('Server running @' + port);
});

const io = require('socket.io')(server);

// Counter variable
var cntr = 119;
// Array of drawn numbers
var brojevi = [];

// State of application
// 0 = not started
// 1 = counter started
// 2 = counter finished / draw started
// 3 = sending numbers
// 3 = draw finished
// 4 = endgame
var stanje = 0;


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
//

// Send counter value, statement will get value from start var, so some part of code will
// not be done depending on it
var send_counter = () => {
    if(stanje == 0) stanje = 1;
    
    var cntrInt = setInterval(() => {
        if(cntr <= 0){
            stanje = 2
            clearInterval(cntrInt);
        }
        io.emit('COUNTER', cntr);
        cntr--;
    }, 1000);
}

// Sending numbers
var send_numbers = () => {
    if(stanje == 2){
        stanje = 3;
        for(let i = 0; i < 35; i++){
            setTimeout(() => {
                let data = brojevi.slice(0, i + 1);
                io.emit('NUMBER', data);
            }, 3000 + i * 3000);

            if(i == 34) {
                setTimeout(() => {
                    stanje == 4;
                    io.emit('ENDGAME');
                }, 5000);
            }
        }
    } else if (stanje == 3 && stanje == 4 && stanje == 5) {
        let data = brojevi.slice(0, 35);
        io.emit('NUMBER', data);
    }
}

// After connecting to this server from outside
io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('CHECK_STATE', () => {
        io.emit('STATE', stanje);
    });
    
    socket.on('PLAY', () => {
        switch(stanje){
            case 0:
                send_counter();
                break;
            case 1:
                break;
            case 2:
                send_numbers();
                break;
            case 3:
                send_numbers();
                break;
            case 4:
                send_numbers();
                break;
            case 5:
                send_numbers();
                break;
        }
    })
});