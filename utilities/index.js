const jwt = require('jsonwebtoken');
require('dotenv').config();
const invModel = require('../models/inventory-model');

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });
  list += '</ul>';
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  if (!data || data.length === 0)
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';

  let grid = '<ul id="inv-display">';
  data.forEach((vehicle) => {
    grid += `
      <li>
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </div>
      </li>
    `;
  });
  grid += '</ul>';
  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ******************************
 * Build HTML for a single vehicle detail
 ******************************* */
Util.buildVehicleDetail = async function (vehicle) {
  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>
      <div class="vehicle-info">
        <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Classification:</strong> ${vehicle.classification_name}</p>
      </div>
    </div>
  `;
};

/* ******************************
 * Build a dynamic classification select list for inventory form
 ******************************* */
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications();
  let list = '<select name="classification_id" required>';
  list += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"${classification_id == row.classification_id ? ' selected' : ''}>${row.classification_name}</option>`;
  });
  list += '</select>';
  return list;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, accountData) => {
        if (err) {
          res.locals.loggedin = false;
          res.locals.accountData = null;
          return next();
        }

        // Asignamos primero el objeto
        res.locals.accountData = accountData;

        // Convertimos account_type a minúsculas
        if (res.locals.accountData.account_type) {
          res.locals.accountData.account_type =
            res.locals.accountData.account_type.toLowerCase();
        }

        res.locals.loggedin = true;
        next();
      },
    );
  } else {
    res.locals.loggedin = false;
    res.locals.accountData = null;
    next();
  }
};

/* ****************************************
 *  Check Login
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash('notice', 'Please log in.');
    return res.redirect('/account/login');
  }
};

Util.checkEmployeeOrAdmin = (req, res, next) => {
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === 'Employee' ||
      res.locals.accountData.account_type === 'Admin')
  ) {
    return next();
  }

  req.flash('notice', 'You must be logged in as an employee or admin.');
  return res.redirect('/account/login');
};

/* ****************************************
 * Build HTML for a user's favorite vehicles
 **************************************** */
Util.buildFavoritesGrid = async function (data) {
  if (!data || data.length === 0)
    return '<p class="notice">You have no favorite vehicles yet.</p>';

  let grid = '<ul class="inventory-display">';
  data.forEach((vehicle) => {
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </a>
      </li>
    `;
  });
  grid += '</ul>';
  return grid;
};

module.exports = Util;
