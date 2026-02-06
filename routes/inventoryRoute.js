const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');
const validate = require('../utilities/inventory-validation');

/* *****************************
 * Inventory Routes
 ***************************** */

router.get(
  '/type/:classificationId',
  utilities.handleErrors(invController.buildByClassificationId),
);

router.get(
  '/detail/:invId',
  utilities.handleErrors(invController.buildByInventoryId),
);

router.get('/error/500', utilities.handleErrors(invController.throwError));

router.get(
  '/',
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagementView),
);

/* *****************************
 * Add Classification
 ***************************** */

router.get(
  '/add-classification',
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification),
);

router.post(
  '/add-classification',
  utilities.checkEmployeeOrAdmin,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification),
);

/* *****************************
 * Add Inventory
 ***************************** */

router.get(
  '/add-classification',
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification),
);

router.post(
  '/add-inventory',
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory),
);

router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON),
);

/* *****************************
 * Edit Inventory
 ***************************** */

router.get(
  '/edit/:inv_id',
  utilities.handleErrors(invController.editInventoryView),
);

router.post(
  '/update',
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory),
);

/* *****************************
 * Delete Inventory
 ***************************** */

router.get(
  '/delete/:inv_id',
  utilities.handleErrors(invController.buildDeleteInventory),
);

router.post('/delete', utilities.handleErrors(invController.deleteInventory));

module.exports = router;
