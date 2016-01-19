const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	queueSchema = new Schema({
		name: {
			type: String
		},
		current: {
			type: Schema.Types.Mixed,
		},
		djs: [{
			type: ObjectId,
			ref: 'User'
		}]
	});

module.exports = mongoose.model('Queue', queueSchema);