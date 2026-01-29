const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;

  if (isNaN(classification_id)) {
    req.flash('notice', 'Invalid classification ID.');
    return res.redirect('/');
  }

  const data = await invModel.getInventoryByClassificationId(classification_id);

  if (!data || data.length === 0) {
    req.flash('notice', 'No vehicles found for this classification.');
    return res.redirect('/');
  }

  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;

  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryById(inv_id);

  if (!data || data.length === 0) {
    const err = new Error('Vehicle not found.');
    err.status = 404;
    return next(err);
  }

  const vehicleHTML = await utilities.buildVehicleDetail(data[0]);
  const nav = await utilities.getNav();

  res.render('./inventory/detail', {
    title: `${data[0].inv_make} ${data[0].inv_model}`,
    nav,
    vehicleHTML,
  });
};

/* ***************************
 *  Build Inventory Management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav();
  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    errors: null,
  });
};

/* ***************************
 *  Intentionally throw 500 error
 * ************************** */
invCont.throwError = async function (req, res, next) {
  try {
    throw new Error('Intentional 500 error triggered');
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

/* ***************************
 *  Build Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.buildClassificationList();

  res.render('inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    classificationSelect,
    errors: null,
  });
};

module.exports = invCont;
