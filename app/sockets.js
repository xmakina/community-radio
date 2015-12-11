module.exports = (io) => {

	io.on('connection', (socket) => {

		//socket.emit //send-client only
		//io.emit //all clients including sender
		//socket.broadcast.emit //send to all clients except sender
		
		// socket.on('message', function(msg){
			
		// });

		//socket.broadcast.emit('message', 'hello'); //Send to all but current user
		//socket.emit('message', 'hello'); //Send to all users
		
	});

}