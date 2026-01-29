const invModel = require('../models/inventory-model');
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = '';
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_image +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
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
  let data = await invModel.getClassifications();
  let list = '<select name="classification_id" required>';
  list += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"`;
    if (classification_id == row.classification_id) {
      list += ' selected';
    }
    list += `>${row.classification_name}</option>`;
  });
  list += '</select>';
  return list;
};

module.exports = Util;
