# Đối chiếu `routes/questions` với file *Database Design & Questions.xlsx*

> Sheet **PHẦN II API → B. TRUY VẤN DỮ LIỆU** (35 câu). Chỉ GET, không thêm/sửa/xoá.
> Ngày đối chiếu: 2026-09-06.

## 1. Bảng tổng hợp

| Câu | Nội dung (rút gọn) | Trạng thái trước | Ghi chú |
|----|--------------------|------------------|---------|
| 1 | mặt hàng giảm giá <= 10% | ✅ đúng | |
| 1a | giảm giá <= X% + category/supplier | ⚠️ **lỗi** → đã sửa | `populate("cc")` sai tên virtual → mongoose 8 ném `StrictPopulateError`. Sửa thành `populate("category")`. |
| 1b | giảm giá <=,>=,<,>,= X% | ✅ đúng | có validate `q1` bằng yup. |
| 2 | tồn kho **<= 5** | ⚠️ lệch đề → đã sửa | code cũ để `$lte: 100`. Đề ghi `<= 5`. |
| 2a / 2b | tồn kho theo X / theo toán tử | ✅ đúng | |
| 3 | giá sau giảm <= 1000 (find + `$expr`) | ✅ đúng | |
| 3a | giá sau giảm <= X | ✅ đúng | param là `?discountedPrice=`. |
| 3c | như 3 nhưng `aggregate` | ✅ đúng | |
| 3d | 3c + `$addFields` + `$project` | ⚠️ lệch đề → đã sửa | match để `100`, đề là `1000`. |
| 3e | 3d + `$lookup` category/supplier | ⚠️ lệch đề → đã sửa | match để `100`, đề là `1000`. |
| 4 | khách hàng địa chỉ ở Quận Hải Châu | ✅ đúng | `fuzzySearch(address)`. |
| 4a | (biến thể aggregate của 4) | ✅ đúng | không có trong đề, giữ làm ví dụ. |
| 5 | khách hàng năm sinh 1990 | ⚠️ **lỗi** → đã sửa | so `{ $year }` (Number) với `req.query.year` (String) → luôn false. Thêm `Number(year)`. |
| 5a | năm sinh X + trả về trường năm sinh | ⚠️ **lỗi** → đã sửa | dùng biến JS `birthYear` chưa khai báo → `ReferenceError`. Sửa thành field `'$birthYear'` / match trực tiếp. |
| 6 | khách hàng sinh nhật hôm nay | ✅ đúng | so ngày + tháng. |
| 7 | đơn hàng trạng thái COMPLETED | ✅ đúng | nhận `?status=`. |
| 8a | COMPLETED trong ngày hôm nay | ⚠️ **lỗi** → đã sửa | `{ status }` nằm trong `$expr/$and` là object → luôn truthy → **không lọc status**. Sửa thành `{ $eq: ['$status', status] }`. |
| 8b | `<status>` trong khoảng ngày | ✅ đúng (lọc theo `createdAt`) | Đề nói "ngày tạo" – nếu muốn đồng bộ với các câu khác nên đổi sang `createdDate`. |
| 8c | `<status>` **ngoài** khoảng ngày | ⚠️ lưu ý | đang lọc theo `shippedDate`; đề nói "ngày tạo" → nên là `createdDate`. |
| 8d | (biến thể, không có trong đề) | – | giữ làm ví dụ `$not`. |
| **9** | đơn hàng trạng thái CANCELED | ❌ thiếu → **đã thêm** | |
| **10** | CANCELED trong ngày hôm nay | ❌ thiếu → **đã thêm** | |
| **11** | thanh toán CASH | ❌ thiếu → **đã thêm** | |
| **12** | thanh toán CREDIT_CARD | ❌ thiếu → **đã thêm** | giá trị enum theo `models/Order.js`. |
| 13 | đơn hàng **địa chỉ giao hàng** = Hà Nội | ⚠️ **sai mục tiêu** → đã sửa | code cũ lọc `customer.address`. Đề = `shippingAddress` của Order. Đã đổi + giữ 2 cách khác trong comment. |
| **14** | nhân viên sinh nhật hôm nay | ❌ thiếu → **đã thêm** | giống câu 6 nhưng `Employee`. |
| 15 | nhà cung cấp tên trong (SONY, SAMSUNG, …) | ✅ đúng | `{ name: { $in: supplierNames } }`. |
| **16** | đơn hàng + chi tiết Customer | ⚠️ có hàm nhưng **chưa gắn route** → **đã thêm route** `/16`, `/16b`. |
| **17** | mặt hàng + chi tiết Category & Supplier | ❌ thiếu → **đã thêm** | |
| 18 | Categories + số lượng hàng hoá | ✅ chạy được | `totalProduct` đang đếm sp có `stock > 0` (không phải tổng số sp). Tuỳ cách hiểu đề. |
| 19 | Suppliers + số lượng hàng hoá | ✅ chạy được | `totalProduct` thực chất là **tổng tồn kho**; `count` là số sp `stock > 0`. Tên trường hơi gây hiểu nhầm. |
| 20 | mặt hàng bán ra trong khoảng ngày | ✅ đúng | |
| 21 | khách mua hàng trong khoảng ngày | ✅ đúng | |
| 22 | khách + tổng tiền, trong khoảng ngày | ✅ đúng | |
| 23 | mọi đơn + tổng tiền mỗi đơn | ✅ đúng | |
| 24 | nhân viên + tổng tiền bán được | ✅ đúng | |
| 25 | mặt hàng không bán được | ✅ đúng | `orders: { $size: 0 }`. |
| 26 | NCC không bán được trong khoảng ngày | ⚠️ tự đánh dấu `// SAI` | dùng bản `question26b` / `question26c`. Xem mục 3. |
| 27 | **top 3** nhân viên theo doanh số | ⚠️ thiếu `limit` → đã sửa | đã bỏ comment `.limit(3)`. |
| **28** | **top 5** khách theo tổng mua | ❌ thiếu → **đã thêm** | đối xứng câu 27. |
| 29 | danh sách mức giảm giá | ✅ đúng | `Product.distinct('discount')`. |
| 30 | Categories + tổng tiền bán ra | ✅ chạy được | |
| **31** | mọi đơn + tổng tiền trong khoảng ngày (không sort) | ❌ thiếu → **đã thêm** | = câu 32 bỏ `.sort`. |
| 32 | mọi đơn + tổng tiền, sort giảm dần | ✅ đúng | |
| 33 | đơn có tổng tiền **ít nhất** trong khoảng ngày | ✅ đúng | group theo `total`, sort tăng, `limit(1)`. |
| 34 | trung bình cộng giá trị đơn hàng | ✅ đúng | |
| 35 | khách **không** mua hàng trong khoảng ngày | ⚠️ lưu ý | Xem mục 3. |

