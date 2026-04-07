const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const normalizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

const register = async (req, res, next) => {
  const { name, email: rawEmail, password, role } = req.body;
  const email = normalizeEmail(rawEmail);

  if (!name || !email || !password || !role) {
    return next(new ApiError(400, 'name, email, password and role are required'));
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive'
      }
    }
  });
  if (existingUser) {
    return next(new ApiError(409, 'Email already in use'));
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
      role
    },
    select: {
      user_id: true,
      name: true,
      email: true,
      role: true,
      created_at: true
    }
  });

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.status(201).json(new ApiResponse(201, { token, user }, 'User registered successfully'));

};

const login = async (req, res, next) => {
  const { email: rawEmail, password } = req.body;
  const email = normalizeEmail(rawEmail);

  console.log('[auth] login attempt:', email);

  if (!email || !password) {
    return next(new ApiError(400, 'email and password are required'));
  }

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive'
      }
    }
  });
  if (!user) {
    console.log('[auth] login failed - user not found:', email);
    return next(new ApiError(401, 'Invalid credentials'));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    console.log('[auth] login failed - invalid password for:', email);
    return next(new ApiError(401, 'Invalid credentials'));
  }

  console.log('[auth] login success:', email, 'user_id=', user.user_id);

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  const safeUser = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };

  return res.status(200).json(new ApiResponse(200, { token, user: safeUser }, 'Login successful'));
};

const me = async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'User not authenticated'));
  }

  return res.status(200).json(new ApiResponse(200, { user: req.user }, 'User profile fetched'));
};

module.exports = {
  register,
  login,
  me
};
