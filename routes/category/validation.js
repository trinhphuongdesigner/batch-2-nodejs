const yup = require('yup');

module.exports = {
  checkCreateCategorySchema: yup.object({
    body: yup.object({
      name: yup.string().required().max(50, 'Tên danh mục không được vượt quá 50 ký tự'),
      description: yup.string().max(500),
    }),
  }),
};
