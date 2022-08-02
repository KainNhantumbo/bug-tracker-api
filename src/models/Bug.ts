import { model, Schema } from 'mongoose';

interface IBug {
	title: string;
	feature: string;
	priority: string;
	description: string;
	author: string;
	status: string;
	associated: string;
	notes: string;
	createdBy: string;
}

const BugSchema = new Schema<IBug>(
	{
		title: {
			type: String,
			maxlength: [256, 'Title field must not be over 256 characters.'],
			trim: false,
			required: [true, 'Please provide a title to your bug issue.'],
		},
		feature: {
			type: String,
			maxlength: [512, 'Feature field must not be over 512 characters.'],
			trim: false,
			required: false,
			default: '',
		},
		priority: {
			type: String,
			maxlength: [32, 'Priority field must not be over 32 characters.'],
			trim: true,
			required: [true, 'Please define a priority.'],
		},
		description: {
			type: String,
			maxlength: [4096, 'Bug priority field must not be over 4096 characters.'],
			trim: false,
			required: [true, 'Please provide a description.'],
		},
		author: {
			type: String,
			maxlength: [64, 'Author field must not be over 64 characters.'],
			trim: true,
			required: false,
			default: 'Unsigned.',
		},
		status: {
			type: String,
			maxlength: [32, 'Status field must not be over 32 characters.'],
			trim: true,
			required: [true, 'Please provide a priority to your bug issue.'],
		},
		associated: {
			type: String,
			maxlength: [256, 'Associated field must not be over 256 characters.'],
			trim: false,
			required: false,
			default: '',
		},
		notes: {
			type: String,
			maxlength: [1536, 'Notes field must not be over 1536 characters.'],
			trim: false,
			required: false,
			default: '',
		},
		createdBy: {
			type: String,
			required: [true, 'Please provide a user ID.'],
		},
	},
	{ timestamps: true }
);

const BugModel = model('Bug', BugSchema);

export default BugModel;
