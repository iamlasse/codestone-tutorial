const jwt = require("jsonwebtoken");
const TOKEN_SECRET = 'codeStoneSecret';
const sqlite3 = require('sqlite3').verbose()
var config = {
  user: "sa",
  password: "Mypassword123",
  server: "WIN10-LAP-HJP", // You can use 'localhost\\instance' to connect to named instance
  database: "CDA"
};
const bcrypt = require('bcrypt');
const saltRounds = 10;

const signJwt = ({ username: email }) => jwt.sign({
  email,
  sub: email,
  iss: 'accounts.junction.ai',
  aud: 'junction-ai'
}, TOKEN_SECRET, {
  expiresIn: '1m'
})

module.exports.signJwt = signJwt;

// Is Admin Middleware
const isAdmin = (req, res, next) => {
  console.log('Is admin', req.user);
  const { role } = req.user;
  if (role !== 'admin') {
    res.status(401).json({ message: 'Not allowed for non admins' });
  }

  next();
}

module.exports.isAdmin = isAdmin;

function seedDB() {

  var db = new sqlite3.Database('codestonedb.sql')

  const hashPass = (pass) => bcrypt.hashSync(pass, saltRounds);

  db.serialize(function () {
    db.run('DROP TABLE IF EXISTS users ')
    db.run('DROP TABLE IF EXISTS questions')
    db.run('CREATE TABLE IF NOT EXISTS users (username TEXT, passwordHash TEXT, firstName TEXT, lastName TEXT, role TEXT)')
    db.run('CREATE TABLE IF NOT EXISTS questions (question TEXT, user_id INTEGER)')


    var stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?)')

    const password = hashPass(config.password);
    for (var i = 0; i < 2; i++) {



      stmt.run(`user${i}@codestone.com`, password, `User${i}Name`, `User ${i} Last Name`, 'user');
    }

    stmt.run(`admin@codestone.com`, password, 'Admin', 'Admin', 'admin');

    stmt.finalize()


    stmt = db.prepare('INSERT INTO questions VALUES (?, ?)')

    for (var i = 0; i < 4; i++) {
      stmt.run(`Some ${i} Question`, 1);
    }
    for (var i = 0; i < 5; i++) {
      stmt.run(`Some ${i} Question`, 2);
    }

    stmt.finalize()

    db.each('SELECT rowid AS id, question, user_id FROM questions', function (err, row) {
      console.log(row.id + ': ' + row.question)
      console.log(row.id + ': ' + row.user_id)
    })

    db.each('SELECT rowid AS id, username, passwordHash, firstName, lastName FROM users', function (err, row) {
      console.log(row.id + ': ' + row.username)
      console.log(row.id + ': ' + row.firstName)
      console.log(row.id + ': ' + row.lastName)
    })
  })

  db.close()
}

module.exports.seedDB = seedDB;

  // Verify Token
// function verifyToken(req, res, next) {
//   // FORMAT OF TOKEN
//   // Authorization: Bearer <access_token>
//   // Get auth header value
//   const token = req.headers["authorization"].replace('Bearer ', '');
//   // Check if bearer is undefined
//   console.log('Token', token);
//   jwt.verify(token, TOKEN_SECRET, function(err, token_data) {
//     if(err) {
//      return res.status(401).send(err.message);
//     }

//     const { email, ...rest } = token_data;
//     db = new sqlite3.Database('codestonedb.sql') 
//     const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
//     db.get(sql, [email], (err, row) => {
//       req.token = token
//       req.user = { username: row.username };
//       console.log(rest);
//       next()
//     });
//   })
// }