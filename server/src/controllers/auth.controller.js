import User from '../models/auth.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client();
const getJwtSecret = () => process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

const createAuthResponse = (user) => {
  const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: '1d' });

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    },
  };
};

export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email da ton tai' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      fullName,
      authProvider: 'local',
    });

    res.status(201).json({ message: 'Dang ky thanh cong' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Nguoi dung khong ton tai' });

    if (!user.password) {
      return res.status(400).json({ message: 'Tai khoan nay dang nhap bang Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mat khau khong dung' });

    res.json(createAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Thieu Google credential' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Server chua cau hinh GOOGLE_CLIENT_ID' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: 'Khong lay duoc email tu Google' });
    }

    let user = await User.findOne({ email: payload.email });

    if (user) {
      user.googleId = user.googleId || payload.sub;
      user.avatar = payload.picture || user.avatar;
      await user.save();
    } else {
      user = await User.create({
        email: payload.email,
        fullName: payload.name || payload.email,
        googleId: payload.sub,
        avatar: payload.picture || '',
        authProvider: 'google',
      });
    }

    res.json(createAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
