const express = require("express");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const HISTORY_LIMIT = 1000;

// GET /api/util/history
router.get("/history", authenticate, (req, res) => {
  res.json({ history: req.user.history || [] });
});

// POST /api/util/history
router.post("/history", authenticate, async (req, res, next) => {
  const { history } = req.body;

  if (!Array.isArray(history)) {
    return res.status(400).json({ error: "History must be an array." });
  }

  try {
    req.user.history = history.slice(-HISTORY_LIMIT);
    await req.user.save();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// GET /api/util/theme
router.get("/theme", authenticate, (req, res) => {
  res.json({ themeIndex: req.user.themeIndex ?? 0 });
});

// POST /api/util/theme
router.post("/theme", authenticate, async (req, res, next) => {
  const { themeIndex } = req.body;

  if (
    typeof themeIndex !== "number" ||
    themeIndex < 0 ||
    !Number.isInteger(themeIndex)
  ) {
    return res
      .status(400)
      .json({ error: "themeIndex must be a non-negative integer." });
  }

  try {
    req.user.themeIndex = themeIndex;
    await req.user.save();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
