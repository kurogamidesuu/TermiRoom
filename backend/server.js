const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authenticate = require('./middleware/authenticate');
const FileNode = require('./models/FileNode');
require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'src', 'index.html'));
})

app.get('/api/login/:username', async (req, res) => {
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

app.post('/api/login/:username', async (req, res) => {
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

app.post('/api/register', async (req, res) => {
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

app.get('/api/user/profile', authenticate, async (req, res) => {
  try {
    res.json({
      username: req.user.username,
      id: req.user._id,
      storageQuota: req.user.storageQuota,
      usedSpace: req.user.usedSpace,
    });
  } catch(error) {
    res.status(500).json({error: 'Server error.'});
  }
});

app.get('/api/auth/check', authenticate, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      username: req.user.username,
      id: req.user._id,
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({message: 'Logged out successfully.'});
});

// get history from DB
app.get('/api/user/history', authenticate, async (req, res) => {
  res.json({history: req.user.history || [] });
});

// set history into DB
app.post('/api/user/history', authenticate, async (req, res) => {
  req.user.history = req.body.history;
  await req.user.save();
  res.json({success: true});
});

app.get('/api/user/theme', authenticate, async (req, res) => {
  res.json({themeIndex: req.user.themeIndex || 0 });
});

app.post('/api/user/theme', authenticate, async (req, res) => {
  req.user.themeIndex = req.body.themeIndex;
  await req.user.save();
  res.json({success: true});
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to the database.')
})
.catch((error) =>{
  console.error(`Something went wrong: ${error}`)
})

app.listen(3000, () => {
  console.log('The server is listening at http://localhost:3000');
})