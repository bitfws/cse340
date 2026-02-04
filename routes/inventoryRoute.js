const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');
const validate = require('../utilities/inventory-validation');

/* *****************************
 * Inventory Routes
 ***************************** */

// Inventory by classification
router.get(
  '/type/:classificationId',
  utilities.handleErrors(invController.buildByClassificationId),
);

// Inventory detail
router.get(
  '/detail/:invId',
  utilities.handleErrors(invController.buildByInventoryId),
);

// Trigger intentional 500 error
router.get('/error/500', utilities.handleErrors(invController.throwError));

// Inventory management view
router.get('/', utilities.handleErrors(invController.buildManagement));

/* *****************************
 * Add Classification
 ***************************** */

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

/* *****************************
 * Add Inventory
 ***************************** */

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

// Get inventory JSON by classification
router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON),
);

/* *****************************
 * Edit Inventory
 ***************************** */

// Show edit inventory form
router.get(
  '/edit/:inv_id',
  utilities.handleErrors(invController.editInventoryView),
);

// Update inventory data
router.post(
  '/update',
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory),
);

/* *****************************
 * Delete Inventory
 ***************************** */

// Show delete confirmation page
router.get(
  '/delete/:inv_id',
  utilities.handleErrors(invController.buildDeleteInventory),
);

// Process delete inventory
router.post('/delete', utilities.handleErrors(invController.deleteInventory));

module.exports = router;
