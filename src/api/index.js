const express = require('express');
const rate = require('./rate');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - good',
  });
});

router.use('/rate', rate);

module.exports = router;
