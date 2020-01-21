import express from "express";
import bodyParser from "body-parser";
import passport from 'passport';
import configurePassport from './config/passport';
import cors from 'cors';

import { isAdmin, seedDB } from './utils';
// Route Handlers
import { login, authenticate } from './routes/auth.routes';
import { add, getAll } from './routes/user.routes';
import { getUsers, addQuestion } from './routes/admin.routes';

const app = express();

// Configure Express
app.use(express.static('src'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(session({ secret: 'secretOption', cookie: { secure: true } }));
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}))

// Configure Passport
configurePassport(app);
/**
 * Setup Routes
 */

// Login with username and password to get jwt from session
app.post("/login", passport.authenticate('local'), login);

// Authenticate with JWT
app.get('/authenticate', passport.authenticate('jwt'), authenticate)

// Use JWT verify before allowing route
// Route Guard middleware
app.get('/questions', passport.authenticate('jwt'), getAll);
app.post('/questions', passport.authenticate('jwt'), add)

// Route guarded for JWT as well as admin role.
app.get('/users', passport.authenticate('jwt'), isAdmin, getUsers);
app.post('/admin/questions', passport.authenticate('jwt'), isAdmin, addQuestion);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  seedDB();
  console.log(`Server running on port ${port}`)
});