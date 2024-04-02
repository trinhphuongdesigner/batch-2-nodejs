const yup = require('yup');

module.exports = {
  checkCreateProductSchema: yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().min(0).required(),
      // address: yup.object({
      //   location: yup.string(),
      //   ward: yup.string(),
      //   district: yup.string(),
      //   province: yup.string(),
      // }),
    }),
  }),

  checkUpdateProductSchema: yup.object({
    params: yup.object({
      id: yup.number().min(0),
    }),
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().min(0).required(),
    }),
  }),
};
