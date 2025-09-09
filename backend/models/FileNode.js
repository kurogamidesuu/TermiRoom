const mongoose = require('mongoose');

const FileNodeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileNode',
    default: null,
  },
  ancestors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FileNode',
    }
  ],
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FileNode',
    }
  ],
  size: {
    type: Number,
    default: 0,
  },
  content: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FileNode', FileNodeSchema);