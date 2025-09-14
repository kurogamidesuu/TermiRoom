const express = require('express');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// get history from DB
router.get('/history', authenticate, async (req, res) => {
  res.json({history: req.user.history || [] });
});

// set history into DB
router.post('/history', authenticate, async (req, res) => {
  req.user.history = req.body.history;
  await req.user.save();
  res.json({success: true});
});

router.get('/theme', authenticate, async (req, res) => {
  res.json({themeIndex: req.user.themeIndex || 0 });
});

router.post('/theme', authenticate, async (req, res) => {
  req.user.themeIndex = req.body.themeIndex;
  await req.user.save();
  res.json({success: true});
});

module.exports = router;