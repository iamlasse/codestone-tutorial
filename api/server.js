const express = require("express");
const sql = require("mssql");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

const cors = require('cors')


var session = require("express-session");
const jwt = require("jsonwebtoken");

var path = require("path");

// !Only for lesson
var sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt');
const saltRounds = 10;

var config = {
  user: "sa",
  password: "Mypassword123",
  server: "WIN10-LAP-HJP", // You can use 'localhost\\instance' to connect to named instance
  database: "CDA"
};

// Constants
const TOKEN_SECRET = 'codeStoneSecret';



app.use(bodyParser.json());
app.use(cors())

app.get('/', function(req, res) {
  console.log('Server works', req);
  res.send('Server works')
})

// Use JWT verify before allowing route
// Route Guard middleware
app.get('/questions', verifyToken, function(req, res){
  const user_data = req.user;

  db = new sqlite3.Database('codestone.sql');
  const sql = 'SELECT question from questions';
  db.all(sql, (err, row) => {
    res.json({ ...user_data, questions: row })
  })
})

const myMiddleWare = (req, res, next) => {
  const secretdata = 'this is secret'
  req.secretdata = secretdata;
  next()
}

const myOtherMiddleWare = ({ secretdata }, res, next) => {
  console.log('Secret data in otehr middle ware: ', secretdata);
  next()
}

//AdminView users just pulls the users from the database
app.post("/login", myMiddleWare, myOtherMiddleWare, (req, res) => {
  console.log('Call login', req.body);
  const { username: email, password } = req.body;
  
  const db = new sqlite3.Database('codestonedb.sql')
  
  const sql = 'SELECT * FROM users WHERE username = ?';

  db.get(sql, [email], (err, row) => {
    console.log('From db ', row)
    if (err) {
      return console.error(err.message);
    }
    
    if(row.username && row.username === email) {
     const valid = bcrypt.compareSync(password, row.passwordHash)

     if(valid) {
       const token = jwt.sign({ email, sub: email }, TOKEN_SECRET, {
         expiresIn: '1m'
       })

       res.status(200).json({ jwt: token });
     }
     
    } else {
      res.status(401).json({ message: 'Error invalid username'})
    }
  })
});


// Verify Token
function verifyToken(req, res, next) {
  // FORMAT OF TOKEN
  // Authorization: Bearer <access_token>
  // Get auth header value
  const token = req.headers["authorization"].replace('Bearer ', '');
  // Check if bearer is undefined
  console.log('Token', token);
  jwt.verify(token, TOKEN_SECRET, function(err, token_data) {
    if(err) {
     return res.status(401).send(err.message);
    }

    const { email, ...rest } = token_data;
    db = new sqlite3.Database('codestonedb.sql') 
    const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
    db.get(sql, [email], (err, row) => {
      req.token = token
      req.user = { username: row.username };
      console.log(rest);
      next()
    });
  })
}

app.listen(port, () => console.log(`Server running on port ${port}`));
seedDB();

function seedDB(){
  
var db = new sqlite3.Database('codestonedb.sql')

const hashPass = (pass) => bcrypt.hashSync(pass, saltRounds);

db.serialize(function () {
  db.run('DROP TABLE IF EXISTS users ')
  db.run('DROP TABLE IF EXISTS questions')
  db.run('CREATE TABLE IF NOT EXISTS users (username TEXT, passwordHash TEXT)')
  db.run('CREATE TABLE IF NOT EXISTS questions (question TEXT)')
  
  
  var stmt = db.prepare('INSERT INTO users VALUES (?, ?)')
  
  for (var i = 0; i < 2; i++) {

    const password = hashPass('Mypassword123');
    

    stmt.run(`user${i}@codestone.com`, password)
  }
  
  stmt.finalize()
  
  
  stmt = db.prepare('INSERT INTO questions VALUES (?)')
  
  for (var i = 0; i < 10; i++) {
    stmt.run('Some Question');
  }
  
  stmt.finalize()
  
  db.each('SELECT rowid AS id, question FROM questions', function (err, row) {
    console.log(row.id + ': ' + row.question)
  })

  db.each('SELECT rowid AS id, username, passwordHash FROM users', function (err, row) {
    console.log(row.id + ': ' + row.username)
    console.log(row.id + ': ' + row.passwordHash)
  })
})

db.close()
}