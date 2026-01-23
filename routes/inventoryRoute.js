const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');

router.get('/type/:classificationId', invController.buildByClassificationId);
router.get(
  '/detail/:invId',
  utilities.handleErrors(invController.buildByInventoryId),
);
router.get('/error/500', utilities.handleErrors(invController.throwError));

module.exports = router;
