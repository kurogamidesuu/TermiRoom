const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authenticate = require('./middleware/authenticate');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'src', 'index.html'));
})

app.use('/api', userRoutes);
app.use('/api/file', fileRoutes);

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