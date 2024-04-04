const yup = require('yup');

module.exports = {
  checkCreateCategorySchema: yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().min(0).required(),
    }),
  }),
};
