document.getElementById('stayeasy-login-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const btn = this.querySelector('button[type="submit"]');
    if (user === 'admin' && pass === '123456') {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Đang xác thực...';
        btn.disabled = true;
        localStorage.setItem('isLoggedIn', 'true');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 800);
    } else {
        alert('Tài khoản hoặc mật khẩu quản trị không chính xác!');
    }
});