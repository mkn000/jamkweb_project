/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();
const userCon = require('../controllers/UserController');
const authorize = require('../verifytoken');

/*

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
*/
// rekisteröityminen eli luodaan uudelle käyttäjän tunnarit
router.post('/register', userCon.registerUser);
// kirjautuminen eli autentikaatio tunnareilla
router.post('/login', userCon.authenticateUser);
//päivitä score
router.put('/update/:upscore', authorize, userCon.updateUser);
//get user score
router.get('/me', authorize, userCon.getUser);
//delete user
router.delete('/', authorize, userCon.deleteUser);

module.exports = router;
