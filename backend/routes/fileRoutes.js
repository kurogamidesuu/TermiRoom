const express = require('express');
const authenticate = require('../middleware/authenticate');
const FileNode = require('../models/FileNode');

const router = express.Router();

router.get('/curr', authenticate, (req, res) => {
  res.json({id: req.user.rootFolder});
});

router.get('/node/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const fileNode = await FileNode.findById(id);
    res.json({node: fileNode});
  } catch(error) {
    res.status(500).json({error: `Server error: ${error}`});
  }
});

router.get('/node/:id/children', async (req, res) => {
  const {id} = req.params;
  try {
    const fileNode = await FileNode.findById(id);
    res.json({children: fileNode.children});
  } catch(error) {
    res.status(500).json({error: `Server error: ${error}`});
  }
})

module.exports = router;