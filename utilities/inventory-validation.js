const { body, validationResult } = require('express-validator');
const utilities = require('.');

const validate = {};

/* ***********************
 * Classification Validation
 *************************/
validate.classificationRules = () => [
  body('classification_name')
    .trim()
    .isAlphanumeric()
    .notEmpty()
    .withMessage(
      'Classification name cannot contain spaces or special characters.',
    ),
];

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
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

/* ***********************
 * Inventory Validation
 *************************/
validate.inventoryRules = () => [
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

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id,
    );

    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      classificationSelect,
      errors,
      ...req.body,
    });
    return;
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
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

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const classificationSelect =
      await utilities.buildClassificationList(classification_id);
    res.status(400).render('inventory/edit-inventory', {
      title: 'Edit ' + inv_make + ' ' + inv_model,
      classificationSelect,
      errors: errors.array(),
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
    return;
  }

  next();
};

module.exports = validate;
