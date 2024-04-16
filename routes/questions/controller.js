
const { getQueryDateTime } = require('../../utils');
const {
  Product,
  Category,
  Supplier,
  Customer,
  Order,
} = require('../../models');

module.exports = {
  question1: async (req, res, next) => {
    try {
      const conditionFind = {
        discount: { $lte: 10 },
      };

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question1a: async (req, res, next) => {
    try {
      const { discount } = req.query;
      const conditionFind = {};

      if (discount) conditionFind.discount = { $lte: discount };

      let results = await Product.find(conditionFind).populate("cc").populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question1b: async (req, res, next) => {
    try {
      const { discount, type } = req.query;
      const conditionFind = {};

      if (discount) {
        switch (+type) {
        // switch (Number(type)) {
          // case 0:
          //   conditionFind.discount = { $eq: discount };
          //   break;

          case 1:
            conditionFind.discount = { $lt: discount };
            break;

          case 2:
            conditionFind.discount = { $lte: discount };
            break;

          case 3:
            conditionFind.discount = { $gt: discount };
            break;

          case 4:
            conditionFind.discount = { $gte: discount };
            break;

          default:
            conditionFind.discount = { $eq: discount };
            break;
        }
      }

      let results = await Product.find(conditionFind).populate("category").populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: { $lte: 100 },
      };

      console.log('««««« conditionFind »»»»»', conditionFind);

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

};
