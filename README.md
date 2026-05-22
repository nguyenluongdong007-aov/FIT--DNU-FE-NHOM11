# 🏨 StayEasy - Hệ thống Đặt Phòng Trực Tuyến
**StayEasy** là một dự án ứng dụng web (Frontend) giúp quản lý và đặt phòng Khách sạn/Homestay một cách trực quan, hiện đại. Dự án được chia làm 2 phân hệ rõ ràng: Phân hệ dành cho Khách hàng (Client) và Phân hệ Quản trị (Admin Dashboard).
Dự án sử dụng kiến trúc gọi API bất đồng bộ (Fetch API) để tương tác với cơ sở dữ liệu giả lập thông qua **MockAPI.io**.
## Tính năng nổi bật
### 1. Dành cho Khách hàng (`index.html`)
- **Giao diện hiện đại (UI/UX):** Bố cục dạng thẻ (Card) bo góc, đổ bóng mềm mại, responsive trên mọi thiết bị.
- **Lọc phòng thông minh:** Lọc trực tiếp danh sách phòng theo Loại phòng (Standard, Deluxe, Homestay, Suite, Villa...), Số lượng khách và Mức giá tối đa.
- **Tính tiền tự động:** Lựa chọn ngày check-in, check-out và hệ thống sẽ tự động tính số đêm lưu trú và tổng tiền.
- **Đặt phòng trực tuyến:** Form gửi yêu cầu đặt phòng (Create Booking).
### 2. Dành cho Quản trị viên (`admin.html`)
- **Dashboard quản trị:** Bảng điều khiển tích hợp Tabs hiện đại, chia rõ khu vực Quản lý phòng và Quản lý đơn.
- **CRUD Phòng:** Thêm mới (Create), Xem (Read), Cập nhật (Update) và Xóa (Delete) phòng. Dữ liệu đồng bộ realtime với API.
- **Duyệt đơn đặt phòng:** Theo dõi danh sách khách đặt, thay đổi trạng thái đơn (Chờ duyệt -> Đã duyệt / Từ chối).
## Công nghệ sử dụng
- **Cốt lõi:** HTML5, CSS3, JavaScript (ES6+ - Async/Await, Fetch API)
- **Thư viện UI:** Bootstrap 5 (Grid system, Modal, Component form)
- **Icon:** FontAwesome 6
- **Database / Backend (Giả lập):** RESTful API thông qua [MockAPI.io](https://mockapi.io/)
## Hướng dẫn cài đặt và chạy dự án
1. **Tải mã nguồn:** Tải toàn bộ source code về máy tính của bạn.
2. **Cấu hình API:**
   - Đảm bảo bạn đã có một Endpoint trên MockAPI với 2 resource là `rooms` và `bookings`.
   - Mở file `Js/api.js`, thay thế biến `BASE_URL` bằng đường link API của bạn.
     ```javascript
     const BASE_URL = "https://<your_mockapi_id>.mockapi.io/api/v1";
     ```
3. **Khởi chạy:** 
- Khuyên dùng extension **Live Server** trên VS Code để chạy dự án nhằm tránh các lỗi về CORS khi fetch API.
- Click chuột phải vào file `index.html` -> Chọn **Open with Live Server**.
## Cơ sở dữ liệu (Schema MockAPI)
### Bảng `rooms`
- `id`: Object ID
- `name`: String (Tên phòng)
- `image`: String (URL hình ảnh)
- `price`: Number (Giá mỗi đêm)
- `category`: String (Standard / Deluxe / Homestay / Suite / Villa)
- `guests`: Number (Sức chứa tối đa)
### Bảng `bookings`
- `id`: Object ID
- `customer`: String (Tên khách đặt)
- `roomsId`: String (ID của phòng được đặt)
- `roomName`: String (Tên phòng)
- `checkin`: String / Date 
- `checkout`: String / Date
- `totalPrice`: Number (Tổng tiền thanh toán)
- `status`: String (Trạng thái: Chờ duyệt / Đã duyệt / Từ chối)