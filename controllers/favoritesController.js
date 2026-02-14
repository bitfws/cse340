const favoritesModel = require('../models/favorites-model');
const utilities = require('../utilities');

const favoritesController = {};

/* ************************************
 * Add a vehicle to favorites
 **************************************/
favoritesController.addFavorite = async (req, res, next) => {
  try {
    const account = res.locals.accountData;

    if (!account) {
      req.flash('notice', 'Please log in to save favorites.');
      return res.redirect('/account/login');
    }

    if (account.account_type) {
      account.account_type =
        account.account_type.charAt(0).toUpperCase() +
        account.account_type.slice(1).toLowerCase();
    }

    const inv_id = req.body.inv_id;
    await favoritesModel.addFavorite(account.account_id, inv_id);

    req.flash('notice', 'Vehicle added to your favorites.');
    res.redirect('back');
  } catch (error) {
    next(error);
  }
};

/* ************************************
 * Remove a vehicle from favorites
 **************************************/
favoritesController.removeFavorite = async (req, res, next) => {
  try {
    const account = res.locals.accountData;

    if (!account) {
      req.flash('notice', 'Please log in.');
      return res.redirect('/account/login');
    }

    if (account.account_type) {
      account.account_type =
        account.account_type.charAt(0).toUpperCase() +
        account.account_type.slice(1).toLowerCase();
    }

    const inv_id = req.body.inv_id;
    await favoritesModel.removeFavorite(account.account_id, inv_id);

    req.flash('notice', 'Vehicle removed from your favorites.');
    res.redirect('back');
  } catch (error) {
    next(error);
  }
};

/* ************************************
 * View all favorites for a client
 **************************************/
favoritesController.viewFavorite = async (req, res, next) => {
  try {
    const account = res.locals.accountData;

    if (!account) {
      req.flash('notice', 'Please log in.');
      return res.redirect('/account/login');
    }

    if (account.account_type) {
      account.account_type =
        account.account_type.charAt(0).toUpperCase() +
        account.account_type.slice(1).toLowerCase();
    }

    const vehicles = await favoritesModel.getUserFavorites(account.account_id);
    const grid = await utilities.buildClassificationGrid(vehicles);

    const nav = await utilities.getNav();

    res.render('account/favorites', {
      title: 'My Favorites',
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = favoritesController;
