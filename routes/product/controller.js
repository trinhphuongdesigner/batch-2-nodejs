// let data = require('../../data/products.json');
const { default: mongoose } = require('mongoose');
const { Product } = require('../../models');

mongoose.connect('mongodb://localhost:27017/node-02-database');
// mongoose.connect('mongodb://127.0.0.1:27017/training-database');

const { sendErr, generationID, writeFileSync } = require('../../utils');

module.exports = {
  getAllProduct: async (req, res, next) => {
    try {
      let results = await Product.find();

      return res.send(
        202,
        {
          message: "Lấy danh sách sản phẩm thành công",
          payload: results,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(400, { message: "Không thành công" });
    }
  },

  getListProduct: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query; // 10 - 1
      const limit = pageSize || 10; // 10
      const skip = limit * (page - 1) || 0;

      const conditionFind = { isDeleted: false };

      let results = await Product.find(conditionFind)
        .populate('category')
        .populate('supplier')
        .skip(skip)
        .limit(limit)
        .sort({ "name": 1, "price": 1, "discount": -1 })
        .lean();

      const total = await Product.countDocuments(conditionFind)

      return res.send({ code: 200, total, count: results.length, payload: results });
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(400, { message: "Không thành công" });
    }
  },

  getDetailProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Product.findById(id); // => return object


      if (!result) {
        return res.send(
          404,
          {
            message: "Không tìm thấy",
          },
        );
      }

      return res.send(
        202,
        {
          message: "Lấy thông tin thành công",
          payload: result,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  createProduct: async (req, res, next) => {
    try {
      const { name, price, discount } = req.body;

      const newItem = new Product({ name, price, discount });

      const result = await newItem.save();

      return res.send(
        202,
        {
          message: "Tạo sản phẩm thành công",
          payload: result,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      sendErr(res);
    }
  },

  putProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Product.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        },
      )

      if (!result) {
        return res.send(
          404,
          {
            message: "Sản phẩm không tồn tại",
          },
        );
      }

      return res.send(
        202,
        {
          message: "Cập nhật sản phẩm thành công",
          payload: result,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Product.findByIdAndDelete(id)

      if (!result) {
        return res.send(
          404,
          {
            message: "Sản phẩm không tồn tại",
          },
        );
      }

      return res.send(
        202,
        {
          message: "Xóa sản phẩm thành công",
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    };
  },
}