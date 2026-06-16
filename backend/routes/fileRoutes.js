const express = require("express");
const authenticate = require("../middleware/authenticate");
const { FileNode, Folder, File } = require("../models/FileNode");
const User = require("../models/User");

const router = express.Router();

// GET /api/file/curr
router.get("/curr", authenticate, (req, res) => {
  res.json({ currDir: req.tokenPayload.currDir });
});

// GET /api/file/node/:id
router.get("/node/:id", authenticate, async (req, res, next) => {
  try {
    const fileNode = await FileNode.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!fileNode) {
      return res.status(404).json({ error: "Node not found." });
    }
    res.json({ node: fileNode });
  } catch (error) {
    next(error);
  }
});

// GET /api/file/node/:id/children
router.get("/node/:id/children", authenticate, async (req, res, next) => {
  try {
    const children = await FileNode.find({
      parent: req.params.id,
      owner: req.user._id,
    });

    res.json({ children });
  } catch (error) {
    next(error);
  }
});

// POST /api/file/create
router.post("/create", authenticate, async (req, res, next) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "Name and type are required." });
  }
  if (!["file", "folder"].includes(type)) {
    return res.status(400).json({ error: "Type must be 'file' or 'folder'." });
  }

  try {
    const currDirId = req.tokenPayload.currDir;
    const currDir = await FileNode.findOne({
      _id: currDirId,
      owner: req.user._id,
    });

    if (!currDir) {
      return res.status(404).json({ error: "Current directory not found." });
    }

    const nodeData = {
      name,
      owner: req.user._id,
      parent: currDirId,
      ancestors: [...currDir.ancestors, currDirId],
    };

    let newNode;
    if (type === "folder") {
      newNode = new Folder(nodeData);
    } else {
      newNode = new File({ ...nodeData, content: "" });
    }

    await newNode.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { usedSpace: newNode.size },
    });

    res.status(200).json({ node: newNode });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "A file or folder with that name already exists here.",
      });
    }
    next(error);
  }
});

// PATCH /api/file/cd
router.patch("/cd", authenticate, async (req, res, next) => {
  const { dirArray } = req.body;

  if (!Array.isArray(dirArray) || dirArray.length === 0) {
    return res
      .status(400)
      .json({ error: "dirArray must be a non-empty array." });
  }

  try {
    let currDirId = req.tokenPayload.currDir;
    let currDir = await FileNode.findOne({
      _id: currDirId,
      owner: req.user._id,
    });

    if (!currDir)
      return res.status(404).json({ error: "Current directory not found." });

    for (const segment of dirArray) {
      if (segment === "..") {
        if (String(currDirId) === String(req.user.rootDir)) {
          return res.status(400).json({ error: "Already at root directory." });
        }
        currDirId = currDir.parent;
        currDir = await FileNode.findOne({
          _id: currDirId,
          owner: req.user._id,
        });
        continue;
      }

      const next = await FileNode.findOne({
        parent: currDirId,
        owner: req.user._id,
        name: segment,
        type: "folder",
      });

      if (!next) {
        return res
          .status(404)
          .json({ error: `Directory not found: ${segment}` });
      }

      currDir = next;
      currDirId = next._id;
    }

    res.json({ currDir: currDirId });
  } catch (error) {
    next(error);
  }
});

// GET /api/file/path
router.get("/path", authenticate, async (req, res, next) => {
  try {
    const currDir = await FileNode.findOne({
      _id: req.tokenPayload.currDir,
      owner: req.user._id,
    });

    if (!currDir) {
      return res.status(404).json({ error: "Current directory not found." });
    }

    const ancestorDocs = await FileNode.find(
      { _id: { $in: currDir.ancestors } },
      { name: 1 },
    );

    const ancestorMap = Object.fromEntries(
      ancestorDocs.map((a) => [String(a._id), a.name]),
    );

    const pathArr = [
      ...currDir.ancestors.map((id) => ancestorMap[String(id)]),
      currDir.name,
    ];

    res.json({ pathArr });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
