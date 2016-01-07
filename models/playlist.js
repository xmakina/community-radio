const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

module.exports = mongoose.model('Playlist', Schema({
	songs: {
		type: Array,
		required: true
	},
	user: {
		type: ObjectId,
		ref: 'User'
	}
}));