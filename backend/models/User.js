const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  storageQuota: {
    type: Number,
    default: 100 * 1024 * 1024,
  },
  usedSpace: {
    type: Number,
    default: 0,
  },
  rootDir: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileNode',
  },
  currDir: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileNode',
  },
  history: {
    type: Array,
    default: [],
  },
  themeIndex: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);