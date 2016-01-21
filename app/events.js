const EventEmitter = require('events'),
	User = require('../models/user'),
	Timeline = require('./timeline'),
	resources = require('./resources'),
	io = resources.io;

function TheEmitter() {
	EventEmitter.call(this);
}
require('util').inherits(TheEmitter, EventEmitter);
const emitter = new TheEmitter();

emitter.on('socketConnect', (socket) => {
	emitter.emit('queueChange');
	require('../controllers/radio').userEnteringRoom(socket);
});

emitter.on('socketDisconnect', (socket) => {
	require('../controllers/radio').userLeavingRoom(socket);
});

emitter.on('newSong', (id, dj) => {
	emitter.emit('queueChange');
});

emitter.on('joiningQueue', (user) => {
	emitter.emit('queueChange');
});

emitter.on('leavingQueue', (user) => {
	emitter.emit('queueChange');
});

emitter.on('queueChange', () => {
	User.find({
		inQueue: true
	}, (err, users) => {
		users = users.map((user) => {
			return {
				username: user.username,
				id: user._id
			}
		});
		var current = Timeline.currentDj;
		io.of('/radio').emit('queueChange', {users, current});
	});
});

module.exports = emitter;