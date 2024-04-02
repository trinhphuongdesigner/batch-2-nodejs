var express = require('express');
var router = express.Router();

let { validateSchema, checkIdSchema } = require('../../utils');
const { getAllCategory, getDetailCategory, createCategory, putCategory, patchCategory, deleteCategory, getListCategory } = require('./controller');
const { checkCreateCategorySchema } = require('./validation');

router.route('/')
  .get(getAllCategory)
  .post(createCategory)
  // .post(validateSchema(checkCreateCategorySchema), createCategory)

router.route('/list')
  .get(getListCategory)

router.route('/:id')
  .get(getDetailCategory)
  // .get(validateSchema(checkIdSchema), getDetailCategory)
  .put(putCategory)
  // .put(validateSchema(checkIdSchema), putCategory)
  .patch(patchCategory)
  // .patch(validateSchema(checkIdSchema), patchCategory)
  .delete(validateSchema(checkIdSchema), deleteCategory)

module.exports = router;
