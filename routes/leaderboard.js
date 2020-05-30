const express = require('express');
const router = express.Router();
const leaderCon = require('../controllers/LeaderboardController');

router.get('/', leaderCon.fetchAll);

module.exports = router;
