let roomModal = null;
let allRoomsAdmin = [];
document.addEventListener("DOMContentLoaded", () => {
    roomModal = new bootstrap.Modal(document.getElementById('roomFormModal'));
    loadAdminData();
    document.getElementById('room-form').addEventListener('submit', saveRoom);
});
async function loadAdminData() {
    await renderAdminRooms();
    await renderAdminBookings();
}
async function renderAdminRooms() {
    const tbody = document.getElementById('admin-room-list');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted"><i class="fa-solid fa-spinner fa-spin me-2"></i>Đang tải dữ liệu...</td></tr>';
    allRoomsAdmin = await API.getRooms();
    tbody.innerHTML = '';
    if(allRoomsAdmin.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Chưa có phòng nào trên hệ thống.</td></tr>';
        return;
    }
    allRoomsAdmin.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td class="text-muted fw-bold">#${r.id}</td>
                <td><img src="${r.image}" class="room-thumbnail" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;"></td>
                <td class="fw-bold text-primary-dark">${r.name}</td>
                <td><span class="badge bg-orange text-white rounded-pill px-2 py-1">${r.category}</span></td>
                <td class="text-accent fw-bold text-danger">${Utils.formatCurrency(r.price)}</td>
                <td class="text-muted"><i class="fa-solid fa-users me-1"></i> ${r.guests || 2}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border shadow-sm text-primary rounded-3 me-1" onclick="editRoom('${r.id}')" title="Sửa">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-light border shadow-sm text-danger rounded-3" onclick="deleteRoom('${r.id}')" title="Xóa">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}
function openRoomModal() {
    document.getElementById('room-form').reset();
    document.getElementById('room-id').value = '';
    document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');
    roomModal.show();
}
function editRoom(id) {
    const room = allRoomsAdmin.find(r => r.id == id);
    if(room) {
        document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');
        document.getElementById('room-id').value = room.id;
        document.getElementById('room-name').value = room.name;
        document.getElementById('room-type').value = room.category; 
        document.getElementById('room-price').value = room.price;
        document.getElementById('room-guests').value = room.guests || 2;
        document.getElementById('room-img').value = room.image; 
        
        roomModal.show();
    }
}
async function saveRoom(e) {
    e.preventDefault();
    document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');
    const id = document.getElementById('room-id').value;
    const nameVal = document.getElementById('room-name').value.trim();
    const categoryVal = document.getElementById('room-type').value;
    const priceVal = document.getElementById('room-price').value;
    const guestsVal = document.getElementById('room-guests').value;
    const imageVal = document.getElementById('room-img').value.trim();
    let isValid = true;
    if (nameVal === "") {
        document.getElementById('error-room-name').innerText = "Tên phòng không được để trống!";
        isValid = false;
    }
    if (categoryVal === "") {
        document.getElementById('error-room-type').innerText = "Vui lòng chọn hạng phòng!";
        isValid = false;
    }
    if (priceVal === "" || Number(priceVal) <= 0) {
        document.getElementById('error-room-price').innerText = "Giá phòng phải lớn hơn 0!";
        isValid = false;
    }
    if (imageVal === "" || (!imageVal.startsWith('http://') && !imageVal.startsWith('https://'))) {
        document.getElementById('error-room-img').innerText = "Đường dẫn URL ảnh không hợp lệ!";
        isValid = false;
    }
    if (!isValid) return;
    const roomData = {
        name: nameVal,
        category: categoryVal, 
        price: Number(priceVal),
        guests: Number(guestsVal),
        image: imageVal 
    };
    const btnSubmit = document.querySelector('#room-form button[type="submit"]');
    const originalText = btnSubmit.innerText;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Đang lưu...';
    btnSubmit.disabled = true;
    try {
        if (id) {
            await API.updateRoom(id, roomData);
            alert("Cập nhật thông tin phòng thành công!");
        } else {
            await API.addRoom(roomData);
            alert("Thêm phòng mới thành công!");
        }
        roomModal.hide();
        await renderAdminRooms();
    } catch (error) {
        alert("Lỗi khi lưu dữ liệu: " + error.message);
    } finally {
        btnSubmit.innerText = originalText;
        btnSubmit.disabled = false;
    }
}
async function deleteRoom(id) {
    if(confirm("Thao tác này không thể hoàn tác. Bạn chắc chắn muốn xóa?")) {
        try {
            await API.deleteRoom(id);
            await renderAdminRooms();
        } catch (error) {
            alert("Lỗi khi xóa: " + error.message);
        }
    }
}
async function renderAdminBookings() {
    const tbody = document.getElementById('admin-booking-list');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted"><i class="fa-solid fa-spinner fa-spin me-2"></i>Đang tải dữ liệu...</td></tr>';
    
    const bookings = await API.getBookings();
    tbody.innerHTML = '';
    
    if(bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Chưa có đơn đặt phòng nào.</td></tr>';
        return;
    }
    bookings.reverse().forEach(b => {
        let statusBadge = '';
        if (b.status === 'Chờ duyệt') statusBadge = '<span class="badge bg-warning text-dark rounded-pill px-2 py-1"><i class="fa-regular fa-clock me-1"></i> Chờ duyệt</span>';
        else if (b.status === 'Đã duyệt') statusBadge = '<span class="badge bg-success rounded-pill px-2 py-1"><i class="fa-solid fa-check me-1"></i> Đã duyệt</span>';
        else statusBadge = '<span class="badge bg-danger rounded-pill px-2 py-1"><i class="fa-solid fa-xmark me-1"></i> Từ chối</span>';
        tbody.innerHTML += `
            <tr>
                <td class="text-muted fw-bold">#${b.id}</td>
                <td class="fw-bold">${b.customer}</td>
                <td class="text-primary-dark fw-semibold">${b.roomName}</td>
                <td class="text-muted small">${b.checkin} <br>đến ${b.checkout}</td>
                <td class="text-accent fw-bold text-danger">${Utils.formatCurrency(b.totalPrice)}</td>
                <td>${statusBadge}</td>
                <td class="text-end">
                    ${b.status === 'Chờ duyệt' ? `
                        <button class="btn btn-sm btn-success rounded-3 shadow-sm me-1" onclick="updateBookingStatus('${b.id}', 'Đã duyệt')" title="Duyệt đơn"><i class="fa-solid fa-check"></i></button>
                        <button class="btn btn-sm btn-danger rounded-3 shadow-sm" onclick="updateBookingStatus('${b.id}', 'Từ chối')" title="Từ chối"><i class="fa-solid fa-xmark"></i></button>
                    ` : '<span class="text-muted small"><i class="fa-solid fa-lock"></i> Đã khóa</span>'}
                </td>
            </tr>
        `;
    });
}
async function updateBookingStatus(id, newStatus) {
    if(confirm(`Bạn muốn chuyển trạng thái đơn này thành "${newStatus}"?`)) {
        try {
            await API.updateBookingStatus(id, newStatus);
            await renderAdminBookings();
        } catch (error) {
            alert("Lỗi khi cập nhật trạng thái: " + error.message);
        }
    }
}