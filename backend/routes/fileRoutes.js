const express = require('express');
const authenticate = require('../middleware/authenticate');
const FileNode = require('../models/FileNode');
const sizeof = require('object-sizeof');

const router = express.Router();

// get current directory
router.get('/curr', authenticate, (req, res) => {
  res.json({id: req.user.currDir});
});

// get FileNode by id
router.get('/node/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const fileNode = await FileNode.findById(id);
    res.json({node: fileNode});
  } catch(error) {
    res.status(500).json({error: `Server error: ${error}`});
  }
});

// get children of a directory
router.get('/node/:id/children', async (req, res) => {
  const {id} = req.params;
  try {
    const fileNode = await FileNode.findById(id);
    res.json({children: fileNode.children});
  } catch(error) {
    res.status(500).json({error: `Server error: ${error}`});
  }
});

// create a directory in current directory
router.post('/create/dir', authenticate, async (req, res) => {
  const {dirName} = req.body;
  try {
    const currDirId = req.user.currDir;
    const currDir = await FileNode.findById(currDirId);

    if(!currDir) return res.status(500).json({error: 'Server error.'});

    const newDir = new FileNode({
      name: dirName,
      type: 'folder',
      owner: req.user._id,
      parent: currDirId,
      ancestors: [...currDir.ancestors, currDirId],
      children: [],
    });

    await newDir.save();

    currDir.children.push(newDir._id);

    const size = sizeof(newDir);
    currDir.size = currDir.size + size;

    await currDir.save();

    res.json({currDir, newDir});
  } catch(error) {
    res.status(500).json({error: `Server error: ${error}`});
  }
});

module.exports = router;