const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

//Encrypt password usign bcrypt
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Match user entered password to hached password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  //Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  console.log(resetToken)

  //hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    //set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 
    //10 minutos

    return resetToken
}

module.exports = mongoose.model('User', UserSchema)
