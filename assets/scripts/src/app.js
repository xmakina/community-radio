import Parser from 'react-dom-parser';
import dom from './utils/dom';
import Input from './classes/input';
import Player from './classes/player';
import Controls from './classes/controls';

Parser.register({Input, Player, Controls});

Parser.parse(dom.$body[0]);

var socket = io();
socket.on('message', (msg) => {
	console.log(msg);
});

setTimeout(() => {
	socket.emit('chat message', 'hi');
}, 1000);