import Parser from 'react-dom-parser';
import Input from './classes/input';

Parser.register({
	Input: Input
});

Parser.parse($('body')[0]);

var socket = io();
socket.on('message', function(msg){
	console.log(msg);
});

setTimeout(function(){
	socket.emit('chat message', 'hi');
}, 1000);

const test = 'test';
console.log(test);