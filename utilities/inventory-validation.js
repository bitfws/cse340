// /utilities/inventory-validation.js

const { body, validationResult } = require('express-validator');
const utilities = require('.');

const validate = {};

/* **********************************
 *  Classification Data Validation Rules
 ********************************* */
validate.classificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .isAlphanumeric()
      .notEmpty()
      .withMessage(
        'Classification name cannot contain spaces or special characters.',
      ),
  ];
};

/* ******************************
 * Check classification data
 ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      errors,
      classification_name,
    });
    return;
  }
  next();
};

module.exports = validate;
