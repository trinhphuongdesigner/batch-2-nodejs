var express = require('express');
var router = express.Router();

let { validateSchema, checkIdSchema } = require('../../utils');
const { getAllProduct, getDetailProduct, createProduct, putProduct, patchProduct, deleteProduct, getListProduct } = require('./controller');
const { checkCreateProductSchema, checkUpdateProductSchema } = require('./validation');

router.route('/')
  .get(getAllProduct)
  .post(validateSchema(checkCreateProductSchema), createProduct)

router.route('/list')
  .get(getListProduct)

router.route('/:id')
  .get(getDetailProduct)
  // .put(validateSchema(checkIdSchema), validateSchema(checkCreateProductSchema), putProduct)
  .put(validateSchema(checkUpdateProductSchema), putProduct)
  .delete(validateSchema(checkIdSchema), deleteProduct)

module.exports = router;
