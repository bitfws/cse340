/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();
const app = express();
const staticRoute = require('./routes/static');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/AccountRoute');
const utilities = require('./utilities');
const session = require('express-session');
const pool = require('./database');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

/* ***********************
 * View Engine and Templates
 *************************/

/* session middleware */
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  }),
);

/* ***********************
 * JWT + Globals Middleware  ✅ FIX CLAVE
 *************************/
app.use(utilities.checkJWTToken);

app.use((req, res, next) => {
  // Garantiza que SIEMPRE existan para EJS
  res.locals.loggedin = res.locals.loggedin || 0;
  res.locals.accountData = res.locals.accountData || null;
  next();
});

/* ***********************
 * Flash Messages Middleware
 *************************/
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* ***********************
 * View Engine Setup
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

/* ***********************
 * Body Parser Middleware
 *************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ***********************
 * Routes
 *************************/
app.use(staticRoute);
app.use('/inv', inventoryRoute);
app.use('/account', accountRoute);

// Index route
app.get('/', utilities.handleErrors(baseController.buildHome));

/* ***********************
 * 404 Middleware
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message =
    err.status === 404
      ? err.message
      : 'Oh no! There was a crash. Maybe try a different route?';

  res.status(err.status || 500).render('errors/error', {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
