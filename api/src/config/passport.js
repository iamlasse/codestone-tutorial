import sqlite3 from 'sqlite3';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { signJwt } from '../utils';

const TOKEN_SECRET = 'codeStoneSecret';

export default app => {
  app.use(passport.initialize());
  
  // Session or no?
  // app.use(passport.session());

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: TOKEN_SECRET,
    issuer: 'accounts.codestone.com',
    audience: 'codestone'
  };

  // Local => username, password
  passport.use(new LocalStrategy(
    function (email, password, done) {
      const db = new sqlite3.Database('codestonedb.sql');
      const sql = 'SELECT * FROM users WHERE username = ?';
      db.get(sql, [email], async (err, row) => {
        console.log('Local Strategy ', row)
        if (err) {
          console.error(err.message);
          return done(err)
        }
        if (row.username && row.username === email) {
          const valid = await bcrypt.compare(password, row.passwordHash)
          const { firstName, lastName } = row;
          if (!valid) {
            return done(null, false, { message: 'Incorrect Password'});
          }
          const token = signJwt(row);
          return done(null, { firstName, lastName, id: email, jwt: token });
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

