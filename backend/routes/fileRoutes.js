const express = require('express');
const authenticate = require('../middleware/authenticate');
const {FileNode, Folder, File} = require('../models/FileNode');
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

// create a directory or a file in current directory
router.post('/create', authenticate, async (req, res) => {
  const {name, type} = req.body;
  try {
    const currDirId = req.user.currDir;
    const currDir = await FileNode.findById(currDirId);

    if(!currDir) return res.status(500).json({error: 'Server error.'});

    let newFile;
    if(type === 'folder') {
      newFile = new Folder({
        name: name,
        owner: req.user._id,
        parent: currDirId,
        ancestors: [...currDir.ancestors, currDirId],
        children: [],
      });
    } else if(type === 'file') {
      newFile = new File({
        name: name,
        owner: req.user._id,
        parent: currDirId,
        ancestors: [...currDir.ancestors, currDirId],
        content: '',
      });
    }

    await newFile.save();

    currDir.children.push(newFile._id);
    const size = sizeof(newFile);
    currDir.size = currDir.size + size;
    await currDir.save();

    res.json({currDir, newFile});
  } catch(error) {
    res.status(500).json({error: `Server error: ${error}`});
  }
});

// change directory
router.patch('/cd', authenticate, async (req, res) => {
  const {dirArray} = req.body;

  try {
    let currDirId = req.user.currDir;
    let currDir = await FileNode.findById(currDirId);
    
    let found;
    for(const dir of dirArray) {
      if(dir === '..') {
        if(currDirId.equals(req.user.rootDir)) return res.status(500).json({error: 'Cannot go up the root directory.'});
        currDirId = currDir.parent;
        currDir = await FileNode.findById(currDirId);
        req.user.currDir = currDir._id;
        continue;
      }
      found = false;
      if(currDir.children) {
        for(const childId of currDir.children) {
          const childDir = await FileNode.findById(childId);
          if(childDir.name === dir && childDir.type === 'folder') {
            found = true;
            currDir = childDir;
            req.user.currDir = childId;
            break;
          }
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

// get current path
router.get('/path', authenticate, async (req, res) => {
  try {
    let pathArr = [];
    let curr = await FileNode.findById(req.user.currDir);
    while(curr !== null) {
      pathArr.unshift(curr.name);
      curr = await FileNode.findById(curr.parent);
    }

    res.json({pathArr});
  } catch(error) {
    res.status(500).json({error: `Server error: ${error}`})
  }

})

module.exports = router;