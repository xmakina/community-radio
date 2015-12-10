var Parser = require('react-dom-parser');

Parser.register({
	Input: require('./classes/input.jsx')
});

Parser.parse($('body')[0]);

var socket = io();
//socket.emit('chat message', $('#m').val());
  // socket.on('chat message', function(msg){
  //   $('#messages').append($('<li>').text(msg));
  // });