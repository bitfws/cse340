const { body, validationResult } = require('express-validator');
const utilities = require('.');

const validate = {};

/* ******************************
 * Classification validation
 ***************************** */
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

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);

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

/* ******************************
 * Inventory validation rules
 ***************************** */
validate.inventoryRules = () => {
  return [
    body('classification_id')
      .notEmpty()
      .withMessage('You must choose a classification.'),
    body('inv_make').trim().notEmpty().withMessage('Make is required.'),
    body('inv_model').trim().notEmpty().withMessage('Model is required.'),
    body('inv_year')
      .isInt({ min: 1900, max: 2100 })
      .withMessage('Enter a valid year between 1900 and 2100.'),
    body('inv_description')
      .trim()
      .notEmpty()
      .withMessage('Description is required.'),
    body('inv_image').trim().notEmpty().withMessage('Image path is required.'),
    body('inv_thumbnail')
      .trim()
      .notEmpty()
      .withMessage('Thumbnail path is required.'),
    body('inv_price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number.'),
    body('inv_miles')
      .isInt({ min: 0 })
      .withMessage('Miles must be a positive number.'),
    body('inv_color').trim().notEmpty().withMessage('Color is required.'),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id,
    );

    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      classificationSelect,
      errors,
      ...req.body, // Sticky form
    });
    return;
  }
  next();
};

module.exports = validate;
