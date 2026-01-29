const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');

/* ***************
 * Inventory Routes
 *****************/
router.get('/type/:classificationId', invController.buildByClassificationId);
router.get(
  '/detail/:invId',
  utilities.handleErrors(invController.buildByInventoryId),
);
router.get('/error/500', utilities.handleErrors(invController.throwError));
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/', utilities.handleErrors(invController.buildManagement));

module.exports = router;
