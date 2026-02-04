const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = parseInt(req.params.classificationId);
  if (isNaN(classification_id)) {
    const err = new Error('Invalid classification ID.');
    err.status = 404;
    return next(err);
  }

  const data = await invModel.getInventoryByClassificationId(classification_id);

  if (!data || data.length === 0) {
    const err = new Error('No vehicles found for this classification.');
    err.status = 404;
    return next(err);
  }

  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();
  const className = data[0].classification_name;

  res.render('./inventory/classification', {
    title: `${className} vehicles`,
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId);
  if (isNaN(inv_id)) {
    const err = new Error('Invalid inventory ID.');
    err.status = 404;
    return next(err);
  }

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
  const nav = await utilities.getNav();
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
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render('inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    classificationSelect,
    errors: null,
    inv_make: '',
    inv_model: '',
    inv_year: '',
    inv_description: '',
    inv_image: '',
    inv_thumbnail: '',
    inv_price: '',
    inv_miles: '',
    inv_color: '',
    classification_id: '',
  });
};

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render('inventory/add-classification', {
    title: 'Add Classification',
    nav,
    errors: null,
    classification_name: '',
  });
};

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash(
        'notice',
        `New classification "${classification_name}" added successfully.`,
      );
      return res.redirect('/inv');
    } else {
      req.flash('notice', 'Failed to add classification.');
      res.render('inventory/add-classification', {
        title: 'Add Classification',
        nav,
        errors: null,
        classification_name,
      });
    }
  } catch (error) {
    req.flash('notice', 'Error adding classification.');
    res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      errors: null,
      classification_name,
    });
  }
};

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const nav = await utilities.getNav();
  const classificationSelect =
    await utilities.buildClassificationList(classification_id);

  try {
    const result = await invModel.addInventoryItem(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    );

    if (result) {
      req.flash(
        'notice',
        `Vehicle "${inv_make} ${inv_model}" added successfully.`,
      );
      return res.redirect('/inv');
    } else {
      req.flash('notice', 'Failed to add vehicle.');
      res.render('inventory/add-inventory', {
        title: 'Add Inventory',
        nav,
        classificationSelect,
        errors: null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      });
    }
  } catch (error) {
    req.flash('notice', 'Error adding vehicle.');
    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      classificationSelect,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build Management View
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render('./inventory/management', {
    title: 'Inventory Management',
    nav,
    classificationSelect,
  });
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  if (isNaN(classification_id)) {
    return next(new Error('Invalid classification ID'));
  }

  const invData =
    await invModel.getInventoryByClassificationId(classification_id);

  if (invData && invData.length > 0) {
    return res.json(invData);
  } else {
    next(new Error('No data returned'));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  if (isNaN(inv_id)) {
    const err = new Error('Invalid inventory ID.');
    err.status = 400;
    return next(err);
  }

  const nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  if (!itemData || itemData.length === 0) {
    const err = new Error('Vehicle not found.');
    err.status = 404;
    return next(err);
  }

  const vehicle = itemData[0];
  const classificationSelect = await utilities.buildClassificationList(
    vehicle.classification_id,
  );
  const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`;

  res.render('./inventory/edit-inventory', {
    title: 'Edit ' + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: vehicle.inv_id,
    inv_make: vehicle.inv_make,
    inv_model: vehicle.inv_model,
    inv_year: vehicle.inv_year,
    inv_description: vehicle.inv_description,
    inv_image: vehicle.inv_image,
    inv_thumbnail: vehicle.inv_thumbnail,
    inv_price: vehicle.inv_price,
    inv_miles: vehicle.inv_miles,
    inv_color: vehicle.inv_color,
    classification_id: vehicle.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  );

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
    req.flash('notice', `The ${itemName} was successfully updated.`);
    res.redirect('/inv/');
  } else {
    const classificationSelect =
      await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the update failed.');
    res.status(501).render('inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Show delete confirmation page
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  if (isNaN(inv_id)) {
    const err = new Error('Invalid inventory ID.');
    err.status = 400;
    return next(err);
  }

  const vehicleData = await invModel.getInventoryById(inv_id);
  if (!vehicleData || vehicleData.length === 0) {
    const err = new Error('Vehicle not found.');
    err.status = 404;
    return next(err);
  }

  const nav = await utilities.getNav();

  res.render('inventory/delete-confirm', {
    title: `Delete ${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`,
    nav,
    vehicle: vehicleData[0],
  });
};

/* ***************************
 *  Delete inventory item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  if (isNaN(inv_id)) {
    req.flash('notice', 'Invalid inventory ID.');
    return res.redirect('/inv');
  }

  try {
    const result = await invModel.deleteInventoryById(inv_id);
    if (result) {
      req.flash('notice', 'Vehicle deleted successfully.');
      res.redirect('/inv');
    } else {
      req.flash('notice', 'Delete failed. Vehicle may not exist.');
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    console.error('deleteInventory error:', error);
    req.flash('notice', 'Error deleting vehicle.');
    res.redirect(`/inv/delete/${inv_id}`);
  }
};

module.exports = invCont;
