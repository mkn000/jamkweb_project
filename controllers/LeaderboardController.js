const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');

const LeaderboardController = {
  //submitNew is called from usercontroller, not through rest api
  submitNew: function (user, res) {
    Leaderboard.find()
      .then(entries => {
        //sort in descending order
        const sorted = entries.sort((a, b) => b.score - a.score);
        if (sorted.length < 5) {
          //new entry
          Leaderboard.create(user)
            .then(user =>
              console.log('Following user added to leaderboard: ' + user)
            )
            .catch(err => console.error(err));
        } else if (user.score > sorted[4].score) {
          //replacing the lowest score, remember the order in db doesn't matter
          Leaderboard.findByIdAndUpdate(sorted[4]._id, user).then(_ => {
            console.log('Leaderboard updated.');
          });
        }
      })
      .catch(err => console.error(err));
  },

  //return leaderboard entries
  fetchAll: function (req, res) {
    Leaderboard.find()
      .then(entries => {
        res.json(entries);
      })
      .catch(err => console.error(err));
  },

  /**called from usercontroller when deleting user from the database.
   * Leaderboard is then repopulated by finding topscores from remaining users
   */
  deleteByName(user) {
    Leaderboard.deleteOne({name: user.name})
      .then(_ => {
        console.log('Records deleted');
        User.find()
          .sort({score: -1})
          .limit(5)
          .then(entries => {
            console.log(entries);
            for (let i = 0; i < entries.length; i++) {
              LeaderboardController.submitNew({
                name: entries[i].username,
                score: entries[i].score
              });
            }
          });
      })
      .catch(err => console.error(err));
  }
};

module.exports = LeaderboardController;
