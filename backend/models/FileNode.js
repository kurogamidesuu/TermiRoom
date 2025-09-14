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
  size: {
    type: Number,
    default: 0,
  },
  
}, {
  timestamps: true,
  discriminatorKey: 'type'
});

const FileNode = mongoose.model('FileNode', FileNodeSchema);

const FileSchema = mongoose.Schema({
  content: {
    type: String,
    default: '',
  }
});

const FolderSchema = mongoose.Schema({
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FileNode',
    }
  ]
});

const File = FileNode.discriminator('file', FileSchema);
const Folder = FileNode.discriminator('folder', FolderSchema);

module.exports = {FileNode, File, Folder};