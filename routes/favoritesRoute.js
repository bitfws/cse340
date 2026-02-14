const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const favoritesController = require('../controllers/favoritesController');

/* *******************************
 * Check Client Middleware
 *********************************/
function checkClient(req, res, next) {
  if (
    res.locals.loggedin &&
    res.locals.accountData &&
    res.locals.accountData.account_type &&
    res.locals.accountData.account_type === 'client'
  ) {
    return next();
  }

  req.flash('notice', 'You must be logged in as a client to access favorites.');
  return res.redirect('/account/login');
}

/* *******************************
 * Routes
 *********************************/
router.post(
  '/add',
  checkClient,
  utilities.handleErrors(favoritesController.addFavorite),
);

router.post(
  '/remove',
  checkClient,
  utilities.handleErrors(favoritesController.removeFavorite),
);

router.get(
  '/',
  checkClient,
  utilities.handleErrors(favoritesController.viewFavorite),
);

module.exports = router;
