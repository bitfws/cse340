const utilities = require('.');
const { body, validationResult } = require('express-validator');
const accountModel = require('../models/account-model');

const validate = {};

/* **********************************
 * Registration Rules
 ********************************* */
validate.registrationRules = () => [
  body('account_firstname')
    .trim()
    .notEmpty()
    .withMessage('Please provide a first name.'),

  body('account_lastname')
    .trim()
    .notEmpty()
    .withMessage('Please provide a last name.'),

  body('account_email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required.')
    .custom(async (email) => {
      const exists = await accountModel.checkExistingEmail(email);
      if (exists) {
        throw new Error(
          'Email exists. Please log in or use a different email.',
        );
      }
    }),

  body('account_password')
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('Password does not meet requirements.'),
];

/* **********************************
 * Check Registration Data
 ********************************* */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render('account/register', {
      title: 'Register',
      nav,
      errors,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
  }
  next();
};

/* **********************************
 * Login Rules
 ********************************* */
validate.loginRules = () => [
  body('account_email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email.'),

  body('account_password').notEmpty().withMessage('Password is required.'),
];

/* **********************************
 * Check Login Data
 ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render('account/login', {
      title: 'Login',
      nav,
      errors,
      account_email: req.body.account_email,
    });
  }
  next();
};

/* **********************************
 * Update Account Rules
 ********************************* */
validate.updateRules = () => [
  body('account_firstname')
    .trim()
    .notEmpty()
    .withMessage('First name is required.'),

  body('account_lastname')
    .trim()
    .notEmpty()
    .withMessage('Last name is required.'),

  body('account_email')
    .trim()
    .isEmail()
    .withMessage('Valid email required.')
    .custom(async (email, { req }) => {
      const existing = await accountModel.getAccountByEmail(email);
      if (existing && existing.account_id != req.body.account_id) {
        throw new Error('Email already exists.');
      }
    }),
];

/* **********************************
 * Check Update Account Data
 ********************************* */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render('account/update', {
      title: 'Update Account',
      nav,
      errors,
      account: req.body,
    });
  }
  next();
};

/* **********************************
 * Password Rules
 ********************************* */
validate.passwordRules = () => [
  body('account_password')
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be at least 12 characters and include uppercase, lowercase, number, and symbol.',
    ),
];

/* **********************************
 * Check Password Data
 ********************************* */
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render('account/update', {
      title: 'Update Account',
      nav,
      errors,
      account: { account_id: req.body.account_id },
    });
  }
  next();
};

module.exports = validate;
