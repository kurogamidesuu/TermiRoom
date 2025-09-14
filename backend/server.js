const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const utilRoutes = require('./routes/utilRoutes');

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
app.use('/api/user', utilRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to the database.')
})
.catch((error) =>{
  console.error(`Something went wrong: ${error}`)
});

app.listen(PORT, () => {
  console.log(`The server is listening at http://localhost:${PORT}`);
})