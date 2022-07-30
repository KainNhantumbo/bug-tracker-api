import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
	name: string;
	surname: string;
	email: string;
	password: string;
}

const UserSchema = new Schema<IUser>({
	name: {
		type: String,
		maxlength: [50, 'The provided name is too long.'],
		required: [true, 'Please provide the name.'],
		trim: true,
	},
	surname: {
		type: String,
		required: [true, 'Please provide your surmane.'],
		trim: true,
		maxlength: [50, 'Provided surname is too long.'],
	},
	email: {
		type: String,
		required: [true, 'Please provide your e-mail adress.'],
		trim: true,
		match: [
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please provide a valid email.',
		],
		unique: true,
	},
	password: {
		type: String,
		minlength: [6, 'The password must have at least 6 charaters.'],
		required: [true, 'Please provide a password.'],
	},
});

// before saving a user, bcrypt hashes the password
// that is in the schema
UserSchema.pre('save', async function () {
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	} catch (err) {
		console.log(err);
	}
});

export default model('User', UserSchema);
