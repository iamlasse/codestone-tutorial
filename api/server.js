const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const configurePassport = require('./config/passport');
const cors = require('cors')
var session = require("express-session");

const isAdmin = require('./utils').isAdmin
const seedDB = require('./utils').seedDB;

// Route Handlers
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Configure Express
app.use(bodyParser.json());
app.use(session({ secret: 'secretOption', cookie: { secure: true } }));
app.use(cors())

// Configure Passport
configurePassport(app);

/**
 * Setup Routes
 */

// Login with username and password to get jwt from session
app.post("/login", passport.authenticate('local'), authRoutes.login);

// Authenticate with JWT
app.get('/authenticate', passport.authenticate('jwt', { session: false }), authRoutes.authenticate)

// Use JWT verify before allowing route
// Route Guard middleware
app.get('/questions', passport.authenticate('jwt'), userRoutes.getAll);
app.post('/questions', passport.authenticate('jwt'), userRoutes.add)

// Route guarded for JWT as well as admin role.
app.get('/users', passport.authenticate('jwt'), isAdmin, adminRoutes.getUsers);
app.post('/admin/questions', passport.authenticate('jwt'), isAdmin, adminRoutes.addQuestion);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  seedDB();
  console.log(`Server running on port ${port}`)
});