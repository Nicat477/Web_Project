const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true,
    maxlength: [100, 'Publisher name too long']
  },
  book: {
    type: String,
    required: [true, 'Book name is required'],
    trim: true,
    maxlength: [200, 'Book name too long']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(value) {
        return value <= Date.now();
      },
      message: 'Date cannot be in the future'
    }
  }
});

module.exports = mongoose.model('users', userSchema);