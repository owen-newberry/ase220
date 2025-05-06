const mongoose = require('mongoose');
const { Schema } = mongoose;

class User {
	constructor(
		username,
		email,
		password,
		campaigns
	) {
		this.username = username;
		this.email = email;
		this.password = password;
		this.campaigns = campaigns;
	}
}

const UserSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    campaigns: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign'
    }]
  });

  UserSchema.loadClass(User);

  module.exports = mongoose.model('users', UserSchema);