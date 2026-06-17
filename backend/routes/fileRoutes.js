const express = require("express");
const authenticate = require("../middleware/authenticate");
const { FileNode, Folder, File } = require("../models/FileNode");
const User = require("../models/User");

const router = express.Router();

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
  const { name, type, currDir } = req.body;

  if (!name || !type || !currDir) {
    return res
      .status(400)
      .json({ error: "name, type, and currDir are required." });
  }
  if (!["file", "folder"].includes(type)) {
    return res.status(400).json({ error: "Type must be 'file' or 'folder'." });
  }

  try {
    const parentDir = await FileNode.findOne({
      _id: currDir,
      owner: req.user._id,
    });
    if (!parentDir) {
      return res.status(404).json({ error: "Current directory not found." });
    }

    const nodeData = {
      name,
      owner: req.user._id,
      parent: currDir,
      ancestors: [...parentDir.ancestors, currDir],
    };

    const newNode =
      type === "folder"
        ? new Folder(nodeData)
        : new File({ ...nodeData, content: "" });

    await newNode.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { usedSpace: newNode.size },
    });

    res.status(201).json({ node: newNode });
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
  const { dirArray, currDir } = req.body;

  if (!currDir) {
    return res.status(400).json({ error: "currDir is required." });
  }
  if (!Array.isArray(dirArray) || dirArray.length === 0) {
    return res
      .status(400)
      .json({ error: "dirArray must be a non-empty array." });
  }

  try {
    let currDirId = currDir;
    let curr = await FileNode.findOne({ _id: currDirId, owner: req.user._id });

    if (!curr)
      return res.status(404).json({ error: "Current directory not found." });

    for (const segment of dirArray) {
      if (segment === "..") {
        if (String(currDirId) === String(req.user.rootDir)) {
          return res.status(400).json({ error: "Already at root directory." });
        }
        currDirId = curr.parent;
        curr = await FileNode.findOne({ _id: currDirId, owner: req.user._id });
        continue;
      }

      const nextDir = await FileNode.findOne({
        parent: currDirId,
        owner: req.user._id,
        name: segment,
        type: "folder",
      });

      if (!nextDir) {
        return res
          .status(404)
          .json({ error: `Directory not found: ${segment}` });
      }

      curr = nextDir;
      currDirId = nextDir._id;
    }

    const ancestorDocs = await FileNode.find(
      { _id: { $in: curr.ancestors } },
      { name: 1 },
    );

    const ancestorMap = Object.fromEntries(
      ancestorDocs.map((a) => [String(a._id), a.name]),
    );

    const pathArr = [
      ...curr.ancestors.map((id) => ancestorMap[String(id)]),
      curr.name,
    ];

    res.json({ currDir: currDirId, pathArr });
  } catch (error) {
    next(error);
  }
});

// GET /api/file/path?currDir=<id>
router.get("/path", authenticate, async (req, res, next) => {
  const { currDir } = req.query;

  if (!currDir)
    return res.status(400).json({ error: "currDir query param is required." });

  try {
    const node = await FileNode.findOne({ _id: currDir, owner: req.user._id });
    if (!node) return res.status(404).json({ error: "Directory not found." });

    const ancestorDocs = await FileNode.find(
      { _id: { $in: node.ancestors } },
      { name: 1 },
    );

    const ancestorMap = Object.fromEntries(
      ancestorDocs.map((a) => [String(a._id), a.name]),
    );

    const pathArr = [
      ...node.ancestors.map((id) => ancestorMap[String(id)]),
      node.name,
    ];

    res.json({ pathArr });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
