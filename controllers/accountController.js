const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login',
    nav,
    notice: req.flash('notice'),
    errors: null,
    account_email: '', // Sticky email input
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register',
    nav,
    notice: req.flash('notice'),
    errors: null,
    account_firstname: '',
    account_lastname: '',
    account_email: '',
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Server-side validation check already ran in middleware
  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.',
    );
    return res.status(500).render('account/register', {
      title: 'Register',
      nav,
      notice: req.flash('notice'),
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  // Register account
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, you're registered ${account_firstname}. Please log in.`,
    );
    return res.status(201).render('account/login', {
      title: 'Login',
      nav,
      notice: req.flash('notice'),
      errors: null,
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    return res.status(501).render('account/register', {
      title: 'Register',
      nav,
      notice: req.flash('notice'),
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash('notice', 'Please check your credentials and try again.');
    return res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password; // no enviar la contraseña al cliente
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      );

      if (process.env.NODE_ENV === 'development') {
        res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie('jwt', accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

      return res.redirect('/account/');
    } else {
      req.flash('notice', 'Please check your credentials and try again.');
      return res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error('Access Forbidden');
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin };
