const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  storage: {
    type: Object,
    
  }
})