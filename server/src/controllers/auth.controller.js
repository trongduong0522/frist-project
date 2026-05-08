import User from '../models/auth.model.js';
import bcrypt from 'bcryptjs'; // Cần cài: pnpm add bcryptjs jsonwebtoken
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    // 1. Kiểm tra email tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    // 2. Mã hóa mật khẩu (Không bao giờ lưu mật khẩu thuần vào DB)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo user mới
    const newUser = await User.create({ email, password: hashedPassword, fullName });
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng" });

    // Tạo mã xác thực (Token)
    const token = jwt.sign({ id: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1d' });
    
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};