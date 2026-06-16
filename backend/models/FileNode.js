const mongoose = require("mongoose");

const FileNodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [255, "Name cannot exceed 255 characters"],
    },

    type: {
      type: String,
      enum: ["file", "folder"],
      required: true,
      immutable: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      immutable: true,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileNode",
      default: null,
      index: true,
    },

    ancestors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FileNode",
      },
    ],

    size: {
      type: Number,
      default: 0,
      min: 0,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },

    isReadOnly: {
      type: Boolean,
      default: false,
    },

    lastOpened: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
    versionKey: false,
  },
);

FileNodeSchema.index(
  {
    owner: 1,
    parent: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

const FileNode = mongoose.model("FileNode", FileNodeSchema);

const FileSchema = new mongoose.Schema({
  content: {
    type: String,
    default: "",
  },

  extension: {
    type: String,
    default: "",
    lowercase: true,
    trim: true,
  },

  mimeType: {
    type: String,
    default: "text/plain",
  },
});

const FolderSchema = new mongoose.Schema({});

FileSchema.pre("save", function (next) {
  this.size = Buffer.byteLength(this.content, "utf8");
  next();
});

const File = FileNode.discriminator("file", FileSchema);
const Folder = FileNode.discriminator("folder", FolderSchema);

module.exports = {
  FileNode,
  File,
  Folder,
};
