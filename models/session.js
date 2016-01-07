const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports = mongoose.model('Sessions', new Schema({ 
	_id: String,
	_socketId: String,
	expires: Date,
	session: Schema.Types.Mixed
}));