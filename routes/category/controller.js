let data = require('../../data/categories.json');
const { sendErr, generationID, writeFileSync } = require('../../utils');
const { Category } = require('../../models');
// const Category = require("../../models/category")
// const Product = require("../../models/product")

module.exports = {
  getAllCategory: async (req, res, next) => {
    try {
      const result = await Category.find({});

      return res.send({
        statusCode: 201,
        message: 'Get all category successfully',
        payload: result
      });
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(400, { message: "Không thành công" });
    }
  },

  getListCategory: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query; // 10 - 1
      const limit = pageSize || 10; // 10
      const skip = limit * (page - 1) || 0;

      const conditionFind = { };

      let results = await Category.find(conditionFind)
        .skip(skip)
        .limit(limit)
        .sort({ "name": 1 })
        .lean();

      const total = await Category.countDocuments(conditionFind)

      return res.send({ code: 200, total, count: results.length, payload: results });
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(400, { message: "Không thành công" });
    }
  },

  getDetailCategory: async (req, res, next) => {
    try {
      const { id } = req.params;

      // const result = await  Category.find({ _id: id }); => return arr
      // const result = await  Category.findOne({ _id: id }); => return object
      const result = await Category.findById(id); // => return object

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

  createCategory: async (req, res, next) => {
    try {
      const { name, description } = req.body;
  
      const newCategory = new Category({ name, description });
  
      const result = await newCategory.save();
  
      return res.send(
        202,
        {
          message: "Tạo danh mục thành công",
          payload: result,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      sendErr(res);
    }
  },

  putCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const result = await Category.findByIdAndUpdate(
        id,
        { name, description},
        {
          new: true,
        },
      )

      return res.send(
        202,
        {
          message: "Cập nhật danh mục thành công",
          payload: result,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  deleteCategory: (req, res, next) => {
    try {
      const { id } = req.params;

      const findObject = data.find(item => item.id === +id)

      if (!findObject || findObject.isDeleted) {
        return res.send(
          404,
          {
            message: "Sản phẩm không tồn tại",
          },
        );
      }
  
      data = data.filter((item) => item.id !== +id)
  
      writeFileSync("data/categories.json", data);
  
      return res.send(
        202,
        {
          message: "Xóa danh mục thành công",
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    };
  },
}