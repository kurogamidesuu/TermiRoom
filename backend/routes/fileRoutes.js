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

// change directory
router.patch('/cd', authenticate, async (req, res) => {
  const {dirArray} = req.body;

  try {
    const currDirId = req.user.currDir;
    let currDir = await FileNode.findById(currDirId);
    
    let found;
    for(const dir of dirArray) {
      if(dir === '..') {
        if(currDirId.equals(req.user.rootDir)) return res.status(500).json({error: 'Cannot go up the root directory.'});
        currDir = await FileNode.findById(currDir.parent);
        req.user.currDir = currDir._id;
        continue;
      }
      found = false;
      for(const childId of currDir.children) {
        const childDir = await FileNode.findById(childId);
        if(childDir.name === dir) {
          found = true;
          currDir = childDir;
          req.user.currDir = childId;
          break;
        }
      }
      if(!found) {
        return res.status(404).json({error: 'Invalid path: Could not find the directory'});
      }
    }
    await req.user.save();
    res.json({user: req.user});
  } catch(error) {
    return res.status(500).json({error: `Server error: ${error}`})
  }
});

module.exports = router;