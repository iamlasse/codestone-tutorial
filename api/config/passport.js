const sqlite3 = require('sqlite3').verbose(),
  passport = require('passport'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt'),
  signJwt = require('../utils').signJwt;

const TOKEN_SECRET = 'codeStoneSecret';

const configurePassport = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  const opts = {};

  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
    opts.secretOrKey = TOKEN_SECRET;
  opts.issuer = 'accounts.junction.ai';
  opts.audience = 'junction-ai';

  // Local => username, password
  passport.use(new LocalStrategy(
    function (email, password, done) {
      const db = new sqlite3.Database('codestonedb.sql');
      const sql = 'SELECT * FROM users WHERE username = ?';
      db.get(sql, [email], async (err, row) => {
        console.log('Local Strategy ', row)
        if (err) {
          console.error(err.message);
          return done(err, false)
        }
        if (row.username && row.username === email) {
          const valid = await bcrypt.compare(password, row.passwordHash)
          const { firstName, lastName } = row;
          if (valid) {
            const token = signJwt(row);
            return done(null, { firstName, lastName, id: email, jwt: token });
          }
        }

        return done(null, false);
      });
    }
  ));

  // JWT => Bearer token  
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log('Authenticate jwt', jwt_payload)
    const db = new sqlite3.Database('codestonedb.sql');
    const sql = 'SELECT rowid AS id, username, firstName, lastName, role from users WHERE username = ?';
    const { sub: email } = jwt_payload;

    db.get(sql, [email], (err, row) => {
      console.log('JWT Strategy ', row.id)
      if (err) {
        console.error(err.message);
        return done(err, false)
      }

      if (row.username && row.username === email) {
        return done(null, row);
      }

      return done(null, false);
    });
  }));

  passport.serializeUser(function (user, done) {
    console.log('Serialize: ', user)
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    const db = new sqlite3.Database('codestonedb.sql');
    const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
    db.get(sql, [id], (err, row) => {

      if (err) {
        done(err, null)
      }
      console.log('Deserialize user: ', id, row);
      done(null, row);

    })
  });
}

module.exports = configurePassport