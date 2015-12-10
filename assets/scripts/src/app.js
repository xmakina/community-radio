var Parser = require('react-dom-parser');

Parser.register({
	Input: require('./classes/input.jsx')
});

Parser.parse($('body')[0]);

var socket = io();
socket.on('message', function(msg){
	console.log(msg);
});

setTimeout(function(){
	socket.emit('chat message', 'hi');
}, 1000);