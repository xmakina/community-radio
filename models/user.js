const mongoose = require('mongoose'),
	io = require('../app/resources').io,
	User = require('./user'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	playlist = require('./playlist'),
	userSchema = new Schema({
		username: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		playlists: [{
			type: ObjectId,
			ref: 'Playlist'
		}],
		activePlaylist: {
			type: ObjectId,
			ref: 'Playlist'
		},
		_socketId: {
			type: String
		}
	});

module.exports = mongoose.model('User', userSchema);

userSchema.post('save', function(user) {
	// User.findOne({_id: doc.user}, (err, user) => {
	// 	if(user._socketId) {
	// 		io.sockets.connected[user._socketId].emit('playlist_updated', 'for your eyes only');
	// 	}
	// });
});