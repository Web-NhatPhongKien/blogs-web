# Blogs Web

Blogs Web là ứng dụng blog full-stack gồm frontend React/Vite, backend Express/MongoDB và cấu hình Docker Compose để chạy toàn bộ hệ thống ở local. Ứng dụng hỗ trợ đăng ký/đăng nhập, quản lý hồ sơ, viết/chỉnh sửa bài blog bằng Editor.js, tìm kiếm bài viết/người dùng, bình luận, thích bài viết, thông báo và trang quản trị.

## Tính năng chính

- Xác thực người dùng bằng JWT.
- Đăng ký, đăng nhập, đổi mật khẩu và cập nhật hồ sơ.
- Tạo, chỉnh sửa, xóa, tìm kiếm và hiển thị bài viết blog.
- Editor hỗ trợ nội dung phong phú thông qua Editor.js.
- Like bài viết, bình luận và trả lời bình luận.
- Thông báo cho người dùng và đánh dấu đã đọc.
- Trang quản trị để quản lý người dùng, bài viết và tag/category.
- Hỗ trợ chạy bằng Docker Compose với MongoDB, backend và frontend.

## Kiến trúc dự án

Dự án được chia thành 2 ứng dụng chính:

- `frontend/`: ứng dụng React chạy bằng Vite, giao tiếp với backend qua biến môi trường `VITE_SERVER_DOMAIN`.
- `backend/`: REST API dùng Express, MongoDB/Mongoose, JWT và các route theo từng domain nghiệp vụ.

Luồng chạy cơ bản:

1. Người dùng truy cập frontend tại `http://localhost:5173`.
2. Frontend gọi API backend tại `http://localhost:3000`.
3. Backend đọc/ghi dữ liệu vào MongoDB.

## Công nghệ sử dụng

### Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Editor.js
- Framer Motion
- Firebase client SDK

### Backend

- Node.js
- Express
- MongoDB/Mongoose
- JSON Web Token
- Joi validation
- bcrypt
- Morgan
- CORS

### DevOps

- Docker
- Docker Compose
- Nginx cho frontend container

## Yêu cầu môi trường

Nếu chạy bằng Docker:

- Docker
- Docker Compose

Nếu chạy thủ công:

- Node.js 18+ khuyến nghị
- npm
- MongoDB local hoặc MongoDB Atlas

## Cài đặt và chạy local

### Cách 1: Chạy bằng Docker Compose

Từ thư mục gốc dự án:

```bash
docker compose up --build
```

Sau khi chạy thành công:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:3000/api/health`
- MongoDB: `mongodb://localhost:27017/blog-db`

Có thể truyền biến môi trường khi chạy:

```bash
JWT_SECRET=your_secret_key \
JWT_EXPIRES_IN=7d \
VITE_SERVER_DOMAIN=http://localhost:3000 \
docker compose up --build
```

Dừng container:

```bash
docker compose down
```

Dừng container và xóa volume MongoDB:

```bash
docker compose down -v
```

### Cách 2: Chạy thủ công

#### 1. Backend

```bash
cd backend
npm install
```

Tạo file `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/blog-db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Chạy backend ở chế độ phát triển:

```bash
npm run dev
```

Hoặc chạy production mode:

```bash
npm start
```

#### 2. Frontend

Mở terminal khác:

```bash
cd frontend
npm install
```

Tạo file `frontend/.env`:

```env
VITE_SERVER_DOMAIN=http://localhost:3000
```

Chạy frontend:

```bash
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`.

## Biến môi trường

### Backend

| Biến | Bắt buộc | Giá trị ví dụ | Mô tả |
| --- | --- | --- | --- |
| `PORT` | Không | `3000` | Port backend Express lắng nghe. |
| `MONGO_URI` | Có | `mongodb://localhost:27017/blog-db` | Chuỗi kết nối MongoDB. |
| `JWT_SECRET` | Có | `your_secret_key` | Khóa bí mật để ký và xác thực JWT. |
| `JWT_EXPIRES_IN` | Có | `7d` | Thời gian hết hạn của JWT. |
| `CLIENT_URL` | Không | `http://localhost:5173` | Origin frontend được phép gọi API qua CORS. |

### Frontend

| Biến | Bắt buộc | Giá trị ví dụ | Mô tả |
| --- | --- | --- | --- |
| `VITE_SERVER_DOMAIN` | Có | `http://localhost:3000` | Domain backend API mà frontend sẽ gọi. |

## API chính

Backend mount các nhóm route dưới prefix `/api`:

| Nhóm API | Prefix | Mô tả |
| --- | --- | --- |
| Health check | `GET /api/health` | Kiểm tra backend đang hoạt động. |
| Auth | `/api/auth` | Đăng ký và đăng nhập. |
| User | `/api/user` | Hồ sơ người dùng, tìm kiếm user, đổi mật khẩu. |
| Blog | `/api/blogs` | Danh sách, tìm kiếm, tạo, like và xóa blog. |
| Comment | `/api/comments` | Thêm, lấy và xóa bình luận. |
| Notification | `/api/notifications` | Lấy thông báo, số chưa đọc, đánh dấu đã đọc, xóa thông báo. |
| Admin | `/api/admin` | Quản lý user, blog và tag; yêu cầu quyền admin. |

Một số endpoint công khai đáng chú ý:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/blogs/latest-blogs`
- `GET /api/blogs/trending-blogs`
- `GET /api/blogs/popular-tags`
- `POST /api/blogs/search-blogs`
- `POST /api/user/get-profile`
- `POST /api/user/search-users`

Các endpoint tạo/sửa/xóa dữ liệu thường yêu cầu header xác thực:

```http
Authorization: Bearer <access_token>
```

## Cấu trúc thư mục

```text
.
├── backend/
│   ├── controllers/      # Xử lý request/response
│   ├── middlewares/      # Middleware xác thực và phân quyền
│   ├── routes/           # Khai báo REST routes
│   ├── schemas/          # Mongoose schemas/models
│   ├── services/         # Logic nghiệp vụ
│   ├── utils/            # Tiện ích dùng chung
│   ├── validates/        # Joi validation schemas
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # React context
│   │   ├── pages/        # Các trang của ứng dụng
│   │   ├── routes/       # Protected/Admin route wrappers
│   │   ├── services/     # Axios API clients
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
└── Readme.md
```

## Ghi chú phát triển

- Backend chỉ cho phép CORS từ `http://localhost:5173` và `CLIENT_URL` nếu được cấu hình.
- Khi đổi domain backend, cần cập nhật `VITE_SERVER_DOMAIN` ở frontend.
- Khi deploy frontend container, `VITE_SERVER_DOMAIN` được truyền qua build arg trong Dockerfile.
- Không commit các file `.env` chứa secret thật.
- Nếu thêm endpoint mới, nên cập nhật route tương ứng trong `backend/routes/` và bổ sung tài liệu vào README.
