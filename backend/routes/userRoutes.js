const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FileNode = require('../models/FileNode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');

router.get('/login/:username', async (req, res) => {
  const {username} = req.params;

  try {
    const user = await User.findOne({username: username});
    if(!user) {
      return res.status(404).json({error: `${username} username doesn't exist`});
    }

    res.json({username: user.username, id: user._id});
  } catch(error) {
    return res.status(500).json({error: 'Server error.'});
  }
});

router.post('/login/:username', async (req, res) => {
  const {username} = req.params;
  const {password} = req.body;
  
  try {
    const user = await User.findOne({username: username});
    if(!user) {
      return res.status(404).json({error: 'username not found'});
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(400).json({error: 'Server error!'});

      if(result) {
        let token = jwt.sign({username: user.username, userId: user._id}, process.env.JWT_SECRET_KEY);
        res.cookie("token", token);
        res.json({user})
      } else {
        return res.status(400).json({error: 'Invalid password.'});
      }
    });
  } catch(error) {
    res.status(500).json({error: 'Server error.'});
  }
});

router.post('/register', async (req, res) => {
  const {username, password} = req.body;

  try {
    const user = await User.findOne({username: username});
    if(user) {
      return res.status(400).json({error: 'Username already exists.'});
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if(err) return res.status(400).json({error: 'Server error!'});

        const newUser = new User({
          username,
          password: hash,
          rootFolder: null,
        });

        const savedUser = await newUser.save();

        const rootFolder = new FileNode({
          name: '/',
          type: 'folder',
          owner: savedUser._id,
          parent: null,
          ancestors: [],
          children: [],
        });

        await rootFolder.save();
        savedUser.rootFolder = rootFolder._id;
        await savedUser.save();

        const token = jwt.sign({username: savedUser.username, userId: savedUser._id}, process.env.JWT_SECRET_KEY, {
          expiresIn: '7d'
        });

        res.cookie('token', token);

        res.json({user: {username: savedUser.username, id: savedUser._id}});
      });
    });
  } catch(error) {
    res.status(500).json({error: 'Server error.'});
  }
});

router.get('/user/profile', authenticate, async (req, res) => {
  try {
    res.json({
      username: req.user.username,
      id: req.user._id,
      storageQuota: req.user.storageQuota,
      usedSpace: req.user.usedSpace,
      host: req.host,
    });
  } catch(error) {
    res.status(500).json({error: 'Server error.'});
  }
});

router.post('/user/profile/username', authenticate, async (req, res) => {
  const {newUsername} = req.body;
  try {
    const user = await User.findOne({username: req.user.username});

    user.username = newUsername;
    await user.save();

    res.json({user})
  } catch(error) {
    res.status(500).json({error: 'Server error.'});
  }
});

router.get('/auth/check', authenticate, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      username: req.user.username,
      id: req.user._id,
    }
  });
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({message: 'Logged out successfully.'});
});

module.exports = router;