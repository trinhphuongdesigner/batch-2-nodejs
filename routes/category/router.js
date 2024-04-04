var express = require('express');
var router = express.Router();

let { validateSchema, checkIdSchema } = require('../../utils');
const { getAllCategory, getDetailCategory, createCategory, putCategory, deleteCategory, getListCategory } = require('./controller');
const { checkCreateCategorySchema } = require('./validation');

router.route('/')
  .get(getAllCategory)
  .post(validateSchema(checkCreateCategorySchema), createCategory)

router.route('/list')
  .get(getListCategory)

router.route('/:id')
  .get(getDetailCategory)
  // .get(validateSchema(checkIdSchema), getDetailCategory)
  .put(putCategory)
  // .put(validateSchema(checkIdSchema), putCategory)
  .delete(validateSchema(checkIdSchema), deleteCategory)

module.exports = router;
