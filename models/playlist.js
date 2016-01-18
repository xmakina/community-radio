const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	playlistSchema = new Schema({
		name: {
			type: String,
			required: true
		},
		songs: {
			type: Array,
			required: true
		},
		user: {
			type: ObjectId,
			ref: 'User'
		}
	});

module.exports = mongoose.model('Playlist', playlistSchema);