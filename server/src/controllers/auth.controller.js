const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const {
  createRequest,
  updateRequest,
  getById,
  listAll,
  findLatestByEmail,
} = require('../utils/registrationRequestsStore');

const SUPER_ADMIN_EMAIL = 'suryodaybalgruh@gmail.com';
const SUPER_ADMIN_PASSWORD = 'suryodaybalgruhadmin';

const normalizeRole = (role) => {
  const value = typeof role === 'string' ? role.trim().toLowerCase() : '';
  if (value === 'administrator' || value === 'superadmin') return 'admin';
  if (value === 'admin' || value === 'viewer') return value;
  return value;
};

const normalizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

const isSuperAdminRequest = (req) => {
  return normalizeEmail(req?.user?.email) === SUPER_ADMIN_EMAIL;
};

const register = async (req, res, next) => {
  const { name, email: rawEmail, password, role, organization } = req.body;
  const email = normalizeEmail(rawEmail);
  const normalizedRole = normalizeRole(role);

  if (!name || !email || !password || !normalizedRole) {
    return next(new ApiError(400, 'name, email, password and role are required'));
  }

  if (!['admin', 'viewer'].includes(normalizedRole)) {
    return next(new ApiError(400, 'role must be admin or viewer'));
  }

  if (email === SUPER_ADMIN_EMAIL) {
    return next(new ApiError(400, 'This email is reserved for super admin access'));
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

  const latestRequest = await findLatestByEmail(email);
  if (latestRequest?.status === 'pending') {
    return next(new ApiError(409, 'Registration request already pending approval'));
  }

  const password_hash = await bcrypt.hash(password, 10);

  const request = await createRequest({
    name,
    email,
    password_hash,
    role: normalizedRole,
    organization: organization || '',
  });

  return res.status(202).json(new ApiResponse(202, {
    request_id: request.request_id,
    status: request.status,
    email: request.email,
    role: request.role,
    name: request.name,
    organization: request.organization,
    created_at: request.created_at,
  }, 'Registration request submitted. Waiting for super admin approval.'));

};

const login = async (req, res, next) => {
  const { email: rawEmail, password } = req.body;
  const email = normalizeEmail(rawEmail);

  console.log('[auth] login attempt:', email);

  if (!email || !password) {
    return next(new ApiError(400, 'email and password are required'));
  }

  if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
    const superAdminUser = {
      user_id: 'superadmin-local',
      name: 'Super Admin',
      email: SUPER_ADMIN_EMAIL,
      role: 'admin',
      created_at: new Date().toISOString(),
    };

    const token = jwt.sign(
      { user_id: superAdminUser.user_id, role: superAdminUser.role, name: superAdminUser.name, email: superAdminUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json(new ApiResponse(200, { token, user: superAdminUser }, 'Super admin login successful'));
  }

  const latestRequest = await findLatestByEmail(email);
  if (latestRequest?.status === 'pending') {
    return next(new ApiError(403, 'Your registration is pending approval from NGO'));
  }
  if (latestRequest?.status === 'declined') {
    return next(new ApiError(403, 'Your registration request was declined by NGO'));
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
    role: normalizeRole(user.role),
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

const getRegistrationRequests = async (req, res, next) => {
  if (!isSuperAdminRequest(req)) {
    return next(new ApiError(403, 'Only super admin can access registration requests'));
  }

  const requests = await listAll();
  return res.status(200).json(new ApiResponse(200, {
    items: requests.filter((item) => item.status === 'pending'),
    total: requests.filter((item) => item.status === 'pending').length,
  }, 'Pending registration requests fetched'));
};

const getRegistrationRequestStatus = async (req, res, next) => {
  const { id } = req.params;
  const request = await getById(id);

  if (!request) {
    return next(new ApiError(404, 'Registration request not found'));
  }

  return res.status(200).json(new ApiResponse(200, {
    request_id: request.request_id,
    status: request.status,
    reviewed_at: request.reviewed_at,
    review_note: request.review_note,
  }, 'Registration request status fetched'));
};

const approveRegistrationRequest = async (req, res, next) => {
  if (!isSuperAdminRequest(req)) {
    return next(new ApiError(403, 'Only super admin can approve registration requests'));
  }

  const { id } = req.params;
  const request = await getById(id);
  if (!request) {
    return next(new ApiError(404, 'Registration request not found'));
  }
  if (request.status !== 'pending') {
    return next(new ApiError(400, `Request already ${request.status}`));
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: request.email,
        mode: 'insensitive'
      }
    }
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: request.name,
        email: request.email,
        password_hash: request.password_hash,
        role: request.role,
      },
    });
  }

  const updated = await updateRequest(id, () => ({
    status: 'approved',
    reviewed_at: new Date().toISOString(),
    reviewed_by: SUPER_ADMIN_EMAIL,
    review_note: 'Approved by super admin',
  }));

  return res.status(200).json(new ApiResponse(200, updated, 'Registration request approved'));
};

const declineRegistrationRequest = async (req, res, next) => {
  if (!isSuperAdminRequest(req)) {
    return next(new ApiError(403, 'Only super admin can decline registration requests'));
  }

  const { id } = req.params;
  const request = await getById(id);
  if (!request) {
    return next(new ApiError(404, 'Registration request not found'));
  }
  if (request.status !== 'pending') {
    return next(new ApiError(400, `Request already ${request.status}`));
  }

  const updated = await updateRequest(id, () => ({
    status: 'declined',
    reviewed_at: new Date().toISOString(),
    reviewed_by: SUPER_ADMIN_EMAIL,
    review_note: 'Declined by super admin',
  }));

  return res.status(200).json(new ApiResponse(200, updated, 'Registration request declined'));
};

module.exports = {
  register,
  login,
  me,
  getRegistrationRequests,
  getRegistrationRequestStatus,
  approveRegistrationRequest,
  declineRegistrationRequest
};
