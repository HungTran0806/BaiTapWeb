export const sanPham = [
    { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 }, 
    { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 }, 
    { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 }, 
    { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 }, 
    { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 }, 
    { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 }, 
    { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

export const khachHang = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0912345678', address: '123 Nguyễn Huệ, Q1, TP.HCM' },
    { id: 2, name: 'Trần Thị B', phone: '0987654321', address: '456 Lê Lợi, Q1, TP.HCM' },
    { id: 3, name: 'Phạm Văn C', phone: '0913456789', address: '789 Hàm Nghi, Q1, TP.HCM' },
    { id: 4, name: 'Lê Thị D', phone: '0934567891', address: '321 Võ Văn Kiệt, Q1, TP.HCM' },
    { id: 5, name: 'Hoàng Văn E', phone: '0945678912', address: '654 Trần Hưng Đạo, Q1, TP.HCM' },
    { id: 6, name: 'Vũ Thị F', phone: '0956789123', address: '987 Ngô Quyền, Q1, TP.HCM' },
];

export const donHang = [
    {
        id: 'DH001', 
        customerId: 1,
        customerName: 'Nguyễn Văn A', 
        phone: '0912345678', 
        address: '123 Nguyễn Huệ, Q1, TP.HCM', 
        products: [ { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 } ], 
        totalAmount: 25000000, 
        status: 'Chờ xác nhận', 
        createdAt: '2024-01-15' 
    },
    {
        id: 'DH002', 
        customerId: 2,
        customerName: 'Trần Thị B', 
        phone: '0987654321', 
        address: '456 Lê Lợi, Q1, TP.HCM', 
        products: [ 
            { productId: 2, productName: 'iPhone 15 Pro Max', quantity: 2, price: 30000000 },
            { productId: 6, productName: 'AirPods Pro 2', quantity: 1, price: 6000000 }
        ], 
        totalAmount: 66000000, 
        status: 'Đang giao', 
        createdAt: '2024-01-14' 
    },
    {
        id: 'DH003', 
        customerId: 3,
        customerName: 'Phạm Văn C', 
        phone: '0913456789', 
        address: '789 Hàm Nghi, Q1, TP.HCM', 
        products: [ { productId: 3, productName: 'Samsung Galaxy S24', quantity: 1, price: 22000000 } ], 
        totalAmount: 22000000, 
        status: 'Hoàn thành', 
        createdAt: '2024-01-13' 
    }
];