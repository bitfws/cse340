const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const validate = require('../utilities/inventory-validation');

/* ***************
 * Inventory Routes
 *****************/

// Inventory by classification
router.get('/type/:classificationId', invController.buildByClassificationId);

// Inventory detail
router.get(
  '/detail/:invId',
  utilities.handleErrors(invController.buildByInventoryId),
);

// Trigger 500 error
router.get('/error/500', utilities.handleErrors(invController.throwError));

// Login view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Inventory management view
router.get('/', utilities.handleErrors(invController.buildManagement));

/* ***************
 * Add Classification
 *****************/
// Show add classification form
router.get(
  '/add-classification',
  utilities.handleErrors(invController.buildAddClassification),
);

// Process add classification
router.post(
  '/add-classification',
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification),
);

/* ***************
 * Add Inventory
 *****************/
// Show add inventory form
router.get(
  '/add-inventory',
  utilities.handleErrors(invController.buildAddInventory),
);

// Process add inventory
router.post(
  '/add-inventory',
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory),
);

module.exports = router;
