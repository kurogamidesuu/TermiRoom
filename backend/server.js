const express = require('express');
const { default: mongoose } = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
})

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