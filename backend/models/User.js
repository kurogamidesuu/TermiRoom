const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    storageQuota: {
      type: Number,
      default: 100 * 1024 * 1024, // 100 MB
      min: 0,
    },

    usedSpace: {
      type: Number,
      default: 0,
      min: 0,
    },

    rootDir: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileNode",
      required: true,
    },

    history: {
      type: Array,
      default: [],
      validate: {
        validator: (arr) => arr.length <= 1000,
        message: "History cannot exceed 1000 entries",
      },
    },

    themeIndex: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", function (next) {
  if (this.username) {
    this.username = this.username.trim();
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
