# Ứng dụng Quản lý Công việc Cá nhân (TodoList)

## Tổng quan

Ứng dụng quản lý công việc cá nhân được xây dựng bằng React và Ant Design v4, tích hợp với UMI framework. Ứng dụng cung cấp giao diện Kanban board để quản lý các task theo trạng thái, cùng với các tính năng tìm kiếm, lọc và thống kê.

## Tính năng chính

### 1. Trang Dashboard
- **Thống kê tổng quan**: Hiển thị tổng số task, số task đã hoàn thành và số task quá hạn
- **Hiển thị dạng thẻ (Cards)**: Sử dụng component Statistic của Ant Design để hiển thị các số liệu

### 2. Trang Kanban Board
- **3 cột chính**:
  - **Cần làm** (Todo): Các task chưa bắt đầu
  - **Đang làm** (In Progress): Các task đang thực hiện
  - **Hoàn thành** (Done): Các task đã hoàn tất
- **Kéo thả task**: Sử dụng thư viện `react-beautiful-dnd` để kéo thả task giữa các cột
- **Cập nhật trạng thái tự động**: Khi kéo thả, trạng thái task sẽ được cập nhật tương ứng

### 3. Trang Danh sách Task
- **Bảng hiển thị**: Sử dụng component Table của Ant Design
- **Tìm kiếm**: Tìm kiếm theo tên task (case-insensitive)
- **Lọc theo trạng thái**: Lọc task theo trạng thái (Cần làm, Đang làm, Hoàn thành)
- **Sắp xếp**: Sắp xếp theo deadline (tăng dần/giảm dần)

### 4. Thêm/Chỉnh sửa Task
- **Form đầy đủ**: Bao gồm các trường bắt buộc và tùy chọn
- **Thông tin task**:
  - **Tên task** (bắt buộc): Tiêu đề của công việc
  - **Mô tả**: Chi tiết về công việc
  - **Deadline** (bắt buộc): Ngày hoàn thành dự kiến
  - **Mức độ ưu tiên**: Cao/Trung bình/Thấp
  - **Tag**: Nhiều tag có thể thêm, phân cách bằng dấu phẩy
  - **Trạng thái**: Cần làm/Đang làm/Hoàn thành
- **Validation**: Kiểm tra dữ liệu đầu vào
- **Reset form**: Tự động reset khi đóng modal

### 5. Lưu trữ dữ liệu
- **LocalStorage**: Tất cả dữ liệu được lưu trữ trong localStorage của trình duyệt
- **Tự động load**: Dữ liệu tự động được tải lại khi refresh trang
- **Persistent**: Dữ liệu không bị mất khi đóng/mở lại trình duyệt

## Cấu trúc file

```
src/pages/TodoList/
├── index.tsx          # Component chính với tabs và logic chính
├── TodoItem.tsx       # Component hiển thị từng task
├── Form.tsx           # Form thêm/chỉnh sửa task
└── README.md          # Tài liệu này

src/models/todolist.ts    # Model quản lý state và logic nghiệp vụ
src/services/TodoList/
└── typings.d.ts       # Định nghĩa kiểu dữ liệu TypeScript
```

## Các file đã thay đổi

### 1. `src/services/TodoList/typings.d.ts`
- **Thay đổi**: Cập nhật interface `TodoItem` với các trường mới
- **Thêm**: Các type `TaskStatus` và `TaskPriority`
- **Chi tiết**:
  - `id`: ID duy nhất cho mỗi task
  - `title`: Tên task (thay thế `content` cũ)
  - `description`: Mô tả chi tiết
  - `deadline`: Ngày deadline dạng string
  - `priority`: Mức độ ưu tiên
  - `tags`: Mảng các tag
  - `status`: Trạng thái task
  - `color`: Màu sắc hiển thị

### 2. `src/models/todolist.ts`
- **Thay đổi**: Hoàn toàn refactor logic quản lý state
- **Thêm**:
  - Hàm `normalize()` để chuyển đổi dữ liệu cũ sang định dạng mới
  - Hàm `saveData()` để lưu dữ liệu vào localStorage
  - Hàm `deleteTodo()` để xóa task
  - Hỗ trợ backward compatibility với dữ liệu cũ
- **Cải thiện**: Tách biệt logic lưu trữ và state management

### 3. `src/pages/TodoList/index.tsx`
- **Thay đổi**: Hoàn toàn viết lại component chính
- **Thêm**:
  - Dashboard với thống kê
  - Tabs để chuyển đổi giữa Kanban và Table view
  - Logic kéo thả với `react-beautiful-dnd`
  - Tìm kiếm và lọc trong table view
  - Sắp xếp theo deadline
- **Cải thiện**: UI/UX với responsive design

### 4. `src/pages/TodoList/TodoItem.tsx`
- **Thay đổi**: Refactor hoàn toàn component hiển thị task
- **Thêm**:
  - Hiển thị đầy đủ thông tin task (deadline, priority, tags)
  - Tooltip cho các nút hành động
  - Card design với màu sắc phân biệt
  - Responsive layout
- **Cải thiện**: Sử dụng Ant Design components thay vì custom styling

### 5. `src/pages/TodoList/Form.tsx`
- **Thay đổi**: Viết lại hoàn toàn form component
- **Thêm**:
  - Form validation với Ant Design Form
  - DatePicker cho deadline
  - Select mode tags cho tags
  - useEffect để sync dữ liệu khi edit
  - Reset form khi đóng modal
- **Cải thiện**: UX với proper form handling và error messages

## Thư viện sử dụng

- **React**: Framework chính
- **Ant Design v4**: UI component library
- **react-beautiful-dnd**: Thư viện kéo thả cho Kanban board
- **moment**: Xử lý ngày tháng
- **UMI**: Build tool và state management
- **TypeScript**: Type safety

## Cách sử dụng

1. **Truy cập ứng dụng**: Điều hướng đến route `/todo-list`
2. **Xem dashboard**: Xem thống kê tổng quan ở đầu trang
3. **Quản lý task**:
   - **Kanban view**: Kéo thả task giữa các cột
   - **Table view**: Tìm kiếm, lọc và sắp xếp task
4. **Thêm task**: Click "Thêm task mới" và điền thông tin
5. **Chỉnh sửa task**: Click icon chỉnh sửa trên task
6. **Xóa task**: Click icon xóa trên task

## Ghi chú kỹ thuật

- **Backward compatibility**: Ứng dụng tự động chuyển đổi dữ liệu cũ sang định dạng mới
- **Performance**: Sử dụng React hooks và memoization để tối ưu hiệu suất
- **Responsive**: Thiết kế responsive cho mobile và desktop
- **Type safety**: Đầy đủ TypeScript typing
- **Error handling**: Xử lý lỗi và validation dữ liệu đầu vào

## Phát triển thêm

Các tính năng có thể mở rộng trong tương lai:
- Lưu trữ đám mây (Firebase, Supabase)
- Chia sẻ task với người khác
- Nhắc nhở deadline
- Báo cáo thống kê chi tiết
- Tích hợp calendar
- Export/Import dữ liệu

---

*Được phát triển với Ant Design v4 và React*</content>
<parameter name="filePath">c:\Users\ADMIN\Desktop\baseltw\src\pages\TodoList\README.md