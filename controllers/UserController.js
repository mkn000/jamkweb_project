/* UserController on Userin tietokantaoperaatiot
ja autentikaation sisältävä kontrolleri.
Se sisältää kaksi metodia: registerUser jolla
luodaan uusi käyttäjä kantaan ja authenticateUser
jolla suoritetaan autentikaatio.
*/

const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const LeaderCon = require('../controllers/LeaderboardController');
const createToken = require('../createtoken.js');

const UserController = {
  // uuden käyttäjän rekisteröinti
  registerUser: function (req, res, next) {
    // passu kryptataan ennen kantaan laittamista
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
      username: req.body.username,
      password: hashedPassword
    })
      .then(user => {
        const token = createToken(user); // tokenin luontimetodi
        // palautetaan token JSON-muodossa
        res.json({
          success: true,
          message: 'Tässä on valmis Token!',
          token: token
        });
      })
      .catch(err => {
        if (err.code === 11000) {
          return res.json({
            success: false,
            message: 'Username already exists.'
          });
        } else {
          return res.status(500).send(err);
        }
      });
  },
  // olemassa olevan käyttäjän autentikaatio
  // jos autentikaatio onnistuu, käyttäjälle luodaan token
  authenticateUser: function (req, res, next) {
    // etsitään käyttäjä kannasta http-pyynnöstä saadun käyttäjätunnuksen perusteella
    User.findOne({
      username: req.body.username
    })
      .then(user => {
        console.log(user);
        if (!user) {
          res.json({
            success: false,
            message: 'Autentikaatio epäonnistui, käyttäjää ei ole.'
          });
        } else if (user) {
          // console.log(req.body.password); // lomakkelle syötetty salasana
          // console.log(user.password); // kannassa oleva salasana
          // verrataan lomakkeelle syötettyä salasanaa kannassa olevaan salasanaan
          // jos vertailtavat eivät ole samat, palautetaan tieto siitä että salasana oli väärä
          if (bcrypt.compareSync(req.body.password, user.password) === false) {
            res.json({
              success: false,
              message: 'Autentikaatio epäonnistui, väärä salasana.'
            });
          } else {
            // jos salasanat ovat samat, luodaan token
            const token = createToken(user); // tokenin luontimetodi
            // palautetaan token JSON-muodossa
            res.json({
              success: true,
              message: 'Tässä on valmis Token!',
              token: token
            });
          }
        }
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  },

  deleteUser: function (req, res) {
    User.findByIdAndDelete(req.decoded.dbid)
      .then(user => {
        //remove leaderboard entries
        LeaderCon.deleteByName({name: user.username});
        console.log('Deleted user: ' + user);
        res.json({success: true, message: 'User deleted'});
      })
      .catch(err => {
        console.error(err);
        res.json({success: false, message: 'Error. Could not delete user'});
      });
  },

  //update the number of games played and personal best score
  updateUser: function (req, res) {
    User.findById(req.decoded.dbid)
      .then(user => {
        //update personal best
        if (user.score < req.params.upscore) {
          User.updateOne(
            {_id: req.decoded.dbid},
            {
              score: req.params.upscore,
              $inc: {gamesplayed: 1}
            }
          ).then(user => {
            console.log(
              'Gamesplayed and score updated for user: ' + user.username
            );
            res.json({
              success: true,
              message: 'Gamesplayed and score updated'
            });
          });
        } else {
          User.updateOne({_id: req.decoded.dbid}, {$inc: {gamesplayed: 1}});
          console.log('Gamesplayed updated for user: ' + user.username);
          res.json({success: true, message: 'Gamesplayed updated'});
        }
        //submit for leaderboard
        LeaderCon.submitNew({name: user.username, score: req.params.upscore});
      })
      .catch(err => console.error(err));
  },

  //fetch user data
  getUser: function (req, res) {
    User.findById(req.decoded.dbid)
      .then(user => {
        const info = {
          name: user.name,
          score: user.score,
          gamesplayed: user.gamesplayed
        };
        res.json(info);
      })
      .catch(err => console.error(err));
  }
};

module.exports = UserController;
