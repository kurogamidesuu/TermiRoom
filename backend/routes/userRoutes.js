const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { FileNode, Folder } = require("../models/FileNode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticate = require("../middleware/authenticate");
const mongoose = require("mongoose");

const signToken = (user, currDirId) => {
  return jwt.sign(
    {
      username: user.username,
      userId: user._id,
      currDir: currDirId,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );
};

const setCookieToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// POST /api/user/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required.",
    });
  }

  try {
    const user = await User.findOne({ username: username }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = signToken(user, user.rootDir);
    setCookieToken(res, token);

    res.json({
      user: { username: user.username, id: user._id },
      currDir: user.rootDir,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/user/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const exisitingUser = await User.findOne({ username });
    if (exisitingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hash,
      rootDir: new mongoose.Types.ObjectId(),
    });

    const rootDir = new Folder({
      name: "root",
      owner: newUser._id,
      parent: null,
      ancestors: [],
    });

    await rootDir.save();
    newUser.rootDir = rootDir._id;
    await newUser.save();

    const token = signToken(newUser, rootDir._id);
    setCookieToken(res, token);

    res.status(201).json({
      user: { username: newUser.username, id: newUser._id },
      currDir: rootDir._id,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/user/profile
router.get("/profile", authenticate, async (req, res) => {
  res.json({
    username: req.user.username,
    id: req.user._id,
    storageQuota: req.user.storageQuota,
    usedSpace: req.user.usedSpace,
  });
});

// PATCH /api/user/profile/username
router.patch("/profile/username", authenticate, async (req, res, next) => {
  const { newUsername } = req.body;

  if (
    !newUsername ||
    typeof newUsername !== "string" ||
    newUsername.trim().length < 2
  ) {
    return res.status(400).json({ error: "Invalid username." });
  }

  try {
    const taken = await User.findOne({ username: newUsername.trim() });
    if (taken) {
      return res.status(400).json({ error: "Username already taken." });
    }

    req.user.username = newUsername.trim();
    await req.user.save();

    const token = signToken(req.user, req.user.rootDir);
    setCookieToken(res, token);

    res.json({ username: req.user.username });
  } catch (error) {
    next(error);
  }
});

// GET /api/user/auth/check
router.get("/auth/check", authenticate, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      username: req.user.username,
      id: req.user._id,
    },
    currDir: req.tokenPayload.currDir,
  });
});

// POST api/user/auth/logout
router.post("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully." });
});

module.exports = router;
