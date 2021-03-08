import mongoose, { Schema } from 'mongoose';

const PostSchema: Schema = new Schema({
	id: {
		type: String,
	},
	title: {
		type: String,
	},
	url: {
		type: String,
	},
	userEmail: {
		type: String,
	},
	creationTime: {
		type: Date,
	},
	labels: {
		type: [String],
	},
});

export default mongoose.model('post', PostSchema);
