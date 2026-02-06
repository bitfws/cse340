const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');

/* **************************
 * Account Views
 * ************************** */
router.get('/login', utilities.handleErrors(accountController.buildLogin));

router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister),
);

/* **************************
 * Registration Processing
 * ************************** */
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
);

/* **************************
 * Login Processing
 * ************************** */
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
);

/* **************************
 * Account Management View
 * ************************** */
router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement),
);

/* **************************
 * Account Update View
 * ************************** */
router.get(
  '/update/:account_id',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount),
);

/* **************************
 * Account Update Processing
 * ************************** */
router.post(
  '/update',
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount),
);

/* **************************
 * Password Change Processing
 * ************************** */
router.post(
  '/change-password',
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword),
);

/* **************************
 * Logout
 * ************************** */
router.get(
  '/logout',
  utilities.checkLogin,
  utilities.handleErrors(accountController.logout),
);

module.exports = router;
