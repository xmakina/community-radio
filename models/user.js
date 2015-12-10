var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

module.exports = mongoose.model('User', Schema({
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
	avatar: {
		type: String,
		required: true
	},
	playlists: [{
		type: ObjectId,
		ref: 'Playlist'
	}]
}));