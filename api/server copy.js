const express = require("express");
const sql = require("mssql");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");



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

const tokenSecret = 'codeStoneSecret';


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



app.use(bodyParser.json());

app.get('/', function(req, res) {
  console.log('Server works', req);
  res.send('Server works')
})

// Use JWT verify before allowing route
// Route Guard middleware
app.get('/test-route', verifyToken, function(req, res){
  const user_data = req.user;

  db = new sqlite3.Database('codestone.sql');
  const sql = 'SELECT question from questions';
  db.all(sql, (err, row) => {
    res.json({ ...user_data, questions: row })
  })
})

//AdminView users just pulls the users from the database
app.get("/admin-view-users", function(req, res) {
  // connect to your database
  sql.connect(config, function(err) {
    if (err) console.log(err + "initial connection");
    console.log(config.server);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query("select * from Users ", function(err, recordset) {
      if (err) console.log(err);

      // send records as a response

      res.json(recordset);
    });
  });
});

app.get("/user-questions", verifyToken, function(req, res) {
  app.use(function(req, res, next) {
    var token = req.cookies.auth;

    console.log(bearerToken + "before if");
    // decode token
    if (token) {
      console.log(bearerToken);

      jwt.verify(token, "secret", function(err, token_data) {
        if (err) {
          console.info("token did not work");
          return res.status(403).send("Error");
        } else {
          req.user_data = token_data;
          sql.connect(config, function(err) {
            if (err) console.log(err);

            // create Request object
            var request = new sql.Request();

            // query to the database and get the records
            request.execute("dbo.ViewQuestions", function(err, recordset) {
              if (err) console.log(err);

              // send records as a response

              res.json(recordset);
              next();
            });
          });
        }
      });
    } else {
      console.info("no token");
      console.log("no token");
      return res.status(403).send("No token");
    }
  });
});

app.post("/admin-Add-Users", async (req, response) => {
  sql.connect(config, function(err) {
    if (err) {
      console.log(err);
      response.status(400);
      response.send(err);
    } else {
      try {
        var request = new sql.Request();

        var body = req.body;

        console.log(body);

        if (body) {
          var email = body.email;
          var password = body.password;

          request.input("email", sql.VarChar, email);
          request.input("password", sql.VarChar, password);
          request.execute("dbo.RegisterUsers");

          response.status(201);
          response.send("User added ");
          console.log("added user");
        } else {
          response.status(400);
          response.send("no content was provided");
        }
      } catch (e) {
        console.log(e);
        response.status(400);
        response.send(e);
      }
    }
  });
});

///SELECT * from  RegisteredUsers where  Email = @email  AND PasswordHash = HASHBYTES('SHA2_512', @password + 'skrrt')

//AdminView users just pulls the users from the database
app.post("/admin-Add-Users", async (req, response) => {
  sql.connect(config, function(err) {
    try {
      if (err) {
        console.log(err);
        response.status(400);
        response.send(err);
      } else {
        var request = new sql.Request();

        var body = req.body;

        console.log(body);

        if (body) {
          var email = body.email;
          var password = body.password;

          request.input("email", sql.VarChar, email);
          request.input("password", sql.VarChar, password);
          request.query(
            "SELECT * FROM TestLogin WHERE email = @email AND password = @password",
            function(err, recordset) {
              if (err) console.log(err);
              res.json(recordset);
            }
          );

          response.status(201);
          response.send("User added ");
          console.log("added user");
        } else {
          response.status(400);
          response.send("no content was provided");
        }
      }
    } catch (e) {
      console.log(e);
      response.status(400);
      response.send(e);
    }
  });
});

app.post("/login", async (req, res) => {
  console.log('Call login')
  const { username: email, password } = req.body;
  
  var db = new sqlite3.Database('codestonedb.sql')

  const sql = 'SELECT * FROM users WHERE username = ?';

  db.get(sql, [email], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if(row.username && row.username === email) {
     const valid = bcrypt.compareSync(password, row.passwordHash)

     if(valid) {
       const token = jwt.sign({ email }, tokenSecret)

       res.status(200).json({ jwt: token });
     }
     
    } else {
      res.status(401).json({ message: 'Error invalid username'})
    }
   
  });

  // try {
  //   await sql.connect(config);

  //   var request = new sql.Request();
  //   var email = req.body.email;
  //   var Password = req.body.password;

  //   console.log({ Email, Password });

  //   request.input("Email", sql.VarChar, Email);
  //   request.input("Password", sql.VarChar, Password);

  //   var queryString =
  //     "SELECT * FROM TestLogin WHERE email = @Email AND password = @Password";

  //   //"SELECT * FROM RegisteredUsers WHERE email = @Email AND Password = HASHBYTES('SHA2_512', @Password + 'skrrt')";

  //   const result = await request.query(queryString);

  //   if (result.recordsets[0].length > 0) {
  //     console.info("correct details");
  //     var token = jwt.sign(
  //       { email },
  //       "secret",
  //       { expiresIn: "30s" },
  //       (err, token) => {
  //         res.json({
  //           token
  //         });

  //         res.cookie("auth", token);
  //         res.send("ok");

  //         console.log(req.body);
  //       }
  //     );
  //   } else {
  //     console.info("/login: bad creds");
  //     res.status(400).send("Incorrect email and/or Password!");
  //   }
  // } catch (err) {
  //   console.log("Err: ", err);
  //   res.status(500).send("Check api console.log for the error");
  // }
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const token = req.headers["authorization"].replace('Bearer ', '');
  // Check if bearer is undefined
  console.log('Token', token);
  jwt.verify(token, tokenSecret, function(err, token_data) {
    if(err) {
     return res.status(401).send(err.message);
    }

    const { email } = token_data;
    db = new sqlite3.Database('codestonedb.sql') 
    const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
    db.get(sql, [email], (err, row) => {
      req.token = token
      req.user = { username: row.username };
      next()
    });
  })
}




app.listen(port, () => console.log(`Server running on port ${port}`));
