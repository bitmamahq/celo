const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.status(200).send({ good: true });
  } catch (err) {
    res.status(400).send({ error: true, reason: err.message });
  }
});

module.exports = router;
