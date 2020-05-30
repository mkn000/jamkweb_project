const jwt = require("jsonwebtoken");
/* luodaan token jos user (username ja password) on saatu.
    Token muodostuu user-objektista (payload),
    secret keystä ja optioista (tässä expiresIn)
    tokeniin ei pitäisi laittaa salasanaa koska se
    voidaan dekryptata tokenista. Kannattaa laittaa tokeniin
    vain tieto siitä onko käyttäjä admin. */
function createToken(user) {
  const payload = {
    username: user.username,
    dbid: user._id,
  }; // {'username':'tuito', 'isadmin': true}
  console.log(payload);
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: 60 * 60 * 24, // expiroituu 24 tunnissa
  });
  // const decodedtoken = jwt.decode(token);
  // console.log(decodedtoken);
  return token;
}

module.exports = createToken;
