import { signJwt } from '../utils';
import send from '../mailer';
/**
 * Authenticate
 * @param {*} req request
 * @param {*} res response
 */
export const authenticate = (req, res) => {
  console.log('Server works', req.locals);
  const { template, email } = req.locals;
  const { firstName, lastName, id } = req.user;
  const subject = 'Yoo Hoo';
  send(email, subject, template);
  res.json({
    jwt: signJwt(req.user),
    user: {
      id,
      firstName,
      lastName
    }
  })
}

/**
 * Login
 * @param {*} req request
 * @param {*} res response
 */
export const login = (req, res) => {
  console.log('Call login', req.user);
  const { jwt, ...user } = req.user
  res.json({ user, jwt });
}