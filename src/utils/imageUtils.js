/**
 * Chuyển đổi Google Drive link thành direct image URL
 * @param {string} url - URL gốc (có thể là Google Drive link hoặc URL thông thường)
 * @returns {string} - Direct image URL
 */
export const convertToDirectImageUrl = (url) => {
  if (!url) {
    console.log('⚠️ [imageUtils] URL is empty');
    return null;
  }

  // Trim URL để loại bỏ spaces và trailing slash
  url = url.trim();

  // Nếu đã là direct image URL (lh3.googleusercontent.com) hoặc không phải Google Drive, trả về nguyên bản
  if (url.includes('lh3.googleusercontent.com')) {
    console.log('✅ [imageUtils] Already a direct Google image URL, returning as-is:', url);
    return url;
  }
  
  if (!url.includes('drive.google.com')) {
    console.log('✅ [imageUtils] Not a Google Drive URL, returning as-is:', url);
    return url;
  }

  // Xử lý Google Drive links
  // Format 1: https://drive.google.com/file/d/FILE_ID/view
  // Format 2: https://drive.google.com/open?id=FILE_ID
  // Format 3: https://drive.google.com/uc?id=FILE_ID (đã là direct)
  // Format 4: https://drive.google.com/file/d/FILE_ID (không có /view, có thể có trailing slash)
  
  let fileId = null;

  // Lấy file ID từ các format khác nhau
  if (url.includes('/file/d/')) {
    // Format: https://drive.google.com/file/d/FILE_ID/view hoặc /file/d/FILE_ID/ hoặc /file/d/FILE_ID
    // Regex sẽ match file ID cho đến khi gặp ký tự không phải alphanumeric, underscore, hoặc dash
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      fileId = match[1];
      console.log('✅ [imageUtils] Found file ID from /file/d/ format:', fileId);
    } else {
      console.warn('⚠️ [imageUtils] Could not extract file ID from /file/d/ format:', url);
    }
  } else if (url.includes('id=')) {
    // Format: https://drive.google.com/open?id=FILE_ID hoặc /uc?id=FILE_ID
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      fileId = match[1];
      console.log('✅ [imageUtils] Found file ID from id= format:', fileId);
    } else {
      console.warn('⚠️ [imageUtils] Could not extract file ID from id= format:', url);
    }
  } else if (url.includes('/uc?') || url.includes('/uc?id=')) {
    // Nếu đã là uc? format, extract file ID và convert sang lh3 format
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      const directUrl = `https://lh3.googleusercontent.com/d/${fileId}=w400`;
      console.log('✅ [imageUtils] Converting uc? format to lh3 format:', directUrl);
      return directUrl;
    }
    // Nếu không extract được, trả về nguyên bản
    console.log('✅ [imageUtils] Already a direct URL:', url);
    return url;
  }

  // Nếu tìm thấy file ID, chuyển đổi thành direct image URL
  if (fileId) {
    // Sử dụng format lh3.googleusercontent.com (format đúng cho Google Drive images)
    // Format: https://lh3.googleusercontent.com/d/FILE_ID=w400
    // w400 = width 400px, có thể thay đổi: w200, w400, w800, w1200, etc.
    const directUrl = `https://lh3.googleusercontent.com/d/${fileId}=w400`;
    console.log('✅ [imageUtils] Converted to direct URL:', directUrl);
    return directUrl;
  }

  // Nếu không thể parse, log warning và trả về URL gốc
  console.warn('⚠️ [imageUtils] Could not parse Google Drive URL, returning original:', url);
  return url;
};

/**
 * Xử lý image URL với fallback
 * @param {string} url - URL gốc
 * @param {string} fallback - URL fallback nếu không có URL hoặc URL không hợp lệ
 * @returns {string} - URL đã xử lý
 */
/**
 * Kiểm tra xem URL có hợp lệ không (có chứa file ID hoặc là URL ảnh hợp lệ)
 */
const isValidImageUrl = (url) => {
  if (!url || url.trim() === '') return false;
  
  // Nếu chỉ là domain Google Drive mà không có file ID
  if (url === 'https://drive.google.com' || url === 'https://drive.google.com/') {
    return false;
  }
  
  // Nếu là Google Drive URL, kiểm tra xem có file ID không
  if (url.includes('drive.google.com')) {
    // Kiểm tra xem có chứa file ID pattern không
    const hasFileId = url.includes('/file/d/') || url.includes('id=');
    return hasFileId;
  }
  
  // Các URL khác (http/https) đều được coi là hợp lệ
  return url.startsWith('http://') || url.startsWith('https://');
};

export const getImageUrl = (url, fallback = null) => {
  console.log('🔍 [imageUtils] getImageUrl called with:', url);
  
  // Nếu không có URL hoặc URL không hợp lệ, dùng fallback
  if (!isValidImageUrl(url)) {
    console.log('⚠️ [imageUtils] URL is invalid, using fallback. URL:', url);
    return fallback;
  }

  // Convert URL
  const directUrl = convertToDirectImageUrl(url);
  
  // Kiểm tra lại URL sau khi convert
  if (!isValidImageUrl(directUrl)) {
    console.log('⚠️ [imageUtils] Converted URL is invalid, using fallback. Converted URL:', directUrl);
    return fallback;
  }

  console.log('✅ [imageUtils] Using converted URL:', directUrl);
  return directUrl;
};

