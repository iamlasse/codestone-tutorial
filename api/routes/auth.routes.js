const signJwt = require('../utils').signJwt

/**
 * Authenticate
 * @param {*} req request
 * @param {*} res response
 */
const authenticate = (req, res) => {
  console.log('Server works', req.user);
  const { firstName, lastName, id } = req.user;
  res.json({
    jwt: signJwt(req.user),
    user: {
      id,
      firstName,
      lastName
    }
  })
}

module.exports.authenticate = authenticate;

/**
 * Login
 * @param {*} req request
 * @param {*} res response
 */
const login = (req, res) => {
  console.log('Call login', req.user);
  const { jwt, ...user } = req.user
  res.json({ user, jwt });
}

module.exports.login = login