const Utils = {
    formatCurrency: (amount) => {
        return Number(amount).toLocaleString('vi-VN') + ' VND';
    },
    calculateNights: (checkin, checkout) => {
        if (!checkin || !checkout) return 0;
        const start = new Date(checkin);
        const end = new Date(checkout);
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);
        const timeDiff = end.getTime() - start.getTime();
        return Math.round(timeDiff / (1000 * 3600 * 24));
    },
    generateId: () => Math.floor(Math.random() * 1000000)
};