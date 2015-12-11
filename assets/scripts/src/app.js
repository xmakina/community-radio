import Parser from 'react-dom-parser';
import Input from './classes/input';
import Player from './classes/player';

Parser.register({Input, Player});

Parser.parse($('body')[0]);

var socket = io();
socket.on('message', (msg) => {
	console.log(msg);
});

setTimeout(() => {
	socket.emit('chat message', 'hi');
}, 1000);