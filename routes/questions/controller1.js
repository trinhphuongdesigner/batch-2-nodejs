
const { getQueryDateTime, fuzzySearch } = require('../../utils');
const {
  Product,
  Category,
  Supplier,
  Customer,
  Employee,
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

      // FIX: trước đây populate("cc") -> sai tên virtual, mongoose 8 sẽ ném StrictPopulateError.
      // Tên virtual đúng khai báo trong models/Product.js là "category" và "supplier".
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

      console.log('««««« conditionFind »»»»»', conditionFind);

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
      // Đề (file excel - dòng 2): "Hiển thị tất cả các mặt hàng có tồn kho <= 5"
      const conditionFind = {
        stock: { $lte: 5 },
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

  question2a: async (req, res, next) => {
    try {
      const { stock } = req.query;
      const conditionFind = {};

      if (stock) conditionFind.stock = { $lte: stock };

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

  question2b: async (req, res, next) => {
    try {
      const { stock, type } = req.query;
      const conditionFind = {};

      if (stock) {
        switch (Number(type)) {
          case 0:
            conditionFind.stock = { $eq: stock };
            break;

          case 1:
            conditionFind.stock = { $lt: stock };
            break;

          case 2:
            conditionFind.stock = { $lte: stock };
            break;

          case 3:
            conditionFind.stock = { $gt: stock };
            break;

          case 4:
            conditionFind.stock = { $gte: stock };
            break;

          default:
            conditionFind.stock = { $eq: stock };
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

  // Hiển thị tất cả các mặt hàng có Giá bán sau khi đã tính giảm giá <= 1000
  question3: async (req, res, next) => {
    try {
      // let discountedPrice = (price * (100 - discount)) / 100;'
      // const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90
      // const m = { $multiply: ['$price', s] }; // price * 90
      // const d = { $divide: [m, 100] }; // price * 90 / 100
      // d = discountedPrice;

      // gia sau khi giam = (price / 100) x (100 - discount)
      const discounted = { $multiply: [{ $divide: ['$price', 100] }, { $subtract: [100, '$discount'] }] }

      // gias sau khi giam | gia do nguoi dung truyen len de so sanh
      // price: { $lte: 1000 } = { $lte: ['$price', 1000]} // So sánh price với discountedPrice sao cho price <= discountedPrice


      const conditionFind = { $expr: { $lte: [discounted, 1000] } };
      // const conditionFind = { discounted: { $lte: +discountedPrice} }; SAI
      console.log('««««« conditionFind »»»»»', conditionFind);

      // const conditionFind = { $expr: { $lte: [{ $divide: [{ $multiply: ['$price', { $subtract: [100, '$discount'] }] }, 100] }, 1000] } };
      // const conditionFind = { discount : { $lte: 1000 }}; SAI

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier")
      // .select('disPrice name')
      // .select('-categoryId -supplierId -description')
      // .lean(); // convert data to object

      // const newResults = results.map((item) => {
      //   const dis = item.price * (100 - item.discount) / 100;
      //   return {
      //     ...item,
      //     dis,
      //   }
      // }).filter((item) => item.dis <= 1000);

      // console.log('««««« newResults »»»»»', newResults);

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

  // Hiển thị tất cả các mặt hàng có Giá bán sau khi đã tính giảm giá <= X
  question3a: async (req, res, next) => {
    try {
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90

      const m = { $multiply: ['$price', s] }; // price * 90

      const d = { $divide: [m, 100] }; // price * 90 / 100

      const { discountedPrice } = req.query;

      let conditionFind = {};

      if (discountedPrice) {
        conditionFind = { $expr: { $lte: [d, parseFloat(discountedPrice)] } };
      }

      let results = await Product.find(conditionFind).lean(); // convert data to object

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

  // Hiển thị tất cả các mặt hàng có Giá bán sau khi đã tính giảm giá <= 1000, Sử dụng aggregate
  question3c: async (req, res, next) => {
    try {
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90
      const m = { $multiply: ['$price', s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100 => Giá sau khi tính giảm giá

      // let results = await Product.find({
      //   $expr: { $lte: [d, 100]}
      // })

      // let results = await Product.aggregate([
      //   {
      //     $match: { $expr: { $lte: [d, 100] } },
      //   },
      // ]);

      let results = await Product.aggregate()
        .match({ $expr: { $lte: [d, 1000] } });

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

  // Hiển thị tất cả các mặt hàng có Giá bán sau khi đã tính giảm giá <= 1000, Sử dụng aggregate và thêm trường mới và lựa chọn field dữ liệu trả về
  question3d: async (req, res, next) => {
    try {
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90
      const m = { $multiply: ['$price', s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   { $addFields: { disPrice: d } },
      //   {
      //     $match: { $expr: { $lte: ['$disPrice', 1000] } },
      //   },
      //   {
      //     $project: {
      //       categoryId: 0,
      //       supplierId: 0,
      //       description: 0,
      //     },
      //   },
      // ]);

      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        // FIX: đề là "<= 1000" (không phải 100)
        .match({ $expr: { $lte: ['$disPrice', 1000] } })
        .project({
          categoryId: 0,
          supplierId: 0,
          description: 0,
          isDeleted: 0,
          price: 0,
          discount: 0,
        });

      // let results = await Product.aggregate()
      // .match({ $expr: { $lte: [d, 100] } })
      // // .addFields({ disPrice: d })
      //   .project({
      //     categoryId: 0,
      //     supplierId: 0,
      //     description: 0,
      //     isDeleted: 0,
      //     price: 0,
      //     discount: 0,
      //   });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  // Hiển thị tất cả các mặt hàng có Giá bán sau khi đã tính giảm giá <= 1000, Sử dụng aggregate và thêm trường mới và lựa chọn field dữ liệu trả về và thông tin danh mục, nhà cung cấp
  question3e: async (req, res, next) => {
    try {
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90
      const m = { $multiply: ['$price', s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   { $addFields: { disPrice: d } },
      //   {
      //     $match: { $expr: { $lte: ['$disPrice', 1000] } },
      //   },
      //   {
      //     $project: {
      //       categoryId: 0,
      //       supplierId: 0,
      //       description: 0,
      //     },
      //   },
      // ]);

      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        // FIX: đề là "<= 1000" (không phải 100)
        .match({ $expr: { $lte: ['$disPrice', 1000] } })
        .lookup({
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categories',
        })
        .unwind('categories')
        .lookup({
          from: 'suppliers',
          localField: 'supplierId',
          foreignField: '_id',
          as: 'suppliers',
        })
        .unwind('suppliers')
        .project({
          disPrice: 1,
          categories: {
            name: 1
          },
          suppliers: {
            name: 1
          },
        })
        .project({
          disPrice: 1,
          category: "$categories.name",
          supplier: "$suppliers.name",
        })
      // .project({
      //   categoryId: 0,
      //   supplierId: 0,
      //   description: 0,
      //   isDeleted: 0,
      //   suppliers: {
      //     isDeleted: 0,
      //     createdAt: 0,
      //     updatedAt: 0,
      //   },
      //   categories: {
      //     isDeleted: 0,
      //     createdAt: 0,
      //     updatedAt: 0,
      //   },
      // });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question4: async (req, res, next) => {
    try {
      const { address } = req.query;

      const conditionFind = {
        address: fuzzySearch(address),
      };
      // const conditionFind = { address: new RegExp(`${address}`, 'gi') };
      // const conditionFind = { address: {$eq: address } };

      console.log('««««« conditionFind »»»»»', conditionFind);

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question4a: async (req, res, next) => {
    try {
      const { address } = req.query;

      // const conditionFind = { address: { $regex: new RegExp(`${address}`), $options: 'i' } };
      // const conditionFind = { address: new RegExp(`${address}`) };
      // const conditionFind = { address: {$eq: address } };

      let results = await Customer.aggregate().match({
        address: { $regex: new RegExp(`${address}`), $options: 'i' },
      });

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question5: async (req, res, next) => {
    try {
      // FIX: req.query.year là chuỗi ("1990"), còn { $year: ... } trả về Number.
      // Nếu không ép kiểu thì $eq luôn false. Phải Number(year).
      const year = Number(req.query.year);
      const namSinhTrongDB = { $year: '$birthday' }

      const conditionFind = {
        $expr: {
          $eq: [namSinhTrongDB, year],
        },
      };

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question5a: async (req, res, next) => {
    try {
      const year = Number(req.query.year);

      // FIX: '$birthYear' phải là chuỗi tham chiếu field, không phải biến JS `birthYear`
      // (code cũ ném ReferenceError: birthYear is not defined).
      let results = await Customer.aggregate()
        .addFields({
          birthYear: { $year: '$birthday' },
        })
        // Sau khi đã addFields thì so khớp trực tiếp, không cần $expr:
        .match({ birthYear: year })
        // Cách khác (tương đương):
        // .match({ $expr: { $eq: ['$birthYear', year] } })

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question6: async (req, res, next) => {
    try {
      const { date } = req.query;
      let today;

      if (!date) {
        today = new Date();
      } else {
        today = new Date(date);
      }

      // const conditionFind = {
      //   $and: [
      //     {
      //       $expr: { $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }], }
      //     },
      //     {
      //       $expr: { $eq: [{ $month: '$birthday' }, { $month: today }] },
      //     }
      //   ],
      // };

      const conditionFind = {
        $expr: {
          $and: [
            {
              $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }],
            },
            { $eq: [{ $month: '$birthday' }, { $month: today }] },
          ],
        },
      };

      // const eqDay = {
      //   $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }],
      // };
      // const eqMonth = { $eq: [{ $month: '$birthday' }, { $month: today }] };

      // const conditionFind = {
      //   $expr: {
      //     $and: [eqDay, eqMonth],
      //   },
      // };

      console.log('««««« conditionFind »»»»»', conditionFind);

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question7: async (req, res, next) => {
    try {
      const { status } = req.query;

      let results = await Order.find({ status }) // ~ match
        .populate({ path: 'customer', select: 'firstName lastName' }) // select để chọn lọc dữ liệu trả về
        // .populate('customer')
        .populate('employee')
        // .populate('productList.product') ~
        .populate({
          path: 'productList.product', // virtual name
          select: { name: 1, stock: 1 },
        })
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question7a: async (req, res, next) => {
    try {
      const { status } = req.query;

      let results = await Order.aggregate()
        .match({ status }) // ~ find
        .lookup({
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer',
        })
        .unwind('customer')
        .lookup({
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee',
        })
        .unwind('employee')
        .lookup({
          from: 'products',
          localField: 'productList.productId',
          foreignField: '_id',
          as: 'products',
        })
        .project({
          products: {
            name: 1,
          },
          customer: {
            firstName: 1,
            lastName: 1,
          },
          employee: {
            firstName: 1,
            lastName: 1,
          },
        })

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question8a: async (req, res, next) => {
    try {
      let { status, date } = req.query;
      const findDate = date ? new Date(date) : new Date();

      const conditionFind = {
        $expr: {
          $and: [
            // FIX: trong $expr/$and phải là biểu thức boolean.
            // `{ status }` là 1 object -> luôn "truthy" -> KHÔNG lọc gì cả.
            { $eq: ['$status', status] },
            { $eq: [{ $dayOfMonth: '$shippedDate' }, { $dayOfMonth: findDate }] },
            { $eq: [{ $month: '$shippedDate' }, { $month: findDate }] },
            { $eq: [{ $year: '$shippedDate' }, { $year: findDate }] },
          ],
        },
      };

      let results = await Order.find(conditionFind).lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question8b: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      const tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ['$status', status] };
      const compareFromDate = { $gte: ['$createdAt', fromDate] };
      const compareToDate = { $lt: ['$createdAt', toDate] };

      const conditionFind = {
        $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
      };

      let results = await Order.find(conditionFind)
        .populate('productList.product')
        .populate('customer')
        .populate('employee')
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question8c: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      const tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ['$status', status] };
      const compareFromDate = { $lt: ['$shippedDate', fromDate] };
      const compareToDate = { $gt: ['$shippedDate', toDate] };

      const conditionFind = {
        $expr: {
          $or: [
            {
              $and: [compareStatus, compareFromDate],
            },
            {
              $and: [compareStatus, compareToDate]
            },
          ]
        },
      };

      let results = await Order.find(conditionFind)
        .populate('productList.product')
        .populate('customer')
        .populate('employee')
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question8d: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      const tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ['$status', status] };
      const compareFromDate = { $gte: ['$shippedDate', fromDate] };
      const compareToDate = { $lte: ['$shippedDate', toDate] };
      // const compareFromDate = { $lt: ['$shippedDate', fromDate] };
      // const compareToDate = { $gt: ['$shippedDate', toDate] };

      const conditionFind = {
        $expr: {
          $and: [
            compareStatus,
            { $not: { $and: [compareFromDate, compareToDate] } }
          ]
        },
      };

      let results = await Order.find(conditionFind)
        .populate('productList.product')
        .populate('customer')
        .populate('employee')
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  // ===========================================================================
  // Câu 9: Hiển thị tất cả các đơn hàng có trạng thái là CANCELED
  // (giống câu 7 nhưng cố định status = CANCELED, vẫn cho phép truyền ?status=)
  // ===========================================================================
  question9: async (req, res, next) => {
    try {
      const status = req.query.status || 'CANCELED';

      // ----- CÁCH 1: find + populate (chọn lọc field trả về bằng select) -----
      let results = await Order.find({ status })
        .populate({ path: 'customer', select: 'firstName lastName' })
        .populate({ path: 'employee', select: 'firstName lastName' })
        .populate({ path: 'productList.product', select: { name: 1, price: 1 } })
        .lean();

      // ----- CÁCH 2: aggregate -----
      // let results = await Order.aggregate().match({ status });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  // ===========================================================================
  // Câu 10: Hiển thị tất cả các đơn hàng có trạng thái là CANCELED trong ngày hôm nay
  // ?date=YYYY-MM-DD (không truyền -> lấy hôm nay), ?status= (mặc định CANCELED)
  // ===========================================================================
  question10: async (req, res, next) => {
    try {
      const status = req.query.status || 'CANCELED';
      const findDate = req.query.date ? new Date(req.query.date) : new Date();

      // ----- CÁCH 1: find + $expr, so khớp ngày/tháng/năm của createdDate -----
      const conditionFind = {
        $expr: {
          $and: [
            { $eq: ['$status', status] },
            { $eq: [{ $dayOfMonth: '$createdDate' }, { $dayOfMonth: findDate }] },
            { $eq: [{ $month: '$createdDate' }, { $month: findDate }] },
            { $eq: [{ $year: '$createdDate' }, { $year: findDate }] },
          ],
        },
      };

      let results = await Order.find(conditionFind).lean();

      // ----- CÁCH 2: aggregate, lọc theo khoảng [đầu ngày, đầu ngày hôm sau) -----
      // const start = new Date(findDate); start.setHours(0, 0, 0, 0);
      // const end = new Date(start); end.setDate(end.getDate() + 1);
      // let results = await Order.aggregate().match({
      //   status,
      //   createdDate: { $gte: start, $lt: end },
      // });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  // ===========================================================================
  // Câu 11: Hiển thị tất cả các đơn hàng có hình thức thanh toán là CASH
  // Câu 12: ... là CREDIT_CARD  (dùng chung 1 handler, phân biệt bằng ?paymentType=)
  // enum trong models/Order.js: ['CASH', 'CREDIT_CARD']
  // ===========================================================================
  question11: async (req, res, next) => {
    try {
      const paymentType = req.query.paymentType || 'CASH';

      // ----- CÁCH 1: find -----
      let results = await Order.find({ paymentType })
        .populate({ path: 'customer', select: 'firstName lastName' })
        .lean();

      // ----- CÁCH 2: aggregate -----
      // let results = await Order.aggregate().match({ paymentType });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question12: async (req, res, next) => {
    try {
      const paymentType = req.query.paymentType || 'CREDIT_CARD';

      let results = await Order.find({ paymentType })
        .populate({ path: 'customer', select: 'firstName lastName' })
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  // ===========================================================================
  // Câu 14: Hiển thị tất cả các nhân viên có sinh nhật là hôm nay
  // (giống câu 6 nhưng đổi collection Customer -> Employee)
  // ?date=YYYY-MM-DD để test 1 ngày bất kỳ.
  // ===========================================================================
  question14: async (req, res, next) => {
    try {
      const { date } = req.query;
      const today = date ? new Date(date) : new Date();

      // ----- CÁCH 1: find + $expr (so ngày + tháng, KHÔNG so năm) -----
      const conditionFind = {
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }] },
            { $eq: [{ $month: '$birthday' }, { $month: today }] },
          ],
        },
      };

      let results = await Employee.find(conditionFind);

      // ----- CÁCH 2: aggregate -----
      // let results = await Employee.aggregate()
      //   .addFields({
      //     d: { $dayOfMonth: '$birthday' },
      //     m: { $month: '$birthday' },
      //   })
      //   .match({ d: today.getDate(), m: today.getMonth() + 1 });

      let total = await Employee.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
};
