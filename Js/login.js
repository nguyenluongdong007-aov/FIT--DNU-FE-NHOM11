const BASE_URL = "https://69f9a6e3c509a40d3aa2f039.mockapi.io/api/v1";
const API_LOGIN = `${BASE_URL}/rooms`;

const loginForm = document.getElementById('stayeasy-login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = loginForm.querySelector('button[type="submit"]');

if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'admin.html';
}

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();
    const originalText = loginButton.innerHTML;
    let loginSuccess = false;

    loginButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Đang kiểm tra...';
    loginButton.disabled = true;

    try {
        const response = await fetch(API_LOGIN);
        if (!response.ok) throw new Error('Không thể kết nối đến máy chủ API');

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Dữ liệu trả về không hợp lệ');

        const validAccount = data.find(item => item.username === user && item.password === pass);

        if (!validAccount) {
            alert('Tên đăng nhập hoặc mật khẩu không chính xác!');
            return;
        }

        if (validAccount.role !== 'admin' && validAccount.role !== 'Admin') {
            alert('Lỗi quyền truy cập: Tài khoản của bạn không phải là Quản trị viên (Admin)!');
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adminName', validAccount.username);
        localStorage.setItem('adminData', JSON.stringify(validAccount));

        loginButton.innerHTML = '<i class="fa-solid fa-check me-2"></i>Đăng nhập thành công';
        loginButton.style.background = 'linear-gradient(90deg, #28a745, #218838)';
        loginSuccess = true;

        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 800);
    } catch (error) {
        alert('Lỗi hệ thống: ' + error.message);
    } finally {
        if (!loginSuccess) {
            loginButton.disabled = false;
            loginButton.innerHTML = originalText;
        }
    }
});