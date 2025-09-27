/**
 * Format giá tiền theo định dạng VND
 * @param {number|string} price - Giá tiền cần format
 * @returns {string} Giá tiền đã được format theo định dạng VND
 */
export const formatPriceVND = (price) => {
    // Chuyển đổi price thành number nếu là string
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Kiểm tra nếu price không hợp lệ
    if (isNaN(numericPrice)) {
        return '0 VND';
    }
    
    // Format theo định dạng VND với dấu phẩy ngăn cách hàng nghìn
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numericPrice);
};

/**
 * Format giá tiền theo định dạng VND đơn giản (chỉ có dấu phẩy ngăn cách)
 * @param {number|string} price - Giá tiền cần format
 * @returns {string} Giá tiền đã được format với dấu phẩy ngăn cách
 */
export const formatPriceSimple = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numericPrice)) {
        return '0 VND';
    }
    
    return `${numericPrice.toLocaleString('vi-VN')} VND`;
};
