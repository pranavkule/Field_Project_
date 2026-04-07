const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const childRoutes = require('./routes/child.routes');
const staffRoutes = require('./routes/staff.routes');
const healthRoutes = require('./routes/health.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const donationRoutes = require('./routes/donation.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const expenseRoutes = require('./routes/expense.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'https://localhost:5173',
  'https://127.0.0.1:5173',
  'https://localhost:5174',
  'https://127.0.0.1:5174'
];

const isLocalOrigin = (origin) => {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isLocalOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(morgan('dev'));

// Placeholder health route
app.get('/api/health', (req, res) => {
  res.json({ statusCode: 200, data: { status: 'ok' }, message: 'Server is running' });
});

// Server readiness check (no auth)
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// catch-all 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

module.exports = app;
