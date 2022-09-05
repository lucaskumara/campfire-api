const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Reputation response')
});

module.exports = router