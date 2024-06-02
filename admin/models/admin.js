const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminschema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  contact: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  photo: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
    default: "India",
  },
  dob: {
    type: String,
  },
  store_name: {
    type: String,
  },
  store_city: {
    type: String,
  },
  store_state: {
    type: String,
  },
  store_address: {
    type: String,
  },
  store_postcode: {
    type: Number,
  },
});

adminschema.pre("save", function (next) {
  if (this.isModified("password")) {
    console.log(`the current password is  : ${this.password}`);
    const salt = bcrypt.genSaltSync(12);
    this.password = bcrypt.hashSync(this.password, salt);
    console.log(`the current password is  : ${this.password}`);
  }
  next();
});

adminschema.methods = {
  authenticate: async function (plaintext) {
    const x = bcrypt.compareSync(plaintext, this.password);
    return x;
  },
  comparePassword: function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  },
};

module.exports = mongoose.model("Admin", adminschema);
