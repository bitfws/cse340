const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login',
    nav,
    notice: req.flash('notice'),
    errors: null,
    account_email: '',
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav();
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
  const nav = await utilities.getNav();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('account/register', {
      title: 'Register',
      nav,
      notice: null,
      errors,
      ...req.body,
    });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.account_password, 10);
  } catch {
    req.flash('notice', 'Registration failed.');
    return res.redirect('/account/register');
  }

  const regResult = await accountModel.registerAccount(
    req.body.account_firstname,
    req.body.account_lastname,
    req.body.account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, ${req.body.account_firstname}. Please log in.`,
    );
    res.redirect('/account/login');
  } else {
    req.flash('notice', 'Registration failed.');
    res.redirect('/account/register');
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('account/login', {
      title: 'Login',
      nav,
      notice: null,
      errors,
      account_email: req.body.account_email,
    });
  }

  const accountData = await accountModel.getAccountByEmail(
    req.body.account_email,
  );

  if (!accountData) {
    req.flash('notice', 'Invalid credentials.');
    return res.redirect('/account/login');
  }

  const match = await bcrypt.compare(
    req.body.account_password,
    accountData.account_password,
  );

  if (!match) {
    req.flash('notice', 'Invalid credentials.');
    return res.redirect('/account/login');
  }

  delete accountData.account_password;

  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  });

  res.cookie('jwt', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 3600 * 1000,
  });

  res.redirect('/account');
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav();
  const account = await accountModel.getAccountById(
    res.locals.accountData.account_id,
  );

  res.render('account/management', {
    title: 'Account Management',
    nav,
    account,
    notice: req.flash('notice'),
  });
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdateAccount(req, res) {
  const nav = await utilities.getNav();
  const account = await accountModel.getAccountById(req.params.account_id);

  res.render('account/update', {
    title: 'Update Account',
    nav,
    account,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
  });
}

/* ****************************************
 *  Process account update
 * *************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('account/update', {
      title: 'Update Account',
      nav,
      errors,
      account: req.body,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
  }

  const account_id = res.locals.accountData.account_id;

  await accountModel.updateAccount(
    req.body.account_firstname,
    req.body.account_lastname,
    req.body.account_email,
    account_id,
  );

  req.flash('notice', 'Account updated successfully.');
  res.redirect('/account');
}

/* ****************************************
 *  Process password change
 * *************************************** */
async function changePassword(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('notice', 'Password does not meet requirements.');
    return res.redirect(`/account/update/${req.body.account_id}`);
  }

  const hashedPassword = await bcrypt.hash(req.body.account_password, 10);
  await accountModel.updatePassword(
    hashedPassword,
    res.locals.accountData.account_id,
  );

  req.flash('notice', 'Password updated successfully.');
  res.redirect('/account');
}

/* ****************************************
 *  Logout
 * *************************************** */
async function logout(req, res) {
  res.clearCookie('jwt');
  req.flash('notice', 'You have logged out.');
  res.redirect('/');
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  changePassword,
  logout,
};
