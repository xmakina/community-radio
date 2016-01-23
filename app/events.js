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

module.exports = emitter;