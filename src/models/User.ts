import { Schema, model } from 'mongoose';
import BugModel from './Bug';

interface IUser {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  password: string;
  recovery_key: string;
}

const UserSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      maxlength: [64, 'The provided first name is too long.'],
      required: [true, 'Please provide your first name.'],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, 'Please provide your last name.'],
      trim: true,
      maxlength: [64, 'Provided last name is too long.'],
    },
    user_name: {
      type: String,
      required: [true, 'Please provide your user name.'],
      trim: true,
      maxlength: [64, 'Provided user name is too long.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your e-mail adress.'],
      trim: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid e-mail adress.',
      ],
      unique: true,
      maxlength: [64, 'Provided e-mail adress is too long.'],
    },
    password: {
      type: String,
      minlength: [6, 'The password must have at least 6 charaters.'],
      required: [true, 'Please provide a password.'],
    },
    recovery_key: {
      type: String,
      required: [true, 'Please provide a user account recovery key.'],
    },
  },
  { timestamps: true }
);

// on user deletion remove all notes for that user
UserSchema.post('remove', function (id, next) {
  BugModel.deleteMany({ createdBy: id })
    .then(function () {
      next();
    })
    .catch((err) => {
      next(err);
    });
});

const UserModel = model('User', UserSchema);
export default UserModel;
