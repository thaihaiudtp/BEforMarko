const multer = require('multer');

// Dùng memory storage để không lưu file tạm trên ổ đĩa
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;