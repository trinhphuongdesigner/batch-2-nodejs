let data = require('../../data/products.json');
const { sendErr, generationID, writeFileSync } = require('../../utils');

module.exports = {
  getAllProduct: (req, res, next) => {
    try {
      return res.send(data);
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(400, { message: "Không thành công" });
    }
  },

  getListProduct: (req, res, next) => {
    try {
      const { limit } = req.query;

      const newList = data.filter((item, index) => {
        if (index < limit) return item;
      });

      return res.send(
        202,
        {
          message: "Lấy danh sách thành công",
          payload: newList,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(400, { message: "Không thành công" });
    }
  },

  getDetailProduct: (req, res, next) => {
    try {
      const { id } = req.params;
  
      const detail = data.find((item) => item.id.toString() == id);
  
      if (!detail) {
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
          payload: detail,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  createProduct: (req, res, next) => {
    try {
      // req: {
      //   query,
      //   params,
      //   body,
      // }
      const { name, price, description } = req.body;
  
      const newProduct = { id: generationID(), name, price, description };
  
      data = [...data, newProduct];

      writeFileSync("data/products.json", data);
  
      return res.send(
        202,
        {
          message: "Tạo sản phẩm thành công",
          payload: newP,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      sendErr(res);
    }
  },

  putProduct: (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, price } = req.body;
  
      const updateData = {
        id: +id,
        name,
        price,
      };

      // Kiểm tra ID có tồn tại không?
      const findObject = data.find(item => item.id === +id)

      if (!findObject) {
        return res.send(
          404,
          {
            message: "Sản phẩm không tồn tại",
          },
        );
      }

      // const isValidId = false;
  
      data = data.map((item) => {
        if (item.id === +id) {
          // isValidId = true;
          return updateData;
        }
  
        return item;
      })

      // if(!isValidId) {
      //   return res.send(
      //     404,
      //     {
      //       message: "Sản phẩm không tồn tại",
      //     },
      //   );
      // }
  
      writeFileSync("data/products.json", data);
  
      return res.send(
        202,
        {
          message: "Cập nhật sản phẩm thành công",
          payload: updateData,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  patchProduct: (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, price } = req.body;
      let updateData = {};
  
      data = data.map((item) => {
        if (item.id === +id) {
          updateData = {
            ...item,
            name: name || item.name,
            price: price || item.price,
          };
  
          return updateData;
        }
  
        return item;
      });
  
      writeFileSync("data/products.json", data);
  
      if (updateData) {
        return res.send(
          202,
          {
            message: "Cập nhật sản phẩm thành công",
            payload: updateData,
          },
        );
      }
  
      return sendErr(res);
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  deleteProduct: (req, res, next) => {
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
  
      writeFileSync("data/products.json", data);
  
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