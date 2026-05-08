import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header "Authorization"
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
    }

    // Giải mã token
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    
    // Gắn thông tin user vào request để các hàm sau sử dụng
    req.user = decoded; 
    
    next(); // Cho phép đi tiếp vào Controller
  } catch (error) {
    res.status(401).json({ message: "Phiên đăng nhập hết hạn hoặc không hợp lệ" });
  }
};