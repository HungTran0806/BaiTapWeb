# Personal Blog Application

Ứng dụng blog cá nhân được xây dựng bằng React, TypeScript và Ant Design 4.0.

## Tính năng

### 🏠 Trang chủ
- Hiển thị danh sách bài viết dưới dạng thẻ
- Phân trang với 6 bài viết mỗi trang
- Lọc theo thẻ
- Tìm kiếm theo tiêu đề với debounce 300ms
- Responsive design

### 📄 Chi tiết bài viết
- Hiển thị nội dung đầy đủ của bài viết
- Theo dõi số lượt xem
- Hiển thị bài viết liên quan
- Thông tin tác giả và ngày đăng

### 👤 Trang giới thiệu
- Thông tin cá nhân của tác giả
- Danh sách kỹ năng
- Liên kết mạng xã hội

### ✏️ Quản lý bài viết
- Xem danh sách tất cả bài viết
- Thêm bài viết mới
- Chỉnh sửa bài viết hiện có
- Xóa bài viết
- Lọc theo trạng thái (đã đăng/nháp)
- Tìm kiếm theo tiêu đề

### 🏷️ Quản lý thẻ
- Xem danh sách tất cả thẻ
- Thêm thẻ mới
- Chỉnh sửa thẻ hiện có
- Xóa thẻ
- Tìm kiếm theo tên thẻ

## Cấu trúc thư mục

```
src/pages/Blog/
├── models/
│   └── blog.ts          # Định nghĩa interface và dữ liệu mẫu
├── components/
│   ├── PostCard.tsx     # Component hiển thị thẻ bài viết
│   ├── TagFilter.tsx    # Component lọc theo thẻ
│   └── SearchBar.tsx    # Component tìm kiếm
├── pages/
│   ├── Home.tsx         # Trang chủ
│   ├── PostDetail.tsx   # Chi tiết bài viết
│   ├── About.tsx        # Trang giới thiệu
│   ├── PostManagement.tsx # Quản lý bài viết
│   └── TagManagement.tsx  # Quản lý thẻ
├── BlogLayout.tsx       # Layout chính của blog
└── index.ts            # Export tất cả component
```

## Công nghệ sử dụng

- **React 18** - Framework JavaScript
- **TypeScript** - Type safety
- **Ant Design 4.0** - UI component library
- **React Router** - Routing
- **LocalStorage** - Lưu trữ dữ liệu (trong môi trường production nên dùng database)

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng:
```bash
npm start
```

3. Truy cập blog tại: `http://localhost:8000/blog`

## API Routes

- `/blog` - Trang chủ
- `/blog/about` - Trang giới thiệu
- `/blog/post/:slug` - Chi tiết bài viết
- `/blog/posts` - Quản lý bài viết
- `/blog/tags` - Quản lý thẻ

## Dữ liệu mẫu

Ứng dụng sử dụng dữ liệu mẫu được định nghĩa trong `models/blog.ts`. Trong môi trường production, bạn nên:

1. Thay thế localStorage bằng database (MongoDB, PostgreSQL, etc.)
2. Thêm authentication cho quản lý bài viết và thẻ
3. Thêm upload ảnh thật thay vì URL
4. Thêm rich text editor cho nội dung bài viết
5. Thêm comment system
6. Thêm SEO optimization

## Tính năng nâng cao (đề xuất)

- [ ] Authentication và authorization
- [ ] Rich text editor (TinyMCE, Quill, etc.)
- [ ] Upload ảnh
- [ ] Comment system
- [ ] Like/Bookmark bài viết
- [ ] RSS feed
- [ ] SEO optimization
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Email subscription
- [ ] Social sharing
- [ ] Analytics integration