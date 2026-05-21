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
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Đang tải dữ liệu...</td></tr>';
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
                <td><img src="${r.image}" class="room-thumbnail"></td>
                <td class="fw-bold text-primary-dark">${r.name}</td>
                <td><span class="badge-type">${r.category}</span></td>
                <td class="text-accent fw-bold">${Utils.formatCurrency(r.price)}</td>
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
    roomModal.show();
}
function editRoom(id) {
    const room = allRoomsAdmin.find(r => r.id == id);
    if(room) {
        document.getElementById('room-id').value = room.id;
        document.getElementById('room-name').value = room.name;
        document.getElementById('room-type').value = room.category; // Ánh xạ tới category
        document.getElementById('room-price').value = room.price;
        document.getElementById('room-guests').value = room.guests || 2;
        document.getElementById('room-img').value = room.image; // Ánh xạ tới image
        roomModal.show();
    }
}
async function saveRoom(e) {
    e.preventDefault();
    const id = document.getElementById('room-id').value;
    
    const roomData = {
        name: document.getElementById('room-name').value,
        category: document.getElementById('room-type').value, // Ánh xạ từ type form
        price: Number(document.getElementById('room-price').value),
        guests: Number(document.getElementById('room-guests').value),
        image: document.getElementById('room-img').value // Ánh xạ từ img form
    };
    const btnSubmit = document.querySelector('#room-form button[type="submit"]');
    btnSubmit.innerText = "Đang lưu...";
    btnSubmit.disabled = true;
    if (id) {
        await API.updateRoom(id, roomData);
    } else {
        await API.addRoom(roomData);
    }
    roomModal.hide();
    btnSubmit.innerText = "Lưu Dữ Liệu";
    btnSubmit.disabled = false;
    await renderAdminRooms();
}
async function deleteRoom(id) {
    if(confirm("Thao tác này không thể hoàn tác. Bạn chắc chắn muốn xóa?")) {
        await API.deleteRoom(id);
        await renderAdminRooms();
    }
}

async function renderAdminBookings() {
    const tbody = document.getElementById('admin-booking-list');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Đang tải dữ liệu...</td></tr>';
    const bookings = await API.getBookings();
    tbody.innerHTML = '';
    if(bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Chưa có đơn đặt phòng nào.</td></tr>';
        return;
    }
    bookings.reverse().forEach(b => {
        let statusBadge = '';
        if (b.status === 'Chờ duyệt') statusBadge = '<span class="badge-soft-warning"><i class="fa-regular fa-clock me-1"></i> Chờ duyệt</span>';
        else if (b.status === 'Đã duyệt') statusBadge = '<span class="badge-soft-success"><i class="fa-solid fa-check me-1"></i> Đã duyệt</span>';
        else statusBadge = '<span class="badge-soft-danger"><i class="fa-solid fa-xmark me-1"></i> Từ chối</span>';
        tbody.innerHTML += `
            <tr>
                <td class="text-muted fw-bold">#${b.id}</td>
                <td class="fw-bold">${b.customer}</td>
                <td class="text-primary-dark fw-semibold">${b.roomName}</td>
                <td class="text-muted small">${b.checkin} <br>đến ${b.checkout}</td>
                <td class="text-accent fw-bold">${Utils.formatCurrency(b.totalPrice)}</td>
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
        await API.updateBookingStatus(id, newStatus);
        await renderAdminBookings();
    }
}