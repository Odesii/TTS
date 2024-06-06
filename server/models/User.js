const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const itemSchema = require('./Item');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    shrooms: {
      type: Number,
      default: 0
    },
    inventory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Item'
      }
    ]
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual('healthPotions').get(function () {
  return this.inventory.filter((item) => item.name === 'health').length;
});

userSchema.virtual('attackPotions').get(function () {
  return this.inventory.filter((item) => item.name === 'attack').length;
});

userSchema.virtual('defensePotions').get(function () {
  return this.inventory.filter((item) => item.name === 'defense').length;
});

const User = model('User', userSchema);

module.exports = User;
