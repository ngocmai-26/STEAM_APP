/**
 * Format thời gian từ phút sang giờ và phút
 * @param {number|string} minutes - Thời gian tính bằng phút
 * @returns {string} Thời gian đã được format (VD: "2 giờ 30 phút")
 */
export const formatDuration = (minutes) => {
    // Chuyển đổi minutes thành number nếu là string
    const numericMinutes = typeof minutes === 'string' ? parseInt(minutes) : minutes;
    
    // Kiểm tra nếu minutes không hợp lệ
    if (isNaN(numericMinutes) || numericMinutes < 0) {
        return '0 phút';
    }
    
    // Nếu dưới 60 phút, chỉ hiển thị phút
    if (numericMinutes < 60) {
        return `${numericMinutes} phút`;
    }
    
    // Tính giờ và phút còn lại
    const hours = Math.floor(numericMinutes / 60);
    const remainingMinutes = numericMinutes % 60;
    
    // Nếu không có phút còn lại, chỉ hiển thị giờ
    if (remainingMinutes === 0) {
        return `${hours} giờ`;
    }
    
    // Hiển thị cả giờ và phút
    return `${hours} giờ ${remainingMinutes} phút`;
};

/**
 * Format thời gian ngắn gọn (VD: "2h 30m")
 * @param {number|string} minutes - Thời gian tính bằng phút
 * @returns {string} Thời gian đã được format ngắn gọn
 */
export const formatDurationShort = (minutes) => {
    const numericMinutes = typeof minutes === 'string' ? parseInt(minutes) : minutes;
    
    if (isNaN(numericMinutes) || numericMinutes < 0) {
        return '0m';
    }
    
    if (numericMinutes < 60) {
        return `${numericMinutes}m`;
    }
    
    const hours = Math.floor(numericMinutes / 60);
    const remainingMinutes = numericMinutes % 60;
    
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
};