**Các câu KHÔNG có trong đề (giữ nguyên làm ví dụ):** `4a`, `8d`, `16a/16b` (đã có route), `20a`, `24a`, `26b`, `26c`.

## 2. Danh sách thay đổi

### Sửa lỗi
- `controller1.js`
  - `question1a`: `populate("cc")` → `populate("category")`.
  - `question2`: `stock $lte 100` → `5` (đúng đề).
  - `question3d`, `question3e`: ngưỡng `100` → `1000`.
  - `question5`: ép `Number(year)` trong `$expr`.
  - `question5a`: `birthYear` (biến chưa định nghĩa) → field `'$birthYear'`, match trực tiếp sau `$addFields`.
  - `question8a`: `{ status }` trong `$and` → `{ $eq: ['$status', status] }`.
  - Thêm `Employee` vào danh sách import.
- `controller2.js`
  - `question13`: đổi mục tiêu lọc sang `Order.shippingAddress` (đúng đề). Giữ 2 cách khác trong comment (find; lookup customer.address).
- `controller3.js`
  - `question27`: bật lại `.limit(3)`.

### Thêm mới
- `controller1.js`: `question9`, `question10`, `question11`, `question12`, `question14`.
- `controller2.js`: `question17`.
- `controller3.js`: `question28`, `question31`.
- `router.js`: gắn route `/9 /10 /11 /12 /14 /16 /16b /17 /28 /31`.

Mỗi hàm mới đều có ghi chú tiếng Việt và **≥ 2 cách giải** (find + `$expr` và/hoặc `aggregate`) như các câu mẫu.

## 3. Điểm cần bàn thêm (chưa tự ý sửa logic)

1. **Câu 26** (`question26` bị đánh dấu `// SAI`): yêu cầu "NCC không bán được trong khoảng ngày" = NCC mà **mọi** sản phẩm của họ đều không có dòng đơn hàng nào nằm trong `[fromDate, toDate]`. Cách `unwind` rồi `match ($or ngoài khoảng / null)` sẽ **lọt** NCC có 1 sp bán trong khoảng và 1 sp bán ngoài khoảng. Hướng đúng: group lại theo NCC và kiểm tra `không tồn tại` đơn hàng trong khoảng (đếm số dòng trong khoảng = 0). `question26b` gần đúng hơn nhưng vẫn dính vấn đề tương tự.
2. **Câu 35** cùng kiểu bug: khách có 2 đơn (1 trong khoảng, 1 ngoài khoảng) vẫn xuất hiện nhờ dòng "ngoài khoảng". Nên `group` theo khách và loại nếu `có ít nhất 1 đơn trong khoảng`.
3. **Câu 8b/8c**: đề nói "ngày tạo" → nên thống nhất dùng `createdDate` (hiện 8b dùng `createdAt`, 8c dùng `shippedDate`).
4. **Câu 18/19**: nếu đề hiểu "số lượng hàng hoá" = **số sản phẩm** thì nên đếm `$sum: { $cond: [{ $ifNull: ['$products._id', false] }, 1, 0] }` thay vì điều kiện `stock > 0`.
5. **`shippingAddress`** (câu 13, 33, 34) không được khai báo trong `models/Order.js` dù có trong thiết kế bảng (Phần I). `aggregate` vẫn đọc được field thô; `find` phụ thuộc `strictQuery`. Cân nhắc bổ sung field vào schema.
6. **`utils.fuzzySearch`** trả regex có cờ `g` – MongoDB bỏ qua cờ này, không ảnh hưởng kết quả nhưng nên dùng `i` cho gọn.

## 4. Chưa kiểm thử trực tiếp

Môi trường sandbox chặn DNS/kết nối ra ngoài nên **không chạy thử được** với Atlas (`node-33-database`). Đã kiểm tra: cú pháp, `require` toàn bộ controller/router OK, đủ 51 route, không thiếu handler. Nên chạy lại `npm run dev` và test bằng Postman các endpoint `/questions/...`.
