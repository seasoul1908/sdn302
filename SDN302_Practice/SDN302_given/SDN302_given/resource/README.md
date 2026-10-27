# SDN302 — Customer, Product, Order REST API

Dự án Backend REST API chuẩn môn **SDN302 (Node.js, Express.js, MongoDB, Mongoose, JWT Authentication)**.
Cấu trúc tinh gọn tuyệt đối: **chỉ 4 thư mục nghiệp vụ chính** + thư mục `config/` có sẵn.

---

## 1. Cấu trúc thư mục (Chỉ 4 thư mục nghiệp vụ chính)

```text
resource/
├── config/
│   └── db.js                 # Kết nối MongoDB (giữ nguyên cấu hình của bạn)
├── controllers/
│   ├── authController.js     # Đăng nhập cấp JWT (POST /auth/tokens), đọc members.json
│   ├── productController.js  # CRUD Product & chặn xóa khi có Order tham chiếu (409)
│   └── orderController.js    # CRUD Order, tự tính giá/tổng tiền server-side & kiểm tra tồn kho
├── middleware/
│   ├── authMiddleware.js     # Middleware xác thực Bearer JWT token
│   └── errorHandler.js       # Xử lý lỗi 404 và 500 (luôn trả JSON)
├── models/
│   ├── Customer.js           # Mongoose model Customer
│   ├── Product.js            # Mongoose model Product
│   └── Order.js              # Mongoose model Order
├── routes/
│   ├── authRoutes.js         # Tuyến /auth/tokens
│   ├── productRoutes.js      # Tuyến /api/products
│   └── orderRoutes.js        # Tuyến /api/orders
├── .env                      # File môi trường cấu hình MongoDB, PORT, JWT_SECRET
├── .env.example              # File mẫu cấu hình môi trường
├── .gitignore                # Bỏ qua node_modules, .env
├── members.json              # Tài khoản đăng nhập (storeadmin / Store@123)
├── package.json              # Scripts và dependencies
├── README.md                 # Tài liệu hướng dẫn
├── SDN302.postman_collection.json # File Postman Collection để kiểm thử API
└── server.js                 # File khởi động server Express
```

---

## 2. Danh sách API đã triển khai

### 2.1. Authentication (Công khai)
- `POST /auth/tokens`: Nhận `{ name, pass }`, kiểm tra từ `members.json`. Đăng nhập thành công trả về `200` và Bearer JWT token. Thất bại trả `401`.

### 2.2. Product REST API (Yêu cầu Header `Authorization: Bearer <token>`)
- `GET /api/products`: Lấy toàn bộ danh sách sản phẩm (`200`).
- `GET /api/products/:id`: Xem chi tiết sản phẩm (`200`, `400`, `404`).
- `POST /api/products`: Thêm mới sản phẩm (`201`, `400`).
- `PUT /api/products/:id`: Cập nhật sản phẩm (`200`, `400`, `404`).
- `DELETE /api/products/:id`: Xóa sản phẩm. **Chặn xóa và trả về `409 Conflict` nếu sản phẩm đang được tham chiếu trong bất kỳ Order nào**.

### 2.3. Order REST API (Yêu cầu Header `Authorization: Bearer <token>`)
- `GET /api/orders`: Danh sách Order đã populate Customer và Product (`200`).
- `GET /api/orders/:id`: Chi tiết Order có populate Customer và Product (`200`, `400`, `404`).
- `POST /api/orders`: Tạo đơn hàng mới (`201`):
  - Tự động lấy `price_at_order` từ Product trong DB.
  - Tự tính `total` và `total_amount` trên server.
  - Kiểm tra tồn kho `stock`. Nếu không đủ hàng, trả về **`409 Conflict`**.
- `PUT /api/orders/:id`: Cập nhật đơn hàng (`200`, `400`, `404`, `409`).
- `DELETE /api/orders/:id`: Xóa đơn hàng (`200`, `400`, `404`).

---

## 3. Lệnh chạy dự án

Tại thư mục `resource/`:

```bash
# Khởi động server với nodemon (tự reload khi code đổi)
npm run dev

# Hoặc khởi động server trực tiếp
npm start
```
Server chạy tại: `http://127.0.0.1:9999` (hoặc PORT trong `.env`).

---

## 4. Kiểm thử bằng Postman

1. Mở **Postman** $\rightarrow$ Click **Import** $\rightarrow$ Chọn file [SDN302.postman_collection.json](file:///c:/Users/HIEP/OneDrive/M%C3%A1y%20t%C3%ADnh/SDN302/Practice/Excercise/SDN302_Practice/SDN302_given/SDN302_given/resource/SDN302.postman_collection.json).
2. Chạy request **1.1 Login Success**: Token sẽ tự động được lưu vào biến collection.
3. Chạy các request CRUD Product và Order để kiểm tra toàn bộ tính năng và mã trạng thái.
