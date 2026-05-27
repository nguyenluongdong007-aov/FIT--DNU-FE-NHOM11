// Đường dẫn API của bạn (trỏ vào resource chứa username/password)
const API_LOGIN = "https://69f9a6e3c509a40d3aa2f039.mockapi.io/api/v1/rooms";

document.getElementById('stayeasy-login-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    // Lấy dữ liệu người dùng nhập
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const btn = this.querySelector('button[type="submit"]');

    // Hiệu ứng loading cho nút bấm
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Đang kiểm tra...';
    btn.disabled = true;

    try {
        // 1. Gọi API lấy danh sách dữ liệu từ MockAPI
        const response = await fetch(API_LOGIN);
        if (!response.ok) throw new Error("Lỗi kết nối đến máy chủ API");
        const data = await response.json();

        // 2. Tìm kiếm xem có dòng dữ liệu nào khớp cả username và password không
        const validAccount = data.find(item => item.username === user && item.password === pass);

        if (validAccount) {
            // 3. Nếu tìm thấy, kiểm tra tiếp xem role có phải là 'admin' không
            if (validAccount.role === 'admin' || validAccount.role === 'Admin') {
                
                // Cấp vé thông hành (Token tĩnh) lưu vào LocalStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('adminName', validAccount.username); // Lưu tên để dùng sau này

                // Hiển thị trạng thái thành công
                btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Đăng nhập thành công';
                btn.style.background = 'linear-gradient(90deg, #28a745, #218838)'; // Đổi sang màu xanh

                // Chuyển hướng sang trang quản trị sau 1 giây
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
                
            } else {
                alert("Lỗi quyền truy cập: Tài khoản của bạn không phải là Quản trị viên (Admin)!");
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        } else {
            // Đăng nhập thất bại (Sai user hoặc pass)
            alert("Tên đăng nhập hoặc mật khẩu không chính xác!");
            btn.innerHTML = originalText;
            btn.disabled = false;
        }

    } catch (error) {
        // Xử lý khi mạng lỗi hoặc link API sập
        alert("Lỗi hệ thống: " + error.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});