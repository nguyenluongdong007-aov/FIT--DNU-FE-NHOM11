let currentSelectedRoom = null;
let bookingModal = null;
let allRooms = [];
document.addEventListener("DOMContentLoaded", async () => {
    bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    allRooms = await API.getRooms(); 
    renderRooms(allRooms);
    ['filter-type', 'filter-guests', 'filter-price'].forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilter);
    });
    document.getElementById('checkin').addEventListener('change', updatePriceUI);
    document.getElementById('checkout').addEventListener('change', updatePriceUI);
    document.getElementById('booking-form').addEventListener('submit', submitBooking);
});
function renderRooms(rooms) {
    const list = document.getElementById('room-list');
    list.innerHTML = rooms.length === 0 ? '<div class="col-12 text-center py-5 text-muted"><h4>Không tìm thấy phòng phù hợp.</h4></div>' : '';
    rooms.forEach(room => {
        const badgeClass = `badge-${room.category}`; 
        const cardHTML = `
            <div class="col-lg-4 col-md-6">
                <div class="card room-card h-100">
                    <div class="room-image-wrapper position-relative">
                        <img src="${room.image}" class="card-img-top room-image" alt="Hình ảnh phòng" style="height: 250px; object-fit: cover;">
                        <span class="badge bg-white text-dark position-absolute top-0 end-0 m-3 py-2 px-3 rounded-pill shadow-sm fw-bold">
                            <i class="fa-solid fa-star text-warning"></i> 4.8
                        </span>
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-1">${room.type}</span>
                            <span class="text-muted small"><i class="fa-solid fa-user me-1"></i> ${room.capacity} khách</span>
                        </div>
                        <h4 class="card-title fw-bold text-dark mt-2">${room.name}</h4>
                        <p class="card-text text-muted small flex-grow-1">${room.description || 'Không gian nghỉ dưỡng tuyệt vời dành cho bạn.'}</p>
                        <div class="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 text-primary fw-extrabold">${Number(room.price).toLocaleString('vi-VN')} đ<span class="fs-6 text-muted fw-normal">/đêm</span></h5>
                            <button class="btn btn-dark rounded-pill px-4 fw-bold" onclick="openBookingModal(${room.id}, '${room.name}', ${room.price})">Đặt ngay</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}
function applyFilter() {
    const type = document.getElementById('filter-type').value;
    const guests = parseInt(document.getElementById('filter-guests').value) || 0;
    const maxPrice = parseInt(document.getElementById('filter-price').value) || Infinity;
    const filtered = allRooms.filter(r => 
        (type === 'all' || r.category === type) &&
        (r.guests || 2) >= guests && 
        r.price <= maxPrice
    );
    renderRooms(filtered);
}
function openBookingModal(roomId) {
    currentSelectedRoom = allRooms.find(r => r.id == roomId); 
    document.getElementById('modal-room-name').innerText = currentSelectedRoom.name;
    document.getElementById('modal-room-price').innerText = Utils.formatCurrency(currentSelectedRoom.price);
    document.getElementById('booking-form').reset();
    document.getElementById('total-nights').innerText = '0';
    document.getElementById('total-price').innerText = '0 VND';
    bookingModal.show();
}
function updatePriceUI() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const nights = Utils.calculateNights(checkin, checkout);
    if (nights > 0) {
        document.getElementById('total-nights').innerText = nights;
        document.getElementById('total-price').innerText = Utils.formatCurrency(nights * currentSelectedRoom.price);
    } else {
        document.getElementById('total-nights').innerText = 'Lỗi ngày';
        document.getElementById('total-price').innerText = '0 VND';
    }
}
$('#booking-form').on('submit', function(e) {
    e.preventDefault();
    const customer = $('#customer-name').val().trim();
    const checkin = $('#checkin').val();
    const checkout = $('#checkout').val();
    const nights = Utils.calculateNights(checkin, checkout);
    let isValid = true;
    $('.error-message').hide();
    $('input').removeClass('is-invalid');
    if (customer === "") {
        $('#err-customer').show();
        $('#customer-name').addClass('is-invalid');
        isValid = false;
    }
    if (!checkin) {
        $('#err-checkin').show();
        $('#checkin').addClass('is-invalid');
        isValid = false;
    }
    if (nights <= 0) {
        $('#err-checkout').text(nights === 0 ? "Ngày trả phải sau ngày nhận!" : "Ngày trả không hợp lệ!");
        $('#err-checkout').show();
        $('#checkout').addClass('is-invalid');
        isValid = false;
    }
    if (isValid) {
        const newBooking = {
            customer: customer,
            roomsId: currentSelectedRoom.id,
            roomName: currentSelectedRoom.name,
            checkin: checkin,
            checkout: checkout,
            totalPrice: nights * currentSelectedRoom.price,
            status: 'Chờ duyệt'
        };
        const btnSubmit = $(this).find('button[type="submit"]');
        btnSubmit.text("Đang xử lý...").attr('disabled', true);
        $.ajax({
            url: `${BASE_URL}/bookings`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newBooking),
            success: function(response) {
                alert("🎉 Đặt phòng thành công! Cảm ơn " + customer);
                bookingModal.hide();
            },
            error: function(xhr, status, error) {
                alert("❌ Lỗi hệ thống: Không thể gửi đơn đặt. Vui lòng thử lại!");
            },
            complete: function() {
                btnSubmit.text("Gửi Yêu Cầu Đặt Phòng").attr('disabled', false);
            }
        });
    }
});
$(window).scroll(function() {
    if ($(this).scrollTop() > 300) {
        $('.navbar').addClass('shadow-lg').css('opacity', '0.95');
    } else {
        $('.navbar').removeClass('shadow-lg').css('opacity', '1');
    }
});
function renderRooms(rooms) {
    const list = $('#room-list');
    list.hide();
    list.empty();
    if(rooms.length === 0) {
        list.append('<div class="col-12 text-center py-5 text-muted"><h4>Không tìm thấy phòng phù hợp.</h4></div>');
    } else {
        rooms.forEach(room => {
            const badgeClass = `badge-${room.category}`;
            const cardHTML = `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 room-card">
                        <div class="position-relative">
                            <img src="${room.image}" class="card-img-top" alt="${room.name}">
                            <div class="favorite-icon"><i class="fa-regular fa-heart"></i></div>
                        </div>
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="room-badge ${badgeClass}">${room.category}</span>
                                <span class="text-muted fw-semibold small"><i class="fa-solid fa-user-group me-1"></i>
                                ${room.guests || 2} khách</span>
                            </div>
                            <h5 class="card-title fw-extrabold text-primary-dark mb-2">${room.name}</h5>
                            <div class="d-flex align-items-center mb-3 text-warning small">
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                <span class="text-muted ms-2 fw-semibold">(10+ đánh giá)</span>
                            </div>
                            <p class="mb-0 text-accent fw-extrabold fs-5">${Utils.formatCurrency(room.price)}
                            <span class="fs-6 text-muted fw-semibold">/ đêm</span></p>
                        </div>
                        <div class="card-footer bg-transparent border-0 pb-4 pt-0 px-4 text-center">
                            <button class="btn btn-outline-primary-dark w-100 rounded-pill py-2" onclick="openBookingModal('${room.id}')">
                            Xem chi tiết</button>
                        </div>
                    </div>
                </div>
            `;
            list.append(cardHTML);
        });
    }
    list.fadeIn(800); 
}