const BASE_URL = "https://69f9a6e3c509a40d3aa2f039.mockapi.io/api/v1"; 
const API = {
    getRooms: async () => {
        try {
            const response = await fetch(`${BASE_URL}/rooms`);
            return await response.json();
        } catch (error) {
            console.error("Lỗi lấy danh sách phòng:", error);
            return [];
        }
    },
    addRoom: async (roomData) => {
        await fetch(`${BASE_URL}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData)
        });
    },
    updateRoom: async (id, roomData) => {
        await fetch(`${BASE_URL}/rooms/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData)
        });
    },
    deleteRoom: async (id) => {
        await fetch(`${BASE_URL}/rooms/${id}`, {
            method: 'DELETE'
        });
    },
    getBookings: async () => {
        try {
            const response = await fetch(`${BASE_URL}/bookings`);
            return await response.json();
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn:", error);
            return [];
        }
    },
    addBooking: async (bookingData) => {
        await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
    },
    updateBookingStatus: async (id, newStatus) => {
        await fetch(`${BASE_URL}/bookings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
    }
};